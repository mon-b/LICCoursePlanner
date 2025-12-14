// Pathfinding utility for drawing lines that avoid obstacles

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const PADDING = 2; // Minimal padding - just enough to not touch course borders
const MARGIN = 10; // Margin from viewport edges
const GAP_DETECTION_THRESHOLD = 8; // Minimum gap size to consider as passable (even small gaps)

export function calculateOrthogonalPath(
  start: Point,
  end: Point,
  obstacles: Rect[],
  bounds?: Bounds
): Point[] {
  // Expand obstacles with padding
  const expandedObstacles = obstacles.map(obs => ({
    left: obs.left - PADDING,
    top: obs.top - PADDING,
    right: obs.right + PADDING,
    bottom: obs.bottom + PADDING,
    width: obs.width + PADDING * 2,
    height: obs.height + PADDING * 2
  }));

  // Simple orthogonal routing using waypoints
  // Strategy: Move horizontally first, then vertically, avoiding obstacles

  const path: Point[] = [start];

  // Always use orthogonal routing (no diagonal lines)
  const waypoints = findWaypoints(start, end, expandedObstacles, bounds);
  path.push(...waypoints);
  path.push(end);

  // Validate that the entire path doesn't intersect obstacles
  if (!isPathValid(path, expandedObstacles)) {
    // If path is invalid, try to find ANY valid path by testing more offsets
    const emergencyPath = findEmergencyPath(start, end, expandedObstacles, bounds);
    if (emergencyPath) {
      return emergencyPath;
    }
    // As absolute last resort, return just start and end (line won't render well but won't crash)
    return [start, end];
  }

  return path;
}

function isPathValid(path: Point[], obstacles: Rect[]): boolean {
  // Check all segments of the path
  for (let i = 0; i < path.length - 1; i++) {
    const segment = { start: path[i], end: path[i + 1] };

    // Check if this segment intersects any obstacle
    for (const obs of obstacles) {
      if (lineIntersectsRect(segment, obs)) {
        return false;
      }
    }
  }
  return true;
}

function findEmergencyPath(start: Point, end: Point, obstacles: Rect[], bounds?: Bounds): Point[] | null {
  // Try more extreme offsets to find ANY valid path
  const largeOffsets = [100, -100, 150, -150, 200, -200, 300, -300, 400, -400];

  // Try horizontal routing with large offsets
  for (const offset of largeOffsets) {
    const p1 = { x: start.x, y: start.y + offset };
    const p2 = { x: end.x, y: start.y + offset };

    // Check bounds
    if (bounds && (p1.y < bounds.minY || p1.y > bounds.maxY)) {
      continue;
    }

    const path = [start, p1, p2, end];
    if (isPathValid(path, obstacles)) {
      return path;
    }
  }

  // Try vertical routing with large offsets
  for (const offset of largeOffsets) {
    const p1 = { x: start.x + offset, y: start.y };
    const p2 = { x: start.x + offset, y: end.y };

    const path = [start, p1, p2, end];
    if (isPathValid(path, obstacles)) {
      return path;
    }
  }

  return null;
}

function findWaypoints(start: Point, end: Point, obstacles: Rect[], bounds?: Bounds): Point[] {
  const waypoints: Point[] = [];

  // Determine if we should go up/down first or left/right first
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Try vertical-first route
  const verticalFirst = tryVerticalFirstRoute(start, end, obstacles, bounds);
  const horizontalFirst = tryHorizontalFirstRoute(start, end, obstacles, bounds);

  // Choose the route with fewer waypoints
  if (verticalFirst && horizontalFirst) {
    return verticalFirst.length <= horizontalFirst.length ? verticalFirst : horizontalFirst;
  } else if (verticalFirst) {
    return verticalFirst;
  } else if (horizontalFirst) {
    return horizontalFirst;
  }

  // Fallback: use corner waypoints that respect bounds
  let midX = start.x + dx / 2;
  let midY = start.y + dy / 2;

  // Ensure midpoints are within bounds
  if (bounds) {
    midX = Math.max(bounds.minX, Math.min(bounds.maxX, midX));
    midY = Math.max(bounds.minY, Math.min(bounds.maxY, midY));
  }

  // Create L-shaped path (horizontal then vertical)
  const point1: Point = { x: midX, y: start.y };
  const point2: Point = { x: midX, y: end.y };

  // Only add points if they're within bounds
  if (!bounds || (point1.y >= bounds.minY && point1.y <= bounds.maxY)) {
    waypoints.push(point1);
  }
  if (!bounds || (point2.y >= bounds.minY && point2.y <= bounds.maxY)) {
    waypoints.push(point2);
  }

  return waypoints;
}

function tryVerticalFirstRoute(start: Point, end: Point, obstacles: Rect[], bounds?: Bounds): Point[] | null {
  const waypoints: Point[] = [];
  let current = { ...start };

  // Move vertically to end.y
  const verticalTarget = { x: current.x, y: end.y };
  const verticalSegment = { start: current, end: verticalTarget };

  // Ensure vertical target is within bounds
  if (bounds && (verticalTarget.y < bounds.minY || verticalTarget.y > bounds.maxY)) {
    return null;
  }

  if (!obstacles.some(obs => lineIntersectsRect(verticalSegment, obs))) {
    waypoints.push(verticalTarget);
    current = verticalTarget;
  } else {
    // Find a horizontal offset to avoid obstacles
    const offset = findHorizontalOffset(current, end.y, obstacles, bounds);
    if (offset === null) return null;

    const p1 = { x: current.x + offset, y: current.y };
    const p2 = { x: current.x + offset, y: end.y };

    // Validate both segments
    const seg1 = { start: current, end: p1 };
    const seg2 = { start: p1, end: p2 };

    if (obstacles.some(obs => lineIntersectsRect(seg1, obs)) ||
        obstacles.some(obs => lineIntersectsRect(seg2, obs))) {
      return null;
    }

    waypoints.push(p1);
    waypoints.push(p2);
    current = p2;
  }

  // Move horizontally to end.x
  const horizontalTarget = { x: end.x, y: current.y };
  const horizontalSegment = { start: current, end: horizontalTarget };

  if (obstacles.some(obs => lineIntersectsRect(horizontalSegment, obs))) {
    return null;
  }

  return waypoints;
}

function tryHorizontalFirstRoute(start: Point, end: Point, obstacles: Rect[], bounds?: Bounds): Point[] | null {
  const waypoints: Point[] = [];
  let current = { ...start };

  // Move horizontally to end.x
  const horizontalTarget = { x: end.x, y: current.y };
  const horizontalSegment = { start: current, end: horizontalTarget };

  if (!obstacles.some(obs => lineIntersectsRect(horizontalSegment, obs))) {
    waypoints.push(horizontalTarget);
    current = horizontalTarget;
  } else {
    // Find a vertical offset to avoid obstacles
    const offset = findVerticalOffset(current, end.x, obstacles, bounds);
    if (offset === null) return null;

    const p1 = { x: current.x, y: current.y + offset };
    const p2 = { x: end.x, y: current.y + offset };

    // Ensure points are within bounds
    if (bounds && (p1.y < bounds.minY || p1.y > bounds.maxY ||
                   p2.y < bounds.minY || p2.y > bounds.maxY)) {
      return null;
    }

    // Validate both segments
    const seg1 = { start: current, end: p1 };
    const seg2 = { start: p1, end: p2 };

    if (obstacles.some(obs => lineIntersectsRect(seg1, obs)) ||
        obstacles.some(obs => lineIntersectsRect(seg2, obs))) {
      return null;
    }

    waypoints.push(p1);
    waypoints.push(p2);
    current = p2;
  }

  // Move vertically to end.y
  const verticalTarget = { x: current.x, y: end.y };
  const verticalSegment = { start: current, end: verticalTarget };

  // Ensure vertical target is within bounds
  if (bounds && (verticalTarget.y < bounds.minY || verticalTarget.y > bounds.maxY)) {
    return null;
  }

  if (obstacles.some(obs => lineIntersectsRect(verticalSegment, obs))) {
    return null;
  }

  return waypoints;
}

function findGapsBetweenObstacles(obstacles: Rect[], bounds: Bounds, region?: { minX: number, maxX: number, minY: number, maxY: number }): { vertical: number[], horizontal: number[] } {
  const verticalGaps: number[] = [];
  const horizontalGaps: number[] = [];

  // Find vertical gaps (X positions between obstacles)
  const sortedByX = [...obstacles].sort((a, b) => a.left - b.left);
  for (let i = 0; i < sortedByX.length - 1; i++) {
    const gap = sortedByX[i + 1].left - sortedByX[i].right;
    if (gap >= GAP_DETECTION_THRESHOLD) {
      const gapCenter = sortedByX[i].right + gap / 2;

      // If region is specified, only include gaps in that region
      if (!region || (gapCenter >= region.minX && gapCenter <= region.maxX)) {
        verticalGaps.push(gapCenter);
      }
    }
  }

  // Find horizontal gaps (Y positions between obstacles)
  const sortedByY = [...obstacles].sort((a, b) => a.top - b.top);
  for (let i = 0; i < sortedByY.length - 1; i++) {
    const gap = sortedByY[i + 1].top - sortedByY[i].bottom;
    if (gap >= GAP_DETECTION_THRESHOLD) {
      const gapCenter = sortedByY[i].bottom + gap / 2;

      // If region is specified, only include gaps in that region
      if (!region || (gapCenter >= region.minY && gapCenter <= region.maxY)) {
        horizontalGaps.push(gapCenter);
      }
    }
  }

  return { vertical: verticalGaps, horizontal: horizontalGaps };
}

function findHorizontalOffset(point: Point, targetY: number, obstacles: Rect[], bounds?: Bounds): number | null {
  // First, try to find gaps between obstacles in the relevant region
  if (bounds) {
    const minY = Math.min(point.y, targetY);
    const maxY = Math.max(point.y, targetY);
    const region = {
      minX: bounds.minX,
      maxX: bounds.maxX,
      minY: minY - 50, // Add some buffer
      maxY: maxY + 50
    };

    const gaps = findGapsBetweenObstacles(obstacles, bounds, region);

    // Try using gap positions
    for (const gapX of gaps.vertical) {
      const offset = gapX - point.x;
      const p1 = { x: gapX, y: point.y };
      const p2 = { x: gapX, y: targetY };

      // Check if points are within bounds
      if (p1.y < bounds.minY || p1.y > bounds.maxY || p2.y < bounds.minY || p2.y > bounds.maxY) {
        continue;
      }

      const segment1 = { start: point, end: p1 };
      const segment2 = { start: p1, end: p2 };

      if (
        !obstacles.some(obs => lineIntersectsRect(segment1, obs)) &&
        !obstacles.some(obs => lineIntersectsRect(segment2, obs))
      ) {
        return offset;
      }
    }
  }

  // Fallback to trying regular offsets
  const offsets = [5, -5, 10, -10, 15, -15, 25, -25, 40, -40, 60, -60, 80, -80, 100, -100, 150, -150, 200, -200];

  for (const offset of offsets) {
    const p1 = { x: point.x + offset, y: point.y };
    const p2 = { x: point.x + offset, y: targetY };

    // Check if points are within bounds
    if (bounds) {
      if (p1.x < bounds.minX || p1.x > bounds.maxX || p1.y < bounds.minY || p1.y > bounds.maxY) {
        continue;
      }
      if (p2.x < bounds.minX || p2.x > bounds.maxX || p2.y < bounds.minY || p2.y > bounds.maxY) {
        continue;
      }
    }

    const segment1 = { start: point, end: p1 };
    const segment2 = { start: p1, end: p2 };

    if (
      !obstacles.some(obs => lineIntersectsRect(segment1, obs)) &&
      !obstacles.some(obs => lineIntersectsRect(segment2, obs))
    ) {
      return offset;
    }
  }

  return null;
}

function findVerticalOffset(point: Point, targetX: number, obstacles: Rect[], bounds?: Bounds): number | null {
  // First, try to find gaps between obstacles in the relevant region
  if (bounds) {
    const minX = Math.min(point.x, targetX);
    const maxX = Math.max(point.x, targetX);
    const region = {
      minX: minX - 50, // Add some buffer
      maxX: maxX + 50,
      minY: bounds.minY,
      maxY: bounds.maxY
    };

    const gaps = findGapsBetweenObstacles(obstacles, bounds, region);

    // Try using horizontal gap positions (Y coordinates)
    for (const gapY of gaps.horizontal) {
      const offset = gapY - point.y;
      const p1 = { x: point.x, y: gapY };
      const p2 = { x: targetX, y: gapY };

      // Check if points are within bounds
      if (gapY < bounds.minY || gapY > bounds.maxY) {
        continue;
      }

      const segment1 = { start: point, end: p1 };
      const segment2 = { start: p1, end: p2 };

      if (
        !obstacles.some(obs => lineIntersectsRect(segment1, obs)) &&
        !obstacles.some(obs => lineIntersectsRect(segment2, obs))
      ) {
        return offset;
      }
    }
  }

  // Fallback to trying regular offsets
  const offsets = [5, -5, 10, -10, 15, -15, 25, -25, 40, -40, 60, -60, 80, -80, 100, -100, 150, -150, 200, -200];

  for (const offset of offsets) {
    const p1 = { x: point.x, y: point.y + offset };
    const p2 = { x: targetX, y: point.y + offset };

    // Check if points are within bounds
    if (bounds) {
      if (p1.x < bounds.minX || p1.x > bounds.maxX || p1.y < bounds.minY || p1.y > bounds.maxY) {
        continue;
      }
      if (p2.x < bounds.minX || p2.x > bounds.maxX || p2.y < bounds.minY || p2.y > bounds.maxY) {
        continue;
      }
    }

    const segment1 = { start: point, end: p1 };
    const segment2 = { start: p1, end: p2 };

    if (
      !obstacles.some(obs => lineIntersectsRect(segment1, obs)) &&
      !obstacles.some(obs => lineIntersectsRect(segment2, obs))
    ) {
      return offset;
    }
  }

  return null;
}

function getLineSegments(start: Point, end: Point): Array<{ start: Point; end: Point }> {
  return [{ start, end }];
}

function lineIntersectsRect(
  line: { start: Point; end: Point },
  rect: Rect
): boolean {
  // Check if line segment intersects with rectangle
  const { start, end } = line;

  // Check if either endpoint is inside the rectangle
  if (pointInRect(start, rect) || pointInRect(end, rect)) {
    return true;
  }

  // Check if line crosses any edge of the rectangle
  const edges = [
    { start: { x: rect.left, y: rect.top }, end: { x: rect.right, y: rect.top } },
    { start: { x: rect.right, y: rect.top }, end: { x: rect.right, y: rect.bottom } },
    { start: { x: rect.right, y: rect.bottom }, end: { x: rect.left, y: rect.bottom } },
    { start: { x: rect.left, y: rect.bottom }, end: { x: rect.left, y: rect.top } }
  ];

  return edges.some(edge => linesIntersect(line, edge));
}

function pointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

function linesIntersect(
  line1: { start: Point; end: Point },
  line2: { start: Point; end: Point }
): boolean {
  const { start: p1, end: p2 } = line1;
  const { start: p3, end: p4 } = line2;

  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);

  if (denom === 0) {
    return false; // Parallel lines
  }

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}
