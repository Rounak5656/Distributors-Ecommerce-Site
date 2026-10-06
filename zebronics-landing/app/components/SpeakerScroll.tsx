"use client";

import { useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 40;

export default function SpeakerScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
    const [loadedCount, setLoadedCount] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        let isMounted = true;
        let loaded = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/frames/frame_${i}_delay-0.04s.webp.jpg`;
            img.onload = () => {
                if (!isMounted) return;
                imagesRef.current[i] = img;
                loaded++;
                setLoadedCount(loaded);
                // Draw initial frame as soon as frame 0 loads
                if (i === 0) {
                    render(0);
                }
            };
            img.onerror = () => {
                // Ignore missing frames gracefully
            };
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const drawFallback = (ctx: CanvasRenderingContext2D, progress: number, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        const centerX = width / 2;
        const centerY = height / 2;

        const baseRadius = Math.min(width, height) * 0.18;
        const expansion = progress * 0.25;
        const currentRadius = baseRadius * (1 + expansion);

        const gradient = ctx.createRadialGradient(centerX, centerY, currentRadius * 0.1, centerX, centerY, currentRadius);
        gradient.addColorStop(0, "#22d3ee");
        gradient.addColorStop(0.4, "#0284c7");
        gradient.addColorStop(1, "#0f172a");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#06b6d4";
        ctx.lineWidth = 3;
        ctx.stroke();

        const partCount = 10;
        for (let i = 0; i < partCount; i++) {
            const angle = (Math.PI * 2 * i) / partCount;
            const explodeDist = progress * (Math.min(width, height) * 0.22);

            const partX = centerX + Math.cos(angle) * (currentRadius + 25 + explodeDist);
            const partY = centerY + Math.sin(angle) * (currentRadius + 25 + explodeDist);

            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(partX, partY, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const render = (rawIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        const targetIdx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(rawIndex)));

        // Find nearest available loaded frame
        let img = imagesRef.current[targetIdx];
        if (!img) {
            for (let offset = 1; offset < FRAME_COUNT; offset++) {
                if (imagesRef.current[targetIdx - offset]) {
                    img = imagesRef.current[targetIdx - offset];
                    break;
                }
                if (imagesRef.current[targetIdx + offset]) {
                    img = imagesRef.current[targetIdx + offset];
                    break;
                }
            }
        }

        if (img && img.width > 0) {
            const hRatio = displayWidth / img.width;
            const vRatio = displayHeight / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (displayWidth - img.width * ratio) / 2;
            const centerShift_y = (displayHeight - img.height * ratio) / 2;

            ctx.clearRect(0, 0, displayWidth, displayHeight);
            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        } else {
            const progress = targetIdx / (FRAME_COUNT - 1);
            drawFallback(ctx, progress, displayWidth, displayHeight);
        }

        ctx.restore();
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        requestAnimationFrame(() => render(latest));
    });

    return (
        <div ref={containerRef} className="h-[280vh] w-full relative flex flex-col bg-[#050505]">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain flex-1 max-w-full max-h-full"
                />
                {loadedCount === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs bg-[#050505]">
                        <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                            Loading Audio Architecture Frames...
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
