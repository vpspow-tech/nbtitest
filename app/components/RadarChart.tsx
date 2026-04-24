import React from 'react';

interface RadarChartProps {
  levels: Record<string, string>;
  size?: number;
}

export default function RadarChart({ levels, size = 200 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const labels = ['内卷指数', '摸鱼指数', '向上管理', '社交恐惧', '甩锅指数'];
  const dims = ['S1', 'E2', 'A1', 'So1', 'A2'];
  
  const levelNum = (level: string) => {
    return { L: 1, M: 2, H: 3 }[level] ?? 2;
  };
  
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (value / 3) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };
  
  const points = dims.map((dim, i) => {
    const value = levelNum(levels[dim] || 'M');
    return getCoordinates(i, value);
  });
  
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  
  // 背景网格
  const gridRings = [1, 2, 3];
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 背景圆环 */}
      {gridRings.map(level => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 3) * radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}
      
      {/* 轴线 */}
      {labels.map((_, i) => {
        const end = getCoordinates(i, 3);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        );
      })}
      
      {/* 数据区域 */}
      <polygon
        points={polygonPoints}
        fill="rgba(151,181,156,0.35)"
        stroke="#97b59c"
        strokeWidth="2"
      />
      
      {/* 数据点 */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#97b59c"
          stroke="#fff"
          strokeWidth="1.5"
        />
      ))}
      
      {/* 标签 */}
      {labels.map((label, i) => {
        const pos = getCoordinates(i, 3.5);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#97b59c"
            fontSize={size * 0.065}
            fontWeight="700"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}
