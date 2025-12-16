import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { useCoursePlanner } from '../../context/CoursePlannerContext';
import { calculateOrthogonalPath, Point, Rect, Bounds } from '../../utils/pathfinding';
import styles from './PrerequisiteLines.module.css';

interface PrerequisiteLinesProps {
  hoveredCourseId: string | null;
  onPrereqColorsChange?: (colors: Map<string, string>) => void;
}

interface LineData {
  path: Point[];
  prereqId: string;
  color: string;
}

const PREREQ_COLORS = [
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#14b8a6',
  '#f97316',
];

export default function PrerequisiteLines({ hoveredCourseId, onPrereqColorsChange }: PrerequisiteLinesProps) {
  const { findCourseData, state } = useCoursePlanner();
  const [lines, setLines] = React.useState<LineData[]>([]);
  const lastHoveredRectRef = useRef<DOMRect | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  React.useEffect(() => {
    if (!hoveredCourseId) {
      setLines([]);
      lastHoveredRectRef.current = null;
      if (onPrereqColorsChange) {
        onPrereqColorsChange(new Map());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const hoveredCourse = findCourseData(hoveredCourseId);
    if (!hoveredCourse?.prereq) {
      setLines([]);
      if (onPrereqColorsChange) {
        onPrereqColorsChange(new Map());
      }
      return;
    }

    const prereqList = parsePrerequisites(hoveredCourse.prereq);

    const findElement = (id: string) => 
      document.querySelector(`[data-course-id="${id}"]`) || 
      document.querySelector(`[data-course-code="${id}"]`);

    const updateLines = () => {
      const hoveredElement = findElement(hoveredCourseId);
      if (!hoveredElement) {
        setLines([]);
        return;
      }

      const hoveredRect = hoveredElement.getBoundingClientRect();

      const lastRect = lastHoveredRectRef.current;
      const hasChanged = !lastRect ||
        Math.abs(lastRect.top - hoveredRect.top) > 0.5 ||
        Math.abs(lastRect.left - hoveredRect.left) > 0.5 ||
        Math.abs(lastRect.width - hoveredRect.width) > 0.5 ||
        Math.abs(lastRect.height - hoveredRect.height) > 0.5;

      if (!hasChanged) {
        animationFrameRef.current = requestAnimationFrame(updateLines);
        return;
      }

      lastHoveredRectRef.current = hoveredRect;

      const allCourseElements = document.querySelectorAll('[data-course-id]');
      const obstacles: Rect[] = [];
      let minY = Infinity;
      let maxY = -Infinity;
      let minX = Infinity;
      let maxX = -Infinity;

      allCourseElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        obstacles.push({
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height
        });

        minY = Math.min(minY, rect.top);
        maxY = Math.max(maxY, rect.bottom);
        minX = Math.min(minX, rect.left);
        maxX = Math.max(maxX, rect.right);
      });

      const bounds: Bounds = {
        minX: Math.max(0, minX - 50),
        maxX: Math.min(window.innerWidth, maxX + 50),
        minY: minY + 20,
        maxY: Math.min(window.innerHeight, maxY + 50)
      };

      const newLines: LineData[] = [];

      prereqList.forEach((prereqId, index) => {
        const prereqElement = findElement(prereqId);
        
        if (prereqElement) {
          if (prereqElement.closest('[data-region="course-pool"]')) {
            return;
          }

          const prereqRect = prereqElement.getBoundingClientRect();

          const prereqIsLeft = prereqRect.left < hoveredRect.left;

          const edgeOffset = 5;

          let startX = prereqIsLeft ? prereqRect.right + edgeOffset : prereqRect.left - edgeOffset;
          let startY = prereqRect.top + prereqRect.height / 2;

          let endX = prereqIsLeft ? hoveredRect.left - edgeOffset : hoveredRect.right + edgeOffset;
          let endY = hoveredRect.top + hoveredRect.height / 2;

          startY = Math.max(bounds.minY, Math.min(bounds.maxY, startY));
          endY = Math.max(bounds.minY, Math.min(bounds.maxY, endY));

          const start: Point = { x: startX, y: startY };
          const end: Point = { x: endX, y: endY };

          const filteredObstacles = obstacles.filter((obs, index) => {
            const el = allCourseElements[index];
            const courseId = el.getAttribute('data-course-id');
            const courseCode = el.getAttribute('data-course-code');
            return (courseId !== prereqId && courseCode !== prereqId) && 
                   (courseId !== hoveredCourseId && courseCode !== hoveredCourseId);
          });

          const path = calculateOrthogonalPath(start, end, filteredObstacles, bounds);

          const color = PREREQ_COLORS[index % PREREQ_COLORS.length];

          if (path.length >= 2) {
            newLines.push({
              path,
              prereqId,
              color
            });
          }
        }
      });

      setLines(newLines);

      if (onPrereqColorsChange) {
        const colorMap = new Map<string, string>();
        newLines.forEach(line => {
          colorMap.set(line.prereqId, line.color);
        });
        onPrereqColorsChange(colorMap);
      }
      
      animationFrameRef.current = requestAnimationFrame(updateLines);
    };

    updateLines();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hoveredCourseId, findCourseData, state, onPrereqColorsChange]);

  if (lines.length === 0) {
    return null;
  }

  return ReactDOM.createPortal(
    <svg
      className={styles.svgOverlay}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10000
      }}
    >
      {lines.map((line, index) => {
        const pathString = line.path.map((point, i) =>
          `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');

        return (
          <g key={`${line.prereqId}-${index}`}>
            <path
              d={pathString}
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              fill="none"
              className={styles.lineShadow}
            />
            <path
              d={pathString}
              stroke={line.color}
              strokeWidth="2"
              strokeDasharray="6 3"
              fill="none"
              className={styles.line}
            />
            <path
              d={pathString}
              stroke={line.color}
              strokeWidth="5"
              strokeDasharray="6 3"
              fill="none"
              filter="blur(3px)"
              opacity="0.3"
              className={styles.lineGlow}
            />
          </g>
        );
      })}
    </svg>,
    document.body
  );
}

function parsePrerequisites(prereq: string): string[] {
  const result: string[] = [];

  const alternatives = prereq.split(' o ');

  alternatives.forEach(alt => {
    const andParts = alt.split(' y ');
    andParts.forEach(part => {
      const cleaned = part.replace(/[()]/g, '').trim();
      const courseId = cleaned.replace('(c)', '').trim();
      if (courseId && !result.includes(courseId)) {
        result.push(courseId);
      }
    });
  });

  return result;
}