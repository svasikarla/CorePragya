"use client"

import Link from "next/link"
import { Brain, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  user: any;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 mr-6">
            <Brain className="h-6 w-6 text-indigo-700" />
            <span className="inline-block font-playfair text-xl font-bold">CorePragya</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                pathname === "/dashboard" 
                  ? "text-foreground" 
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/knowledge-base" 
              className={`text-sm font-medium ${
                pathname === "/knowledge-base" 
                  ? "text-foreground" 
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }`}
            >
              Knowledge Base
            </Link>
            <Link 
              href="/personal-rag-bot" 
              className={`text-sm font-medium ${
                pathname === "/personal-rag-bot" 
                  ? "text-foreground" 
                  : "text-muted-foreground transition-colors hover:text-foreground"
              }`}
            >
              Personal RAG Bot
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                    <span className="text-sm font-medium text-indigo-700">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}