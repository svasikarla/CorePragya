"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart"
import KnowledgeGrowthChart from "@/components/dashboard/KnowledgeGrowthChart"
import CategoryHeatmap from "@/components/dashboard/CategoryHeatmap"
import { KnowledgeStats } from "@/lib/knowledge-utils"

interface KnowledgeChartsProps {
  stats: KnowledgeStats;
}

export default function KnowledgeCharts({ stats }: KnowledgeChartsProps) {
  return (
    <div className="grid gap-6 mb-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <CategoryDistributionChart data={stats.categoryCounts} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Knowledge Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <KnowledgeGrowthChart entries={stats.recentEntries} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Category Activity Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <CategoryHeatmap entries={stats.recentEntries} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
