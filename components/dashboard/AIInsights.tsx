"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function AIInsights({ knowledgeData }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (knowledgeData.totalEntries > 0) {
      generateInsights()
    }
  }, [knowledgeData])

  const generateInsights = async () => {
    if (knowledgeData.totalEntries === 0) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to generate insights');
      }
      
      console.log('Sending data to generate insights:', {
        totalEntries: knowledgeData.totalEntries,
        categoryCounts: knowledgeData.categoryCounts,
        topCategory: knowledgeData.topCategory,
        recentEntries: knowledgeData.recentEntries?.slice(0, 3) || []
      });
      
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          knowledgeStats: {
            totalEntries: knowledgeData.totalEntries,
            categoryCounts: knowledgeData.categoryCounts || {},
            topCategory: knowledgeData.topCategory || 'None',
            recentEntries: knowledgeData.recentEntries?.slice(0, 3) || []
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to generate insights')
      }

      const data = await response.json()
      setInsights(data.insights || [])
    } catch (error) {
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

  if (knowledgeData.totalEntries === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Add some content to your knowledge base to get AI-powered insights.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.href = '/knowledge-base'}
        >
          Go to Knowledge Base
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold">Personalized Insights</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateInsights} 
          disabled={loading}
          className="h-8"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">Using fallback insights instead.</p>
          <div className="space-y-4 mt-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-indigo-700">{index + 1}</span>
                </div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-medium text-indigo-700">{index + 1}</span>
              </div>
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

