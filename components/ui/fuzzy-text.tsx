'use client';

import React, { useEffect, useRef } from 'react';

interface FuzzyTextProps {
  children: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  color?: string;
  baseIntensity?: number;
  hoverIntensity?: number;
  enableHover?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function FuzzyText({
  children,
  fontSize = 42,
  fontWeight = 900,
  fontFamily = 'Plus Jakarta Sans, sans-serif',
  color = '#F59E0B',
  baseIntensity = 0.15,
  hoverIntensity = 0.4,
  enableHover = true,
  align = 'left',
  className = '',
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const numericFontSize = typeof fontSize === 'number' ? fontSize : parseInt(fontSize, 10) || 42;
    const dpr = window.devicePixelRatio || 1;
    const paddingX = 12;
    const paddingY = 8;
    
    ctx.font = `${fontWeight} ${numericFontSize}px ${fontFamily}`;
    const textMetrics = ctx.measureText(children);
    const textWidth = Math.ceil(textMetrics.width);
    const textHeight = Math.ceil(numericFontSize * 1.15);

    const width = textWidth + paddingX * 2;
    const height = textHeight + paddingY * 2;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const offscreen = document.createElement('canvas');
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;
    const offscreenCtx = offscreen.getContext('2d');

    if (offscreenCtx) {
      offscreenCtx.scale(dpr, dpr);
      offscreenCtx.font = `${fontWeight} ${numericFontSize}px ${fontFamily}`;
      offscreenCtx.fillStyle = color;
      offscreenCtx.textBaseline = 'middle';
      
      if (align === 'center') {
        offscreenCtx.textAlign = 'center';
        offscreenCtx.fillText(children, width / 2, height / 2);
      } else {
        offscreenCtx.textAlign = 'left';
        offscreenCtx.fillText(children, paddingX, height / 2);
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const intensity = isHovered.current && enableHover ? hoverIntensity : baseIntensity;
      const slices = 10;
      const sliceHeight = height / slices;

      for (let i = 0; i < slices; i++) {
        const sy = i * sliceHeight;
        const dx = (Math.random() - 0.5) * intensity * 16;
        const dy = (Math.random() - 0.5) * intensity * 4;

        ctx.drawImage(
          offscreen,
          0,
          sy * dpr,
          width * dpr,
          sliceHeight * dpr,
          dx,
          sy + dy,
          width,
          sliceHeight
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [children, fontSize, fontWeight, fontFamily, color, baseIntensity, hoverIntensity, enableHover, align]);

  return (
    <div
      className={`inline-block relative select-none cursor-pointer ${className}`}
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      <canvas ref={canvasRef} className={`block ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
