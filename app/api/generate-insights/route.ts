import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { KnowledgeStats } from '@/lib/knowledge-utils'

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.split(' ')[1]
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the request body
    const { knowledgeStats } = await request.json()

    // Generate insights based on the knowledge stats
    const insights = generateInsightsFromStats(knowledgeStats)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}

function generateInsightsFromStats(stats: KnowledgeStats): string[] {
  const insights: string[] = []

  // Basic insights
  if (stats.totalEntries === 0) {
    insights.push(
      "Welcome to your knowledge dashboard!",
      "Start adding entries to build your personal knowledge base.",
      "We'll provide personalized insights as your collection grows."
    )
    return insights
  }

  // Insight about total entries
  if (stats.totalEntries > 0) {
    insights.push(`You have ${stats.totalEntries} entries in your knowledge base.`)
  }

  // Insight about top category
  if (stats.topCategory !== 'None') {
    insights.push(`Your strongest area is ${stats.topCategory} with ${stats.topCategoryCount} entries.`)
  }

  // Insight about category distribution
  const categoryCount = Object.keys(stats.categoryCounts).length
  if (categoryCount > 1) {
    insights.push(`Your knowledge is spread across ${categoryCount} different categories.`)
  }

  // Insight about recent activity
  if (stats.recentEntries.length > 0) {
    const mostRecentDate = new Date(stats.recentEntries[0].created_at).toLocaleDateString()
    insights.push(`Your last knowledge entry was added on ${mostRecentDate}.`)
  }

  // Suggestion for balance
  if (categoryCount > 1) {
    // Find categories with low counts
    const lowCategories = Object.entries(stats.categoryCounts)
      .filter(([_, count]) => count < stats.topCategoryCount / 2)
      .map(([category]) => category)
    
    if (lowCategories.length > 0) {
      insights.push(`Consider adding more entries in ${lowCategories.join(', ')} to balance your knowledge.`)
    }
  }

  return insights
}


