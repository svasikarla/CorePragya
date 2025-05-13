
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, LogOut } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (!user) {
          router.push('/login')
        } else {
          // Redirect to knowledge-base instead of staying on dashboard
          router.push('/knowledge-base')
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
          // Redirect to knowledge-base
          router.push('/knowledge-base')
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

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
              className="text-sm font-medium transition-colors hover:text-foreground"
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
            <h1 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">Welcome to your Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Hello, {user?.email}! Start exploring your learning journey with CorePragya.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dashboard cards would go here */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-playfair text-xl font-bold">Recent Notes</h3>
              <p className="text-sm text-muted-foreground">You haven't created any notes yet.</p>
              <Button className="mt-4" variant="outline">Create Note</Button>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-playfair text-xl font-bold">Study Progress</h3>
              <p className="text-sm text-muted-foreground">Track your learning progress here.</p>
              <Button className="mt-4" variant="outline">View Progress</Button>
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-playfair text-xl font-bold">Flashcards</h3>
              <p className="text-sm text-muted-foreground">Create and review flashcards.</p>
              <Button className="mt-4" variant="outline">Create Flashcards</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


