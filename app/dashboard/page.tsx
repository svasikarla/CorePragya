
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import AIInsights from "@/components/dashboard/AIInsights"
import { fetchKnowledgeEntries, KnowledgeStats } from "@/lib/knowledge-utils"
import AppLayout from "@/components/layout/AppLayout"
import KnowledgeDisplay from "@/components/knowledge/KnowledgeDisplay"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [knowledgeStats, setKnowledgeStats] = useState<KnowledgeStats>({
    totalEntries: 0,
    categoryCounts: {},
    recentEntries: [],
    topCategory: 'None',
    topCategoryCount: 0
  })
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      await fetchKnowledgeStats(session.user.id)
      setLoading(false)
    }
    
    getUser()
  }, [router])

  const fetchKnowledgeStats = async (userId) => {
    const { entries, stats, error } = await fetchKnowledgeEntries(userId);
    if (error) {
      console.error('Error fetching knowledge stats:', error);
      return;
    }
    setKnowledgeStats(stats);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <AppLayout user={user}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View insights and analytics about your knowledge base.
          </p>
        </div>
        
        {/* Knowledge Stats and Charts */}
        <KnowledgeDisplay stats={knowledgeStats} showCharts={true} />
        
        {/* AI Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-indigo-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIInsights knowledgeData={knowledgeStats} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}








