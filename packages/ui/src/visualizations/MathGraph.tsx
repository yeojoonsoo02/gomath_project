import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../utils/cn';

interface Point {
  x: number;
  y: number;
}

interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
  points?: Point[];
}

interface MathGraphProps {
  functions: GraphFunction[];
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  domain?: [number, number];
  range?: [number, number];
  onPointClick?: (point: Point, functionId: string) => void;
  children?: React.ReactNode;
}

/**
 * 수학 함수 그래프 시각화 컴포넌트
 * Canvas 기반으로 구현하여 고성능 렌더링 지원
 */
export function MathGraph({
  functions = [],
  width = 400,
  height = 300,
  className,
  interactive = true,
  showGrid = true,
  showAxes = true,
  domain = [-10, 10],
  range = [-10, 10],
  onPointClick,
  children
}: MathGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // 좌표 변환 함수들
  const mathToCanvas = (mathX: number, mathY: number): Point => {
    const scaleX = width / (domain[1] - domain[0]);
    const scaleY = height / (range[1] - range[0]);
    
    return {
      x: (mathX - domain[0]) * scaleX + panOffset.x,
      y: height - (mathY - range[0]) * scaleY + panOffset.y
    };
  };

  const canvasToMath = (canvasX: number, canvasY: number): Point => {
    const scaleX = (domain[1] - domain[0]) / width;
    const scaleY = (range[1] - range[0]) / height;
    
    return {
      x: (canvasX - panOffset.x) * scaleX + domain[0],
      y: range[0] + (height - canvasY + panOffset.y) * scaleY
    };
  };

  // 그리드 그리기
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);

    // 수직선
    for (let x = Math.ceil(domain[0]); x <= Math.floor(domain[1]); x++) {
      const canvasPos = mathToCanvas(x, 0);
      ctx.beginPath();
      ctx.moveTo(canvasPos.x, 0);
      ctx.lineTo(canvasPos.x, height);
      ctx.stroke();
    }

    // 수평선
    for (let y = Math.ceil(range[0]); y <= Math.floor(range[1]); y++) {
      const canvasPos = mathToCanvas(0, y);
      ctx.beginPath();
      ctx.moveTo(0, canvasPos.y);
      ctx.lineTo(width, canvasPos.y);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  };

  // 축 그리기
  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    if (!showAxes) return;

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    // X축
    const xAxisY = mathToCanvas(0, 0).y;
    if (xAxisY >= 0 && xAxisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, xAxisY);
      ctx.lineTo(width, xAxisY);
      ctx.stroke();
    }

    // Y축
    const yAxisX = mathToCanvas(0, 0).x;
    if (yAxisX >= 0 && yAxisX <= width) {
      ctx.beginPath();
      ctx.moveTo(yAxisX, 0);
      ctx.lineTo(yAxisX, height);
      ctx.stroke();
    }

    // 축 레이블
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // X축 숫자
    for (let x = Math.ceil(domain[0]); x <= Math.floor(domain[1]); x++) {
      if (x === 0) continue;
      const canvasPos = mathToCanvas(x, 0);
      if (canvasPos.x >= 0 && canvasPos.x <= width) {
        ctx.fillText(x.toString(), canvasPos.x, xAxisY + 15);
      }
    }

    // Y축 숫자
    ctx.textAlign = 'right';
    for (let y = Math.ceil(range[0]); y <= Math.floor(range[1]); y++) {
      if (y === 0) continue;
      const canvasPos = mathToCanvas(0, y);
      if (canvasPos.y >= 0 && canvasPos.y <= height) {
        ctx.fillText(y.toString(), yAxisX - 10, canvasPos.y);
      }
    }
  };

  // 함수 그래프 그리기
  const drawFunction = (ctx: CanvasRenderingContext2D, func: GraphFunction) => {
    if (!func.visible) return;

    ctx.strokeStyle = func.color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    if (func.points && func.points.length > 0) {
      // 점들이 주어진 경우
      ctx.beginPath();
      const firstPoint = mathToCanvas(func.points[0].x, func.points[0].y);
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < func.points.length; i++) {
        const point = mathToCanvas(func.points[i].x, func.points[i].y);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // 점 표시
      ctx.fillStyle = func.color;
      func.points.forEach(point => {
        const canvasPos = mathToCanvas(point.x, point.y);
        ctx.beginPath();
        ctx.arc(canvasPos.x, canvasPos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else {
      // 수식으로 그리기 (간단한 예제)
      ctx.beginPath();
      let firstPoint = true;

      for (let canvasX = 0; canvasX <= width; canvasX += 1) {
        const mathPoint = canvasToMath(canvasX, 0);
        const x = mathPoint.x;
        
        try {
          // 간단한 함수 파싱 예제 (실제로는 더 복잡한 파서 필요)
          const y = evaluateExpression(func.expression, x);
          
          if (!isNaN(y) && isFinite(y)) {
            const canvasPos = mathToCanvas(x, y);
            
            if (canvasPos.y >= -10 && canvasPos.y <= height + 10) {
              if (firstPoint) {
                ctx.moveTo(canvasPos.x, canvasPos.y);
                firstPoint = false;
              } else {
                ctx.lineTo(canvasPos.x, canvasPos.y);
              }
            }
          }
        } catch (e) {
          // 계산 오류 무시
        }
      }
      ctx.stroke();
    }
  };

  // 간단한 수식 평가 함수 (실제로는 더 강력한 파서 사용 권장)
  const evaluateExpression = (expression: string, x: number): number => {
    // 간단한 치환
    const expr = expression
      .replace(/x/g, x.toString())
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt');
    
    try {
      return Function('"use strict"; return (' + expr + ')')();
    } catch {
      return NaN;
    }
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

    // 그리드, 축, 함수들 그리기
    drawGrid(ctx);
    drawAxes(ctx);
    
    functions.forEach(func => drawFunction(ctx, func));

    // 호버된 점 표시
    if (hoveredPoint && interactive) {
      ctx.fillStyle = '#3b82f6';
      const canvasPos = mathToCanvas(hoveredPoint.x, hoveredPoint.y);
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // 마우스 이벤트 핸들러
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const mathPoint = canvasToMath(canvasX, canvasY);

    setHoveredPoint(mathPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleClick = (event: React.MouseEvent) => {
    if (!interactive || !onPointClick) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;
    const mathPoint = canvasToMath(canvasX, canvasY);

    // 클릭된 점과 가장 가까운 함수 찾기
    let closestFunction: GraphFunction | null = null;
    let minDistance = Infinity;

    functions.forEach(func => {
      if (!func.visible) return;
      
      // 간단한 거리 계산 (실제로는 더 정교한 히트 테스트 필요)
      try {
        const y = evaluateExpression(func.expression, mathPoint.x);
        const distance = Math.abs(y - mathPoint.y);
        
        if (distance < minDistance && distance < 1) {
          minDistance = distance;
          closestFunction = func;
        }
      } catch {
        // 계산 오류 무시
      }
    });

    if (closestFunction) {
      onPointClick(mathPoint, closestFunction.id);
    }
  };

  // 캔버스 업데이트
  useEffect(() => {
    draw();
  }, [functions, width, height, showGrid, showAxes, domain, range, hoveredPoint, zoomLevel, panOffset]);

  return (
    <div className={cn('relative inline-block', className)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cn(
          'border border-gray-200 rounded-lg bg-white',
          interactive && 'cursor-crosshair'
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      
      {/* 호버 정보 표시 */}
      {hoveredPoint && interactive && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 pointer-events-none">
          ({hoveredPoint.x.toFixed(2)}, {hoveredPoint.y.toFixed(2)})
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

// 그래프 컨트롤 컴포넌트
export function GraphControls({
  functions,
  onFunctionToggle,
  onFunctionColorChange,
  className
}: {
  functions: GraphFunction[];
  onFunctionToggle?: (id: string) => void;
  onFunctionColorChange?: (id: string, color: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {functions.map(func => (
        <div key={func.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={func.visible}
            onChange={() => onFunctionToggle?.(func.id)}
            className="rounded border-gray-300"
          />
          <input
            type="color"
            value={func.color}
            onChange={(e) => onFunctionColorChange?.(func.id, e.target.value)}
            className="w-6 h-6 rounded border border-gray-300"
          />
          <code className="text-gray-700 font-mono">
            y = {func.expression}
          </code>
        </div>
      ))}
    </div>
  );
}