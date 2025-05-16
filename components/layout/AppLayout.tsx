"use client"

import { ReactNode } from "react"
import AppHeader from "@/components/layout/AppHeader"

interface AppLayoutProps {
  user: any;
  children: ReactNode;
  className?: string;
}

export default function AppLayout({ user, children, className = "" }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} />
      <main className={`flex-1 bg-slate-50 ${className}`}>
        {children}
      </main>
    </div>
  )
}