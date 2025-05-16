"use client"

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export default function KnowledgeGrowthChart({ entries }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!entries || entries.length === 0) return

    // Process data to get entries by date
    const dateMap = new Map()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    
    // Initialize all dates in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo)
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      dateMap.set(dateString, 0)
    }
    
    // Count entries by date
    entries.forEach(entry => {
      const dateString = new Date(entry.created_at).toISOString().split('T')[0]
      if (dateMap.has(dateString)) {
        dateMap.set(dateString, dateMap.get(dateString) + 1)
      }
    })
    
    // Calculate cumulative sum
    let cumulativeSum = 0
    const cumulativeData = []
    
    dateMap.forEach((count, date) => {
      cumulativeSum += count
      cumulativeData.push({ date, count: cumulativeSum })
    })
    
    // Sort by date
    cumulativeData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Create or update chart
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: cumulativeData.map(d => d.date),
          datasets: [{
            label: 'Total Entries',
            data: cumulativeData.map(d => d.count),
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxTicksLimit: 7
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [entries])

  return <canvas ref={chartRef} />
}