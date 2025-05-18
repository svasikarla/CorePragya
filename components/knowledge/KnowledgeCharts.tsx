"use client"

import { useState } from "react"
import { KnowledgeStats } from "@/lib/knowledge-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart"
import KnowledgeGrowthChart from "@/components/dashboard/KnowledgeGrowthChart"
import CategoryHeatmap from "@/components/dashboard/CategoryHeatmap"
import { PieChart, TrendingUp, Calendar } from "lucide-react"

interface KnowledgeChartsProps {
  stats: KnowledgeStats;
}

export default function KnowledgeCharts({ stats }: KnowledgeChartsProps) {
  const [activeTab, setActiveTab] = useState("distribution")
  
  // Ensure we have valid stats
  const categoryCounts = stats?.categoryCounts || {};
  const recentEntries = stats?.recentEntries || [];
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="distribution">
          <PieChart className="mr-2 h-4 w-4" />
          Categories
        </TabsTrigger>
        <TabsTrigger value="growth">
          <TrendingUp className="mr-2 h-4 w-4" />
          Growth
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Calendar className="mr-2 h-4 w-4" />
          Activity
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="distribution" className="h-[300px]">
        <CategoryDistributionChart data={categoryCounts} />
      </TabsContent>
      
      <TabsContent value="growth" className="h-[300px]">
        <KnowledgeGrowthChart entries={recentEntries} />
      </TabsContent>
      
      <TabsContent value="activity" className="h-[300px]">
        <CategoryHeatmap entries={recentEntries} />
      </TabsContent>
    </Tabs>
  )
}
