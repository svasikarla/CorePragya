"use client"

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

export default function InsightVisualization({ categories }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!categories || Object.keys(categories).length === 0) return
    
    // Sample data for Science/Politics visualization
    // This would normally be derived from actual data analysis
    const data = [
      { x: 'Basic', y: 'Low', r: 10 },
      { x: 'Basic', y: 'Medium', r: 15 },
      { x: 'Basic', y: 'High', r: 5 },
      { x: 'Intermediate', y: 'Low', r: 8 },
      { x: 'Intermediate', y: 'Medium', r: 20 },
      { x: 'Intermediate', y: 'High', r: 12 },
      { x: 'Advanced', y: 'Low', r: 6 },
      { x: 'Advanced', y: 'Medium', r: 10 },
      { x: 'Advanced', y: 'High', r: 15 }
    ]
    
    // Create or update chart
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [{
            label: 'Science/Politics Knowledge',
            data: data.map(d => ({
              x: ['Basic', 'Intermediate', 'Advanced'].indexOf(d.x),
              y: ['Low', 'Medium', 'High'].indexOf(d.y),
              r: d.r
            })),
            backgroundColor: 'rgba(79, 70, 229, 0.7)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: -0.5,
              max: 2.5,
              ticks: {
                callback: function(value) {
                  return ['Basic', 'Intermediate', 'Advanced'][value];
                },
                stepSize: 1
              },
              title: {
                display: true,
                text: 'Basic / Advanced'
              }
            },
            y: {
              min: -0.5,
              max: 2.5,
              ticks: {
                callback: function(value) {
                  return ['Low', 'Medium', 'High'][value];
                },
                stepSize: 1
              },
              title: {
                display: true,
                text: 'Depth / Relevance'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const xLabel = ['Basic', 'Intermediate', 'Advanced'][context.parsed.x];
                  const yLabel = ['Low', 'Medium', 'High'][context.parsed.y];
                  return `${xLabel}, ${yLabel}: ${context.parsed.r}`;
                }
              }
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
  }, [categories])

  return <canvas ref={chartRef} />
}