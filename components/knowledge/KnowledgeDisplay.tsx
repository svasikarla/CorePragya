"use client"

import { KnowledgeStats } from "@/lib/knowledge-utils"
import KnowledgeStatsCard from "@/components/knowledge/KnowledgeStatsCard"
import KnowledgeCharts from "@/components/knowledge/KnowledgeCharts"

interface KnowledgeDisplayProps {
  stats: KnowledgeStats;
  showCharts?: boolean;
  compact?: boolean;
}

export default function KnowledgeDisplay({ 
  stats, 
  showCharts = false,
  compact = false 
}: KnowledgeDisplayProps) {
  return (
    <div className="space-y-6">
      <KnowledgeStatsCard stats={stats} compact={compact} />
      {showCharts && <KnowledgeCharts stats={stats} />}
    </div>
  )
}