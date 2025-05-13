"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function DebugPage() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  useEffect(() => {
    addLog("Debug page mounted")
    
    const getAuthInfo = async () => {
      try {
        addLog("Fetching session")
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          addLog(`Session error: ${sessionError.message}`)
          throw sessionError
        }
        
        addLog(`Session found: ${sessionData.session ? 'yes' : 'no'}`)
        setSession(sessionData.session)

        addLog("Fetching user")
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          addLog(`User error: ${userError.message}`)
          throw userError
        }
        
        addLog(`User found: ${userData.user ? 'yes' : 'no'}`)
        setUser(userData.user)
      } catch (err: any) {
        const errorMsg = err.message || "An error occurred"
        addLog(`Error: ${errorMsg}`)
        setError(errorMsg)
        console.error("Auth debug error:", err)
      }
    }

    getAuthInfo()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        addLog(`Auth state changed: ${event}`)
        if (session) {
          setSession(session)
          setUser(session.user)
        } else {
          setSession(null)
          setUser(null)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    addLog("Signing out")
    await supabase.auth.signOut()
    addLog("Signed out")
    window.location.reload()
  }

  const navigateTo = (path: string) => {
    addLog(`Navigating to: ${path}`)
    window.location.href = path
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Session</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(session, null, 2) || "No session found"}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(user, null, 2) || "No user found"}
        </pre>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {logs.join('\n')}
        </pre>
      </div>
      
      <div className="flex space-x-4">
        <button 
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign Out
        </button>
        <button 
          onClick={() => navigateTo("/knowledge-base")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Knowledge Base
        </button>
        <button 
          onClick={() => navigateTo("/login")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}