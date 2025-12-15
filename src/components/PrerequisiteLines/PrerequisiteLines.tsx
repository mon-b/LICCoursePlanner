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

// Array of distinct colors for multiple prerequisites
const PREREQ_COLORS = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#f97316', // Orange
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

    // Parse prerequisites
    const prereqList = parsePrerequisites(hoveredCourse.prereq);

    const updateLines = () => {
      const hoveredElement = document.querySelector(`[data-course-id="${hoveredCourseId}"]`);
      if (!hoveredElement) {
        setLines([]);
        return;
      }

      const hoveredRect = hoveredElement.getBoundingClientRect();

      // Check if position changed
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

      // Collect all course elements as obstacles
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

        // Track bounds
        minY = Math.min(minY, rect.top);
        maxY = Math.max(maxY, rect.bottom);
        minX = Math.min(minX, rect.left);
        maxX = Math.max(maxX, rect.right);
      });

      // Create bounds with some margin
      const bounds: Bounds = {
        minX: Math.max(0, minX - 50),
        maxX: Math.min(window.innerWidth, maxX + 50),
        minY: minY + 20, // Add offset to prevent lines from going above the top courses
        maxY: Math.min(window.innerHeight, maxY + 50)
      };

      const newLines: LineData[] = [];

      prereqList.forEach((prereqId, index) => {
        const prereqElement = document.querySelector(`[data-course-id="${prereqId}"]`);
        if (prereqElement) {
          const prereqRect = prereqElement.getBoundingClientRect();

          // Determine which side to use based on relative positions
          const prereqIsLeft = prereqRect.left < hoveredRect.left;

          // Small offset to ensure points are outside the course rectangles
          const edgeOffset = 5;

          // Calculate start point (slightly outside the right or left edge of prerequisite course)
          let startX = prereqIsLeft ? prereqRect.right + edgeOffset : prereqRect.left - edgeOffset;
          let startY = prereqRect.top + prereqRect.height / 2;

          // Calculate end point (slightly outside the left or right edge of hovered course)
          let endX = prereqIsLeft ? hoveredRect.left - edgeOffset : hoveredRect.right + edgeOffset;
          let endY = hoveredRect.top + hoveredRect.height / 2;

          // Ensure points are within bounds (especially Y coordinate)
          startY = Math.max(bounds.minY, Math.min(bounds.maxY, startY));
          endY = Math.max(bounds.minY, Math.min(bounds.maxY, endY));

          const start: Point = { x: startX, y: startY };
          const end: Point = { x: endX, y: endY };

          // Use all courses as obstacles EXCEPT the source and destination
          // This prevents false collision detection at the start/end points
          const filteredObstacles = obstacles.filter((obs, index) => {
            const el = allCourseElements[index];
            const courseId = el.getAttribute('data-course-id');
            return courseId !== prereqId && courseId !== hoveredCourseId;
          });

          const path = calculateOrthogonalPath(start, end, filteredObstacles, bounds);

          // Assign color based on index (cycle through colors if more prerequisites than colors)
          const color = PREREQ_COLORS[index % PREREQ_COLORS.length];

          // Only add the line if it has a valid path with waypoints
          // This prevents showing lines that pass through courses
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

      // Notify parent of prerequisite colors
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
        // Convert path points to SVG path string
        const pathString = line.path.map((point, i) =>
          `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ');

        return (
          <g key={`${line.prereqId}-${index}`}>
            {/* Shadow path */}
            <path
              d={pathString}
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              fill="none"
              className={styles.lineShadow}
            />
            {/* Main path with individual color */}
            <path
              d={pathString}
              stroke={line.color}
              strokeWidth="2"
              strokeDasharray="6 3"
              fill="none"
              className={styles.line}
            />
            {/* Glow effect with color */}
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
  // Parse prerequisite string like "MAT1610 y MAT1620" or "IIC1103" or "MAT1610 o MAT1620"
  const result: string[] = [];

  // Split by "o" (or) to get alternatives
  const alternatives = prereq.split(' o ');

  alternatives.forEach(alt => {
    // For each alternative, split by "y" (and)
    const andParts = alt.split(' y ');
    andParts.forEach(part => {
      const cleaned = part.replace(/[()]/g, '').trim();
      // Remove (c) marker for corequisites
      const courseId = cleaned.replace('(c)', '').trim();
      if (courseId && !result.includes(courseId)) {
        result.push(courseId);
      }
    });
  });

  return result;
}
