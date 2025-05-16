"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, BarChart, Calendar, Clock } from "lucide-react"
import { KnowledgeStats } from "@/lib/knowledge-utils"

interface KnowledgeStatsCardProps {
  stats: KnowledgeStats;
  compact?: boolean;
}

export default function KnowledgeStatsCard({ stats, compact = false }: KnowledgeStatsCardProps) {
  const { totalEntries, topCategory, topCategoryCount, recentEntries } = stats
  
  return (
    <Card className={compact ? "mb-6" : "mb-8"}>
      {!compact && (
        <CardHeader>
          <CardTitle>Knowledge Overview</CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-4" : "p-6"}>
        {compact && <h3 className="text-sm font-semibold mb-3">Knowledge Overview</h3>}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-3">
            <div className={`${compact ? "h-10 w-10" : "h-12 w-12"} bg-indigo-100 rounded-full flex items-center justify-center`}>
              <Database className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-indigo-700`} />
            </div>
            <div>
              <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>Total Entries</p>
              <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold`}>{totalEntries}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`${compact ? "h-10 w-10" : "h-12 w-12"} bg-indigo-100 rounded-full flex items-center justify-center`}>
              <BarChart className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-indigo-700`} />
            </div>
            <div>
              <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>Top Category</p>
              <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold`}>
                {topCategory !== 'None' ? (
                  <span>
                    {topCategory} <span className="text-sm font-normal text-muted-foreground">({topCategoryCount})</span>
                  </span>
                ) : (
                  'None'
                )}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`${compact ? "h-10 w-10" : "h-12 w-12"} bg-indigo-100 rounded-full flex items-center justify-center`}>
              <Calendar className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-indigo-700`} />
            </div>
            <div>
              <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>Last Updated</p>
              <h3 className={`${compact ? "text-lg" : "text-xl"} font-bold`}>
                {recentEntries[0]?.created_at 
                  ? new Date(recentEntries[0].created_at).toLocaleDateString() 
                  : 'No entries'}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}