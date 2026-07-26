'use client';

import React, { useEffect, useRef } from 'react';

interface DotFieldProps {
    dotColor?: string;
    dotSize?: number;
    spacing?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    interactive?: boolean;
    mouseRadius?: number;
    className?: string;
}

export function DotField({
    dotColor = 'rgba(245, 158, 11, 0.45)',
    dotSize = 4.5,
    spacing = 36,
    waveSpeed = 0.02,
    waveAmplitude = 10,
    interactive = true,
    mouseRadius = 200,
    className = '',
}: DotFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const isHovered = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const dpr = window.devicePixelRatio || 1;
            const width = parent.clientWidth;
            const height = parent.clientHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            if (!interactive || !canvas) return;
            const rect = canvas.getBoundingClientRect();
            mousePos.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            isHovered.current = true;
        };

        const handleMouseLeave = () => {
            isHovered.current = false;
            mousePos.current = { x: -1000, y: -1000 };
        };

        const parent = canvas.parentElement;
        if (parent && interactive) {
            parent.addEventListener('mousemove', handleMouseMove);
            parent.addEventListener('mouseleave', handleMouseLeave);
        }

        const render = () => {
            if (!canvas || !ctx) return;
            const dpr = window.devicePixelRatio || 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            time += waveSpeed;

            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            ctx.fillStyle = dotColor;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const baseX = i * spacing;
                    const baseY = j * spacing;

                    // Organic subtle wave motion
                    const waveX = Math.sin(time + j * 0.25) * (waveAmplitude * 0.2);
                    const waveY = Math.cos(time + i * 0.25) * (waveAmplitude * 0.3);

                    let x = baseX + waveX;
                    let y = baseY + waveY;
                    let size = dotSize;
                    let opacityMultiplier = 1;

                    // Mouse interactive push & highlight
                    if (interactive && isHovered.current) {
                        const dx = x - mousePos.current.x;
                        const dy = y - mousePos.current.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < mouseRadius) {
                            const force = 1 - dist / mouseRadius;
                            const angle = Math.atan2(dy, dx);
                            
                            x += Math.cos(angle) * force * 18;
                            y += Math.sin(angle) * force * 18;
                            size += force * 2.2;
                            opacityMultiplier = 1 + force * 1.8;
                        }
                    }

                    ctx.save();
                    ctx.globalAlpha = Math.min(1, opacityMultiplier);
                    ctx.beginPath();
                    ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (parent && interactive) {
                parent.removeEventListener('mousemove', handleMouseMove);
                parent.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [dotColor, dotSize, spacing, waveSpeed, waveAmplitude, interactive, mouseRadius]);

    return (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}
