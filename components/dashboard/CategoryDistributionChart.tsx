"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryDistributionChartProps {
  data: Record<string, number>;
}

export default function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])

  // Colors for the pie chart
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6']

  useEffect(() => {
    // Convert the data object to an array format for the chart
    const formattedData = Object.entries(data).map(([name, value], index) => ({
      name,
      value,
    }))

    // Sort by value in descending order
    formattedData.sort((a, b) => b.value - a.value)

    setChartData(formattedData)
  }, [data])

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No category data available yet.<br />
          Add more knowledge entries to see distribution.
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
