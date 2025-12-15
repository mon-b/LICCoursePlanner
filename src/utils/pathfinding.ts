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

const PADDING = 10;
const TURN_PENALTY = 10;
const NON_CENTER_PENALTY_MULTIPLIER = 50;

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    const item = { element, priority };
    let contained = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > item.priority) {
        this.items.splice(i, 0, item);
        contained = true;
        break;
      }
    }

    if (!contained) {
      this.items.push(item);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export function calculateOrthogonalPath(
  start: Point,
  end: Point,
  obstacles: Rect[],
  bounds?: Bounds
): Point[] {
  const rStart = { x: Math.round(start.x), y: Math.round(start.y) };
  const rEnd = { x: Math.round(end.x), y: Math.round(end.y) };
  
  const rObstacles = obstacles.map(o => ({
    left: Math.round(o.left),
    top: Math.round(o.top),
    right: Math.round(o.right),
    bottom: Math.round(o.bottom),
    width: Math.round(o.width),
    height: Math.round(o.height)
  }));
  
  const rBounds = bounds ? {
    minX: Math.round(bounds.minX),
    maxX: Math.round(bounds.maxX),
    minY: Math.round(bounds.minY),
    maxY: Math.round(bounds.maxY)
  } : undefined;

  const xCoords = new Set<number>();
  const yCoords = new Set<number>();

  xCoords.add(rStart.x);
  xCoords.add(rEnd.x);
  yCoords.add(rStart.y);
  yCoords.add(rEnd.y);

  if (rBounds) {
      xCoords.add(rBounds.minX);
      xCoords.add(rBounds.maxX);
      yCoords.add(rBounds.minY);
      yCoords.add(rBounds.maxY);
  }

  rObstacles.forEach(obs => {
    xCoords.add(obs.left - PADDING);
    xCoords.add(obs.right + PADDING);
    yCoords.add(obs.top - PADDING);
    yCoords.add(obs.bottom + PADDING);
  });

  const gapCentersX = findVerticalGapCenters(rObstacles);
  gapCentersX.forEach(x => xCoords.add(x));

  const gapCentersY = findHorizontalGapCenters(rObstacles);
  gapCentersY.forEach(y => yCoords.add(y));

  const sortedX = Array.from(xCoords).sort((a, b) => a - b);
  const sortedY = Array.from(yCoords).sort((a, b) => a - b);

  const xToIndex = new Map<number, number>();
  const yToIndex = new Map<number, number>();
  sortedX.forEach((x, i) => xToIndex.set(x, i));
  sortedY.forEach((y, i) => yToIndex.set(y, i));

  const isGapCenterX = new Set<number>();
  gapCentersX.forEach(x => {
      const idx = xToIndex.get(x);
      if (idx !== undefined) isGapCenterX.add(idx);
  });

  const isGapCenterY = new Set<number>();
  gapCentersY.forEach(y => {
      const idx = yToIndex.get(y);
      if (idx !== undefined) isGapCenterY.add(idx);
  });

  const startNode = { xIdx: xToIndex.get(rStart.x)!, yIdx: yToIndex.get(rStart.y)! };
  const endNode = { xIdx: xToIndex.get(rEnd.x)!, yIdx: yToIndex.get(rEnd.y)! };

  const openSet = new PriorityQueue<{ xIdx: number; yIdx: number; dir?: 'H' | 'V' }>();
  openSet.enqueue(startNode, 0);

  const cameFrom = new Map<string, { xIdx: number; yIdx: number; dir?: 'H' | 'V' }>();
  const gScore = new Map<string, number>();
  
  const startKey = `${startNode.xIdx},${startNode.yIdx}`;
  gScore.set(startKey, 0);

  const dx = [1, -1, 0, 0];
  const dy = [0, 0, 1, -1];
  const directionTypes: ('H' | 'V')[] = ['H', 'H', 'V', 'V'];

  let found = false;
  let finalNodeKey: string | null = null;

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = `${current.xIdx},${current.yIdx}`;

    if (current.xIdx === endNode.xIdx && current.yIdx === endNode.yIdx) {
      found = true;
      finalNodeKey = currentKey;
      break;
    }

    const currentX = sortedX[current.xIdx];
    const currentY = sortedY[current.yIdx];
    const currentG = gScore.get(currentKey) ?? Infinity;

    for (let i = 0; i < 4; i++) {
      const nextXIdx = current.xIdx + dx[i];
      const nextYIdx = current.yIdx + dy[i];

      if (nextXIdx < 0 || nextXIdx >= sortedX.length || nextYIdx < 0 || nextYIdx >= sortedY.length) {
        continue;
      }

      const nextX = sortedX[nextXIdx];
      const nextY = sortedY[nextYIdx];

      if (rBounds) {
        if (nextX < rBounds.minX || nextX > rBounds.maxX || nextY < rBounds.minY || nextY > rBounds.maxY) {
           continue;
        }
      }

      const segment = {
        start: { x: currentX, y: currentY },
        end: { x: nextX, y: nextY }
      };
      
      if (segmentIntersectsObstacles(segment, rObstacles)) {
        continue;
      }

      const moveDist = Math.abs(nextX - currentX) + Math.abs(nextY - currentY);
      const newDir = directionTypes[i];
      const turnCost = (current.dir && current.dir !== newDir) ? TURN_PENALTY : 0;
      
      let stepCost = moveDist;

      if (newDir === 'V') {
          if (!isGapCenterX.has(current.xIdx)) {
              stepCost *= NON_CENTER_PENALTY_MULTIPLIER;
          }
      } else {
          if (!isGapCenterY.has(current.yIdx)) {
              stepCost *= NON_CENTER_PENALTY_MULTIPLIER;
          }
      }
      
      const tentativeG = currentG + stepCost + turnCost;
      const nextKey = `${nextXIdx},${nextYIdx}`;

      if (tentativeG < (gScore.get(nextKey) ?? Infinity)) {
        cameFrom.set(nextKey, { ...current, dir: current.dir });
        gScore.set(nextKey, tentativeG);
        
        const h = Math.abs(rEnd.x - nextX) + Math.abs(rEnd.y - nextY);
        openSet.enqueue({ xIdx: nextXIdx, yIdx: nextYIdx, dir: newDir }, tentativeG + h);
      }
    }
  }

  if (!found) {
    return [start, end];
  }

  const path: Point[] = [];
  let curr: { xIdx: number; yIdx: number; dir?: 'H' | 'V' } | undefined = { xIdx: endNode.xIdx, yIdx: endNode.yIdx };
  
  while (curr) {
    path.unshift({ x: sortedX[curr.xIdx], y: sortedY[curr.yIdx] });
    const key = `${curr.xIdx},${curr.yIdx}`;
    const parent = cameFrom.get(key);
    
    if (!parent && (curr.xIdx !== startNode.xIdx || curr.yIdx !== startNode.yIdx)) {
        break;
    }
    if (curr.xIdx === startNode.xIdx && curr.yIdx === startNode.yIdx) {
        break;
    }
    curr = parent;
  }
  
  return simplifyPath(path);
}

function findVerticalGapCenters(obstacles: Rect[]): number[] {
  if (obstacles.length === 0) return [];

  const intervals = obstacles
    .map(o => ({ start: o.left, end: o.right }))
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  let curr = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.start < curr.end) {
      curr.end = Math.max(curr.end, next.end);
    } else {
      merged.push(curr);
      curr = next;
    }
  }
  merged.push(curr);

  const centers: number[] = [];
  const MIN_GAP_WIDTH = 5; 

  for (let i = 0; i < merged.length - 1; i++) {
    const gapStart = merged[i].end;
    const gapEnd = merged[i + 1].start;
    const gapSize = gapEnd - gapStart;

    if (gapSize > MIN_GAP_WIDTH) {
      centers.push(gapStart + gapSize / 2);
    }
  }

  return centers;
}

function findHorizontalGapCenters(obstacles: Rect[]): number[] {
  if (obstacles.length === 0) return [];

  const intervals = obstacles
    .map(o => ({ start: o.top, end: o.bottom }))
    .sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  let curr = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.start < curr.end) {
      curr.end = Math.max(curr.end, next.end);
    } else {
      merged.push(curr);
      curr = next;
    }
  }
  merged.push(curr);

  const centers: number[] = [];
  const MIN_GAP_WIDTH = 5;

  for (let i = 0; i < merged.length - 1; i++) {
    const gapStart = merged[i].end;
    const gapEnd = merged[i + 1].start;
    const gapSize = gapEnd - gapStart;

    if (gapSize > MIN_GAP_WIDTH) {
      centers.push(gapStart + gapSize / 2);
    }
  }

  return centers;
}

function simplifyPath(path: Point[]): Point[] {
  if (path.length <= 2) return path;

  const simplified: Point[] = [path[0]];
  
  for (let i = 1; i < path.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = path[i];
    const next = path[i + 1];

    const isVertical = prev.x === curr.x && curr.x === next.x;
    const isHorizontal = prev.y === curr.y && curr.y === next.y;

    if (!isVertical && !isHorizontal) {
      simplified.push(curr);
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

function segmentIntersectsObstacles(segment: { start: Point; end: Point }, obstacles: Rect[]): boolean {
  for (const obs of obstacles) {
    if (lineIntersectsRect(segment, obs)) {
      return true;
    }
  }
  return false;
}

function lineIntersectsRect(
  line: { start: Point; end: Point },
  rect: Rect
): boolean {
  
  const { start, end } = line;
  
  if (Math.max(start.x, end.x) < rect.left || Math.min(start.x, end.x) > rect.right ||
      Math.max(start.y, end.y) < rect.top || Math.min(start.y, end.y) > rect.bottom) {
      return false;
  }
  
  if (start.x === end.x) {
    if (start.x > rect.left && start.x < rect.right) {
       const minY = Math.min(start.y, end.y);
       const maxY = Math.max(start.y, end.y);
       if (maxY > rect.top && minY < rect.bottom) {
         return true;
       }
    }
  } else if (start.y === end.y) {
    if (start.y > rect.top && start.y < rect.bottom) {
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        if (maxX > rect.left && minX < rect.right) {
            return true;
        }
    }
  }
  
  return false;
}