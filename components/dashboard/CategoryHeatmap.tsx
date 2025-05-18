"use client"

import { useEffect, useState } from "react"
import { ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, Cell } from "recharts"

interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface CategoryHeatmapProps {
  entries: KnowledgeEntry[];
}

export default function CategoryHeatmap({ entries }: CategoryHeatmapProps) {
  const [chartData, setChartData] = useState<Array<{ x: number; y: number; z: number; category: string; date: string }>>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (!entries || entries.length === 0) {
      setChartData([])
      setCategories([])
      return
    }

    // Extract unique categories
    const uniqueCategories = [...new Set(entries.map(entry => entry.category))].filter(Boolean)
    setCategories(uniqueCategories)

    // Group entries by date and category
    const entriesByDateAndCategory = entries.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString()
      const category = entry.category || 'Uncategorized'
      
      if (!acc[date]) {
        acc[date] = {}
      }
      
      if (!acc[date][category]) {
        acc[date][category] = 0
      }
      
      acc[date][category]++
      return acc
    }, {} as Record<string, Record<string, number>>)

    // Convert to array format for the chart
    const formattedData: Array<{ x: number; y: number; z: number; category: string; date: string }> = []
    
    Object.entries(entriesByDateAndCategory).forEach(([date, categories], dateIndex) => {
      Object.entries(categories).forEach(([category, count]) => {
        const categoryIndex = uniqueCategories.indexOf(category)
        if (categoryIndex !== -1) {
          formattedData.push({
            x: dateIndex,
            y: categoryIndex,
            z: count * 100, // Scale for better visibility
            category,
            date
          })
        }
      })
    })

    setChartData(formattedData)
  }, [entries])

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-center">
          No activity data available yet.<br />
          Add more knowledge entries to see category activity.
        </p>
      </div>
    )
  }

  // Colors for the heatmap
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6']

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Date" 
          tick={false}
          label={{ value: 'Time', position: 'insideBottom', offset: -10 }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Category" 
          tick={false}
          label={{ value: 'Categories', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name, props) => {
            if (name === 'z') {
              return [props.payload.category, 'Category']
            }
            if (name === 'x') {
              return [props.payload.date, 'Date']
            }
            return [value, name]
          }}
        />
        <Scatter name="Categories" data={chartData} fill="#8884d8">
          {chartData.map((entry, index) => {
            const categoryIndex = categories.indexOf(entry.category)
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[categoryIndex % COLORS.length]} 
              />
            )
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
