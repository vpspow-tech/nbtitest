import React, { useEffect, useRef } from 'react';

interface RadarChartProps {
  levels: Record<string, string>;
  size?: number;
}

export default function RadarChart({ levels, size = 180 }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const levelNum = (level: string) => {
    return { L: 1, M: 2, H: 3 }[level] ?? 2;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const center = size / 2;
    const radius = size * 0.35;
    const labels = ['内卷', '摸鱼', '向上', '社恐', '甩锅'];
    const dims = ['S1', 'E2', 'A1', 'So1', 'A2'];
    
    // Clear
    ctx.clearRect(0, 0, size, size);
    
    // Draw grid rings
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 3; level++) {
      ctx.beginPath();
      ctx.arc(center, center, (level / 3) * radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw axes
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
      ctx.stroke();
    }
    
    // Draw data
    const points = dims.map((dim, i) => {
      const value = levelNum(levels[dim] || 'M');
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const r = (value / 3) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    });
    
    // Draw polygon
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(151,181,156,0.35)';
    ctx.fill();
    ctx.strokeStyle = '#97b59c';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#97b59c';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    
    // Draw labels
    ctx.fillStyle = '#97b59c';
    ctx.font = `bold ${size * 0.065}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    labels.forEach((label, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const r = radius * 1.15;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      ctx.fillText(label, x, y);
    });
  }, [levels, size]);
  
  return <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />;
}
