import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../utils/cn';

interface Point {
  x: number;
  y: number;
  id?: string;
  label?: string;
}

interface Line {
  id: string;
  start: Point;
  end: Point;
  color?: string;
  strokeWidth?: number;
  style?: 'solid' | 'dashed' | 'dotted';
}

interface Circle {
  id: string;
  center: Point;
  radius: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

interface Polygon {
  id: string;
  points: Point[];
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

interface GeometryShape {
  type: 'point' | 'line' | 'circle' | 'polygon';
  data: Point | Line | Circle | Polygon;
}

interface GeometryCanvasProps {
  shapes: GeometryShape[];
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  gridSize?: number;
  onShapeClick?: (shape: GeometryShape) => void;
  onCanvasClick?: (point: Point) => void;
  children?: React.ReactNode;
}

/**
 * 기하학적 도형 시각화 캔버스 컴포넌트
 * 점, 선, 원, 다각형 등을 그리고 상호작용할 수 있는 컴포넌트
 */
export function GeometryCanvas({
  shapes = [],
  width = 400,
  height = 400,
  className,
  interactive = true,
  showGrid = true,
  showAxes = false,
  gridSize = 20,
  onShapeClick,
  onCanvasClick,
  children
}: GeometryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredShape, setHoveredShape] = useState<GeometryShape | null>(null);
  const [selectedShapes, setSelectedShapes] = useState<Set<string>>(new Set());

  // 좌표 변환 함수들
  const canvasToLogical = (canvasX: number, canvasY: number): Point => ({
    x: canvasX,
    y: height - canvasY // Y축 뒤집기
  });

  const logicalToCanvas = (logicalX: number, logicalY: number): Point => ({
    x: logicalX,
    y: height - logicalY // Y축 뒤집기
  });

  // 그리드 그리기
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;

    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;

    // 수직선
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 수평선
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // 축 그리기
  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    if (!showAxes) return;

    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;

    // X축
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y축
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
  };

  // 점 그리기
  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point, isHovered = false, isSelected = false) => {
    const canvasPos = logicalToCanvas(point.x, point.y);
    const radius = isHovered || isSelected ? 6 : 4;
    
    ctx.fillStyle = isSelected ? '#3b82f6' : (isHovered ? '#60a5fa' : '#1f2937');
    
    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 레이블
    if (point.label) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(point.label, canvasPos.x, canvasPos.y - 8);
    }
  };

  // 선 그리기
  const drawLine = (ctx: CanvasRenderingContext2D, line: Line, isHovered = false, isSelected = false) => {
    const startPos = logicalToCanvas(line.start.x, line.start.y);
    const endPos = logicalToCanvas(line.end.x, line.end.y);
    
    ctx.strokeStyle = isSelected ? '#3b82f6' : (line.color || '#1f2937');
    ctx.lineWidth = isHovered || isSelected ? (line.strokeWidth || 2) + 1 : (line.strokeWidth || 2);
    
    // 선 스타일 설정
    switch (line.style) {
      case 'dashed':
        ctx.setLineDash([5, 5]);
        break;
      case 'dotted':
        ctx.setLineDash([2, 3]);
        break;
      default:
        ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();
    
    ctx.setLineDash([]); // 리셋
  };

  // 원 그리기
  const drawCircle = (ctx: CanvasRenderingContext2D, circle: Circle, isHovered = false, isSelected = false) => {
    const centerPos = logicalToCanvas(circle.center.x, circle.center.y);
    
    // 채우기
    if (circle.fill) {
      ctx.fillStyle = circle.fill;
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, circle.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // 테두리
    ctx.strokeStyle = isSelected ? '#3b82f6' : (circle.color || '#1f2937');
    ctx.lineWidth = isHovered || isSelected ? (circle.strokeWidth || 2) + 1 : (circle.strokeWidth || 2);
    
    ctx.beginPath();
    ctx.arc(centerPos.x, centerPos.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  // 다각형 그리기
  const drawPolygon = (ctx: CanvasRenderingContext2D, polygon: Polygon, isHovered = false, isSelected = false) => {
    if (polygon.points.length < 3) return;
    
    const canvasPoints = polygon.points.map(p => logicalToCanvas(p.x, p.y));
    
    // 채우기
    if (polygon.fill) {
      ctx.fillStyle = polygon.fill;
      ctx.beginPath();
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
      
      for (let i = 1; i < canvasPoints.length; i++) {
        ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
      }
      
      ctx.closePath();
      ctx.fill();
    }
    
    // 테두리
    ctx.strokeStyle = isSelected ? '#3b82f6' : (polygon.color || '#1f2937');
    ctx.lineWidth = isHovered || isSelected ? (polygon.strokeWidth || 2) + 1 : (polygon.strokeWidth || 2);
    
    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
    }
    
    ctx.closePath();
    ctx.stroke();
  };

  // 도형 그리기
  const drawShape = (ctx: CanvasRenderingContext2D, shape: GeometryShape) => {
    const shapeId = getShapeId(shape);
    const isHovered = hoveredShape === shape;
    const isSelected = selectedShapes.has(shapeId);
    
    switch (shape.type) {
      case 'point':
        drawPoint(ctx, shape.data as Point, isHovered, isSelected);
        break;
      case 'line':
        drawLine(ctx, shape.data as Line, isHovered, isSelected);
        break;
      case 'circle':
        drawCircle(ctx, shape.data as Circle, isHovered, isSelected);
        break;
      case 'polygon':
        drawPolygon(ctx, shape.data as Polygon, isHovered, isSelected);
        break;
    }
  };

  // 도형 ID 가져오기
  const getShapeId = (shape: GeometryShape): string => {
    switch (shape.type) {
      case 'point':
        return (shape.data as Point).id || 'point';
      case 'line':
        return (shape.data as Line).id;
      case 'circle':
        return (shape.data as Circle).id;
      case 'polygon':
        return (shape.data as Polygon).id;
      default:
        return 'unknown';
    }
  };

  // 점과 도형의 거리 계산
  const getDistanceToShape = (point: Point, shape: GeometryShape): number => {
    switch (shape.type) {
      case 'point': {
        const p = shape.data as Point;
        return Math.sqrt((point.x - p.x) ** 2 + (point.y - p.y) ** 2);
      }
      case 'line': {
        const line = shape.data as Line;
        return distanceToLine(point, line.start, line.end);
      }
      case 'circle': {
        const circle = shape.data as Circle;
        const distToCenter = Math.sqrt(
          (point.x - circle.center.x) ** 2 + (point.y - circle.center.y) ** 2
        );
        return Math.abs(distToCenter - circle.radius);
      }
      case 'polygon': {
        const polygon = shape.data as Polygon;
        return distanceToPolygon(point, polygon.points);
      }
      default:
        return Infinity;
    }
  };

  // 점과 선분의 거리
  const distanceToLine = (point: Point, lineStart: Point, lineEnd: Point): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    let param = dot / lenSq;
    param = Math.max(0, Math.min(1, param));
    
    const xx = lineStart.x + param * C;
    const yy = lineStart.y + param * D;
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 점과 다각형의 거리 (단순화된 버전)
  const distanceToPolygon = (point: Point, polygonPoints: Point[]): number => {
    let minDistance = Infinity;
    
    for (let i = 0; i < polygonPoints.length; i++) {
      const j = (i + 1) % polygonPoints.length;
      const distance = distanceToLine(point, polygonPoints[i], polygonPoints[j]);
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  };

  // 캔버스 그리기
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 배경
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 그리드와 축 그리기
    drawGrid(ctx);
    drawAxes(ctx);

    // 도형들 그리기
    shapes.forEach(shape => drawShape(ctx, shape));
  };

  // 마우스 이벤트 핸들러
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const logicalPoint = canvasToLogical(canvasX, canvasY);

    // 가장 가까운 도형 찾기
    let closestShape: GeometryShape | null = null;
    let minDistance = 20; // 최대 거리 (픽셀)

    shapes.forEach(shape => {
      const distance = getDistanceToShape(logicalPoint, shape);
      if (distance < minDistance) {
        minDistance = distance;
        closestShape = shape;
      }
    });

    setHoveredShape(closestShape);
  };

  const handleMouseLeave = () => {
    setHoveredShape(null);
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!interactive) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const logicalPoint = canvasToLogical(canvasX, canvasY);

    if (hoveredShape) {
      onShapeClick?.(hoveredShape);
      
      // 선택 상태 토글
      const shapeId = getShapeId(hoveredShape);
      setSelectedShapes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(shapeId)) {
          newSet.delete(shapeId);
        } else {
          newSet.add(shapeId);
        }
        return newSet;
      });
    } else {
      onCanvasClick?.(logicalPoint);
    }
  };

  // 캔버스 업데이트
  useEffect(() => {
    draw();
  }, [shapes, width, height, showGrid, showAxes, gridSize, hoveredShape, selectedShapes]);

  return (
    <div className={cn('relative inline-block', className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn(
          'border border-gray-200 rounded-lg bg-white',
          interactive && 'cursor-pointer'
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* 도형 정보 표시 */}
      {hoveredShape && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 pointer-events-none">
          {getShapeDescription(hoveredShape)}
        </div>
      )}

      {/* 추가 컨트롤들 */}
      {children && (
        <div className="absolute top-2 left-2">
          {children}
        </div>
      )}
    </div>
  );
}

// 도형 설명 생성
function getShapeDescription(shape: GeometryShape): string {
  switch (shape.type) {
    case 'point': {
      const point = shape.data as Point;
      return `Point (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`;
    }
    case 'line': {
      const line = shape.data as Line;
      const length = Math.sqrt(
        (line.end.x - line.start.x) ** 2 + (line.end.y - line.start.y) ** 2
      );
      return `Line (length: ${length.toFixed(1)})`;
    }
    case 'circle': {
      const circle = shape.data as Circle;
      const area = Math.PI * circle.radius ** 2;
      return `Circle (r: ${circle.radius.toFixed(1)}, area: ${area.toFixed(1)})`;
    }
    case 'polygon': {
      const polygon = shape.data as Polygon;
      return `Polygon (${polygon.points.length} vertices)`;
    }
    default:
      return 'Unknown shape';
  }
}