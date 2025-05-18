import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KnowledgeStats } from "@/lib/knowledge-utils"
import { Database, BookOpen, BarChart } from "lucide-react"

interface KnowledgeStatsCardProps {
  stats: KnowledgeStats;
  compact?: boolean;
}

export default function KnowledgeStatsCard({ stats, compact = false }: KnowledgeStatsCardProps) {
  // Ensure we have valid stats
  const totalEntries = stats?.totalEntries || 0;
  const topCategory = stats?.topCategory || 'None';
  const topCategoryCount = stats?.topCategoryCount || 0;
  const recentEntries = stats?.recentEntries || [];
  
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
              <BookOpen className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-indigo-700`} />
            </div>
            <div>
              <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>Top Category</p>
              <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold`}>
                {topCategory !== 'None' ? (
                  <>
                    {topCategory} <span className="text-sm font-normal text-muted-foreground">({topCategoryCount})</span>
                  </>
                ) : (
                  'None'
                )}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`${compact ? "h-10 w-10" : "h-12 w-12"} bg-indigo-100 rounded-full flex items-center justify-center`}>
              <BarChart className={`${compact ? "h-5 w-5" : "h-6 w-6"} text-indigo-700`} />
            </div>
            <div>
              <p className={`${compact ? "text-xs" : "text-sm"} text-muted-foreground`}>Last Updated</p>
              <h3 className={`${compact ? "text-xl" : "text-2xl"} font-bold`}>
                {recentEntries.length > 0 ? (
                  new Date(recentEntries[0].created_at).toLocaleDateString()
                ) : (
                  'No entries'
                )}
              </h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
