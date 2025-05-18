"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { KnowledgeStats } from "@/lib/knowledge-utils"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIInsightsProps {
  knowledgeData: KnowledgeStats
}

export default function AIInsights({ knowledgeData }: AIInsightsProps) {
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('You must be logged in to generate insights')
      }

      // Call our API endpoint with the auth token
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ knowledgeStats: knowledgeData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate insights')
      }

      const data = await response.json()
      setInsights(data.insights || [])
    } catch (error: any) {
      console.error('Error generating insights:', error)
      setError(error.message || 'Failed to generate insights')
      
      // Fallback insights if API fails
      setInsights([
        "You're building a diverse knowledge base across multiple categories.",
        `Your strongest area is ${knowledgeData.topCategory || 'None'} with ${knowledgeData.categoryCounts?.[knowledgeData.topCategory] || 0} entries.`,
        "Consider exploring more content in underrepresented categories to balance your knowledge."
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Generate insights when the component mounts
    if (knowledgeData.totalEntries > 0) {
      generateInsights()
    } else {
      // Set default insights for new users
      setInsights([
        "Welcome to your knowledge dashboard!",
        "Start adding entries to build your personal knowledge base.",
        "We'll provide personalized insights as your collection grows."
      ])
    }
  }, [knowledgeData.totalEntries])

  return (
    <div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-sm">{insight}</p>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-4">{error}</p>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button
          onClick={generateInsights}
          disabled={loading}
          variant="outline"
          className="text-sm"
        >
          {loading ? 'Generating...' : 'Refresh Insights'}
        </Button>
      </div>
    </div>
  )
}
