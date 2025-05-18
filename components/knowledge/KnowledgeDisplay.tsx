import { KnowledgeStats } from "@/lib/knowledge-utils"
import KnowledgeStatsCard from "./KnowledgeStatsCard"

interface KnowledgeDisplayProps {
  stats: KnowledgeStats;
  compact?: boolean;
  showCharts?: boolean;
}

export default function KnowledgeDisplay({ 
  stats, 
  compact = false, 
  showCharts = false 
}: KnowledgeDisplayProps) {
  // Ensure stats has all required properties
  const safeStats: KnowledgeStats = {
    totalEntries: stats?.totalEntries || 0,
    categoryCounts: stats?.categoryCounts || {},
    recentEntries: stats?.recentEntries || [],
    topCategory: stats?.topCategory || 'None',
    topCategoryCount: stats?.topCategoryCount || 0
  };

  return (
    <div>
      <KnowledgeStatsCard stats={safeStats} compact={compact} />
    </div>
  )
}
