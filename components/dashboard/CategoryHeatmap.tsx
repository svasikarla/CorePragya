"use client"

import { useEffect, useRef, useMemo } from 'react'
import { Chart, registerables, ChartType } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import 'chartjs-adapter-date-fns'
import { KnowledgeEntry } from '@/lib/knowledge-utils'

// Register Chart.js components
Chart.register(...registerables, MatrixController, MatrixElement)

// Extend Chart.js types to include matrix chart type
declare module 'chart.js' {
  interface ChartTypeRegistry {
    matrix: ChartType<'matrix', unknown>
  }
}

interface CategoryHeatmapProps {
  entries: KnowledgeEntry[]
}

export default function CategoryHeatmap({ entries }: CategoryHeatmapProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Process data for the heatmap
  const processedData = useMemo(() => {
    if (!entries || entries.length === 0) return { categories: [], timeLabels: [], data: [] }

    // Get last 30 days
    const now = new Date()
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)
    
    // Generate date labels for last 30 days
    const timeLabels: string[] = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo)
      date.setDate(thirtyDaysAgo.getDate() + i)
      timeLabels.push(date.toISOString().split('T')[0])
    }
    
    // Extract unique categories from entries
    const categories = [...new Set(entries.map(entry => entry.category || 'Uncategorized'))]
    
    // Create data structure for heatmap
    const entriesByDateAndCategory: Record<string, Record<string, Array<{id: string, title: string}>>> = {}
    
    // Initialize data structure
    categories.forEach(category => {
      entriesByDateAndCategory[category] = {}
      timeLabels.forEach(date => {
        entriesByDateAndCategory[category][date] = []
      })
    })
    
    // Populate with entries
    entries.forEach(entry => {
      if (!entry.created_at) return
      
      try {
        const entryDate = new Date(entry.created_at)
        if (isNaN(entryDate.getTime())) return
        
        const dateString = entryDate.toISOString().split('T')[0]
        const category = entry.category || 'Uncategorized'
        
        if (categories.includes(category) && 
            timeLabels.includes(dateString) && 
            entriesByDateAndCategory[category]) {
          entriesByDateAndCategory[category][dateString].push({
            id: entry.id,
            title: entry.title || 'Untitled'
          })
        }
      } catch (error) {
        console.error('Invalid date format in entry:', entry.id, error)
      }
    })
    
    // Format data for Chart.js
    const data = categories.map((category, i) => {
      return timeLabels.map((date, j) => {
        return {
          x: j,
          y: i,
          v: entriesByDateAndCategory[category][date].length,
          entries: entriesByDateAndCategory[category][date]
        }
      })
    }).flat()
    
    return { categories, timeLabels, data }
  }, [entries])

  useEffect(() => {
    if (!chartRef.current) return
    
    // Create or update chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (processedData.data.length === 0) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        ctx.font = '16px Arial'
        ctx.fillStyle = '#666'
        ctx.textAlign = 'center'
        ctx.fillText('No data available for the last 30 days', chartRef.current.width / 2, chartRef.current.height / 2)
      }
      return
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return
    
    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
      data: {
        datasets: [{
          data: processedData.data,
          backgroundColor(context) {
            const value = context.dataset.data[context.dataIndex]?.v || 0
            const alpha = value === 0 ? 0.1 : Math.min(0.2 + (value * 0.15), 0.8)
            return `rgba(79, 70, 229, ${alpha})`
          },
          borderColor: '#ffffff',
          borderWidth: 1,
          width: ({ chart }) => ((chart.chartArea || {}).width / processedData.timeLabels.length) - 1,
          height: ({ chart }) => ((chart.chartArea || {}).height / processedData.categories.length) - 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            labels: processedData.timeLabels.map(date => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 10
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            type: 'category',
            labels: processedData.categories,
            offset: true,
            ticks: {
              autoSkip: false
            },
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Category'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title(context) {
                const dataPoint = context[0].dataset.data[context[0].dataIndex]
                const category = processedData.categories[dataPoint.y]
                const date = new Date(processedData.timeLabels[dataPoint.x]).toLocaleDateString()
                return `${category} - ${date}`
              },
              label(context) {
                const dataPoint = context.dataset.data[context.dataIndex]
                const count = dataPoint.v
                return `Entries: ${count}`
              },
              afterLabel(context) {
                const dataPoint = context.dataset.data[context.dataIndex]
                const entries = dataPoint.entries
                
                if (entries.length === 0) return 'No entries'
                
                const titles = entries.slice(0, 3).map(e => `• ${e.title}`)
                if (entries.length > 3) {
                  titles.push(`... and ${entries.length - 3} more`)
                }
                
                return titles.join('\n')
              }
            }
          },
          legend: {
            display: false
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [processedData])

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
