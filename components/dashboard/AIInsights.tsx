"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AIInsights({ knowledgeData }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

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

  // Function to determine action button for each insight
  const getInsightAction = (insight, index) => {
    // Extract category names from the insight text
    const categoryMatch = insight.match(/(?:in|on|about)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    const category = categoryMatch ? categoryMatch[1] : knowledgeData.topCategory;
    
    // Default actions based on common insight patterns
    if (insight.toLowerCase().includes('lack of entries') || 
        insight.toLowerCase().includes('gap') || 
        insight.toLowerCase().includes('underrepresented')) {
      return {
        label: "Discover New Topics",
        action: () => router.push('/knowledge-base/discover'),
        variant: "gold"
      };
    } else if (insight.toLowerCase().includes('update') || 
               insight.toLowerCase().includes('latest') || 
               insight.toLowerCase().includes('recent')) {
      return {
        label: "Update AI Knowledge",
        action: () => router.push('/knowledge-base/add'),
        variant: "primary"
      };
    } else if (category && insight.toLowerCase().includes(category.toLowerCase())) {
      return {
        label: `Explore Top ${category} Articles`,
        action: () => router.push(`/knowledge-base?category=${category}`),
        variant: "indigo"
      };
    }
    
    // Fallback action
    return {
      label: "Explore Knowledge",
      action: () => router.push('/knowledge-base'),
      variant: "default"
    };
  };

  if (knowledgeData.totalEntries === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Add some content to your knowledge base to get AI-powered insights.
        </p>
        <Button 
          variant="outline" 
          className="mt-4 border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
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
        <h3 className="text-sm font-semibold text-indigo-800">Personalized Insights</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateInsights} 
          disabled={loading}
          className="h-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">Using fallback insights instead.</p>
          <div className="space-y-4 mt-4">
            {insights.map((insight, index) => {
              const { label, action, variant } = getInsightAction(insight, index);
              return (
                <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-r from-white to-indigo-50/30 border border-indigo-100/50">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mr-3 mt-0.5 shadow-sm">
                      <span className="text-xs font-medium text-white">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                  <Button 
                    variant={variant === "gold" ? "outline" : "outline"}
                    size="sm" 
                    className={`ml-4 whitespace-nowrap shadow-sm ${
                      variant === "gold" 
                        ? "border-gold-300 bg-gold-50 text-gold-700 hover:bg-gold-100" 
                        : variant === "primary" 
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" 
                          : variant === "indigo" 
                            ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200" 
                            : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={action}
                  >
                    {label}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const { label, action, variant } = getInsightAction(insight, index);
            return (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-gradient-to-r from-white to-indigo-50/30 border border-indigo-100/50 transition-all hover:shadow-sm">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mr-3 mt-0.5 shadow-sm">
                    <span className="text-xs font-medium text-white">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
                <Button 
                  variant={variant === "gold" ? "outline" : "outline"}
                  size="sm" 
                  className={`ml-4 whitespace-nowrap shadow-sm ${
                    variant === "gold" 
                      ? "border-gold-300 bg-gold-50 text-gold-700 hover:bg-gold-100" 
                      : variant === "primary" 
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" 
                        : variant === "indigo" 
                          ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200" 
                          : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={action}
                >
                  {label}
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
