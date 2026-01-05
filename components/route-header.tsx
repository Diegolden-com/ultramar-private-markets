"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface RouteHeaderProps {
    title: string
    subtitle?: string
    actions?: React.ReactNode
    className?: string
}

export function RouteHeader({
    title,
    subtitle,
    actions,
    className
}: RouteHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border pb-6", className)}>
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-muted-foreground font-mono text-sm md:text-base max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {actions}
                </div>
            )}
        </div>
    )
}
