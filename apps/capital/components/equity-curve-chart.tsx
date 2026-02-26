"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Day 1", value: 10000 },
  { date: "Day 3", value: 10150 },
  { date: "Day 5", value: 10280 },
  { date: "Day 7", value: 10420 },
  { date: "Day 9", value: 10380 },
  { date: "Day 11", value: 10550 },
  { date: "Day 13", value: 10720 },
  { date: "Day 15", value: 10680 },
  { date: "Day 17", value: 10850 },
  { date: "Day 19", value: 11020 },
  { date: "Day 21", value: 11150 },
  { date: "Day 23", value: 11280 },
  { date: "Day 25", value: 11420 },
  { date: "Day 27", value: 11550 },
  { date: "Day 30", value: 11680 },
]

export function EquityCurveChart() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Portfolio Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="oklch(0.75 0.15 142)"
            strokeWidth={3}
            dot={{ fill: "oklch(0.75 0.15 142)", r: 4 }}
            activeDot={{ r: 6, fill: "oklch(0.75 0.15 142)", stroke: "hsl(var(--foreground))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
