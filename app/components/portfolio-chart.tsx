"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart"

const data = [
    { date: "Day 1", value: 0 },
    { date: "Day 3", value: 0 },
    { date: "Day 5", value: 0 },
    { date: "Day 7", value: 0 },
    { date: "Day 9", value: 0 },
    { date: "Day 11", value: 0 },
    { date: "Day 13", value: 0 },
    { date: "Day 15", value: 0 },
    { date: "Day 17", value: 0 },
    { date: "Day 19", value: 0 },
    { date: "Day 21", value: 0 },
    { date: "Day 23", value: 0 },
    { date: "Day 25", value: 0 },
    { date: "Day 27", value: 0 },
    { date: "Day 30", value: 0 },
]

export function PortfolioChart() {
    return (
        <ChartContainer
            config={{
                value: {
                    label: "Portfolio Value",
                    color: "hsl(var(--accent))",
                },
            }}
            className="h-full w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="date"
                        stroke="hsl(var(--foreground))"
                        style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
                        tick={{ dy: 10 }}
                    />
                    <YAxis
                        stroke="hsl(var(--foreground))"
                        style={{ fontSize: "12px", fontFamily: "var(--font-mono)" }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="oklch(0.75 0.15 142)"
                        fill="oklch(0.75 0.15 142)"
                        fillOpacity={0.2}
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
