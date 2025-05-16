
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, LogOut, BarChart, Database, Lightbulb, Calendar } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart"
import KnowledgeGrowthChart from "@/components/dashboard/KnowledgeGrowthChart"
import AIInsights from "@/components/dashboard/AIInsights"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [knowledgeStats, setKnowledgeStats] = useState({
    totalEntries: 0,
    categoryCounts: {},
    recentEntries: [],
    topCategory: 'None',
    topCategoryCount: 0
  })
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (!user) {
          router.push('/login')
        } else {
          // Fetch knowledge stats instead of redirecting
          fetchKnowledgeStats(user.id)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (session?.user) {
          setUser(session.user)
          // Fetch knowledge stats instead of redirecting
          fetchKnowledgeStats(session.user.id)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const fetchKnowledgeStats = async (userId) => {
    try {
      // Fetch knowledge base entries
      const { data, error } = await supabase
        .from('knowledgebase')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate statistics
      const categoryCounts = data.reduce((acc, entry) => {
        const category = entry.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      // Find top category
      const topCategoryEntry = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

      setKnowledgeStats({
        totalEntries: data.length,
        categoryCounts,
        recentEntries: data.slice(0, 5),
        topCategory: topCategoryEntry[0],
        topCategoryCount: topCategoryEntry[1]
      });
    } catch (error) {
      console.error('Error fetching knowledge stats:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-indigo-700" />
              <span className="inline-block font-playfair text-xl font-bold">CorePragya</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/knowledge-base"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Knowledge Base
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Settings
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-slate-50">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">Knowledge Analytics</h1>
            <p className="mt-2 text-muted-foreground">
              Hello, {user?.email}! Here's an overview of your knowledge collection.
            </p>
          </div>
          
          {/* Analytics Overview */}
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Entries</p>
                    <h3 className="text-2xl font-bold">{knowledgeStats.totalEntries}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Top Category</p>
                    <h3 className="text-2xl font-bold">{knowledgeStats.topCategory}</h3>
                    <p className="text-xs text-muted-foreground">
                      {knowledgeStats.topCategoryCount} entries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <h3 className="text-lg font-bold">
                      {knowledgeStats.recentEntries[0]?.created_at 
                        ? new Date(knowledgeStats.recentEntries[0].created_at).toLocaleDateString() 
                        : 'No entries'}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Category Distribution Chart */}
          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <CategoryDistributionChart data={knowledgeStats.categoryCounts} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Knowledge Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <KnowledgeGrowthChart entries={knowledgeStats.recentEntries} />
                </div>
              </CardContent>
            </Card>
          </div>
          
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
      </main>
    </div>
  )
}





