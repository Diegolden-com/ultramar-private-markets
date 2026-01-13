"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

export function AmmCurve() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Use a spring for the "current state" of the market to make it feel organic
    const xSpring = useSpring(50, { stiffness: 100, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const xRaw = e.clientX - rect.left
        // Normalize x to 0-100 range of SVG
        const xPercent = (xRaw / rect.width) * 100

        // Clamp to curve range
        const xClamped = Math.min(Math.max(xPercent, 10), 90)

        xSpring.set(xClamped)
    }

    const handleMouseLeave = () => {
        xSpring.set(50) // Return to equilibrium
    }

    // Derived values for the "active" point
    const activeX = xSpring
    // Curve Logic: M 10,90 Q 25,25 90,10 creates a hyperbolic-like shape
    // Map input X [10, 90] to approximate Y on this quadratic bezier.
    // 50 (mid) -> ~28 (sag point).
    const activeY = useTransform(activeX, [10, 50, 90], [90, 28, 10])

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative group cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute inset-0 bg-grid-white/[0.05]" />

            <svg
                viewBox="0 0 100 100"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* The Curve: Convex shape approximating x*y=k */}
                <motion.path
                    d="M 10,90 Q 25,25 90,10"
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    filter="url(#glow)"
                />

                {/* Area under curve */}
                <path
                    d="M 10,90 Q 25,25 90,10 L 90,100 L 10,100 Z"
                    fill="var(--accent)"
                    fillOpacity="0.05"
                    className="group-hover:fillOpacity-10 transition-all duration-500"
                />

                {/* The "Price" Point */}
                <motion.circle
                    cx={activeX}
                    cy={activeY}
                    r="3"
                    fill="var(--background)"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    className="z-10"
                />

                {/* Dashed guidelines */}
                <motion.line
                    x1={activeX} y1={activeY} x2={activeX} y2={95}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />
                <motion.line
                    x1={5} y1={activeY} x2={activeX} y2={activeY}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />

                {/* Axes */}
                <line x1="5" y1="5" x2="5" y2="95" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="square" />
                <line x1="5" y1="95" x2="95" y2="95" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="square" />

                {/* Labels Layout - SVG based for perfect positioning */}

                {/* Top Left: Y Axis Label */}
                <text x="8" y="10" fill="rgba(255,255,255,0.6)" fontSize="3" fontFamily="monospace" fontWeight="bold">USDC RESERVES (y)</text>

                {/* Bottom Right: X Axis Label */}
                <text x="95" y="92" fill="rgba(255,255,255,0.6)" fontSize="3" fontFamily="monospace" fontWeight="bold" textAnchor="end">ASSET RESERVES (x)</text>

                {/* Bottom Left: Formula */}
                <text x="8" y="92" fill="var(--accent)" fontSize="3" fontFamily="monospace" fontWeight="bold">k = x * y</text>

                {/* Top Right: Title (Moved up to avoid collision) */}
                <text x="95" y="10" fill="rgba(255,255,255,0.4)" fontSize="3" fontFamily="monospace" fontWeight="bold" textAnchor="end">AMM CONSTANT PRODUCT</text>
            </svg>

            {/* Price Tooltip - Kept as HTML element for sharpness, but positioned relative to point */}
            <motion.div
                className="absolute font-mono text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded pointer-events-none"
                style={{
                    left: useTransform(activeX, (x: number) => `${x}%`),
                    top: useTransform(activeY, (y: number) => `${y}%`),
                    x: 10,
                    y: -20
                }}
            >
                PRICE
            </motion.div>
        </div>
    )
}
