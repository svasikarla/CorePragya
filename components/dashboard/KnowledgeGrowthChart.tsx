"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface KnowledgeGrowthChartProps {
  entries: KnowledgeEntry[];
}

export default function KnowledgeGrowthChart({ entries }: KnowledgeGrowthChartProps) {
  const [chartData, setChartData] = useState<Array<{ date: string; count: number }>>([])

  useEffect(() => {
    if (!entries || entries.length === 0) {
      setChartData([])
      return
    }

    // Group entries by date and count them
    const entriesByDate = entries.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      return acc
    }, {} as Record<string, number>)

    // Convert to array and sort by date
    const dateEntries = Object.entries(entriesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate cumulative count
    let cumulativeCount = 0
    const cumulativeData = dateEntries.map(({ date, count }) => {
      cumulativeCount += count
      return { date, count: cumulativeCount }
    })

    setChartData(cumulativeData)
  }, [entries])

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No growth data available yet.<br />
          Add more knowledge entries to see growth over time.
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} entries`, 'Total']} />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6366f1"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
