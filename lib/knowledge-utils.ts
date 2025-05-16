import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define types for knowledge entries
export interface KnowledgeEntry {
  id: string;
  title: string;
  source: string;
  summary: string;
  summaryJson: any;
  date: string;
  type: string;
  category: string;
}

export interface KnowledgeStats {
  totalEntries: number;
  categoryCounts: Record<string, number>;
  recentEntries: any[];
  topCategory: string;
  topCategoryCount: number;
}

// Shared function to fetch knowledge entries
export async function fetchKnowledgeEntries(userId: string): Promise<{
  entries: KnowledgeEntry[];
  stats: KnowledgeStats;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('knowledgebase')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format entries
    const formattedEntries = data.map(item => {
      // Parse summary_json if it's a string
      let summaryJson = item.summary_json;
      if (typeof summaryJson === 'string') {
        try {
          summaryJson = JSON.parse(summaryJson);
        } catch (e) {
          console.error('Error parsing summary_json:', e);
          summaryJson = null;
        }
      }
      
      // Ensure created_at is a valid date
      let dateStr = '';
      try {
        const createdAt = new Date(item.created_at);
        if (!isNaN(createdAt.getTime())) {
          dateStr = createdAt.toISOString().split("T")[0];
        } else {
          dateStr = new Date().toISOString().split("T")[0]; // Fallback to current date
        }
      } catch (e) {
        console.error('Error parsing date:', e);
        dateStr = new Date().toISOString().split("T")[0]; // Fallback to current date
      }
      
      return {
        id: item.id,
        title: item.summary_text?.split('.')[0] || 'Untitled', // Use first sentence as title
        source: item.source_ref || '',
        summary: item.summary_text || '',
        summaryJson: summaryJson,
        date: dateStr,
        created_at: item.created_at, // Keep the original created_at for charts
        type: item.source_type || 'url',
        category: item.category || 'Uncategorized',
      };
    });

    // Calculate statistics
    const categoryCounts = data.reduce((acc, entry) => {
      const category = entry.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Find top category
    const topCategoryEntry = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    const stats = {
      totalEntries: data.length,
      categoryCounts,
      recentEntries: formattedEntries.slice(0, 5),
      topCategory: topCategoryEntry[0],
      topCategoryCount: topCategoryEntry[1]
    };

    return { entries: formattedEntries, stats };
  } catch (error) {
    console.error('Error fetching knowledge entries:', error);
    return { 
      entries: [], 
      stats: {
        totalEntries: 0,
        categoryCounts: {},
        recentEntries: [],
        topCategory: 'None',
        topCategoryCount: 0
      },
      error: error.message 
    };
  }
}
