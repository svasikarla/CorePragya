
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, ChevronRight, Globe, Mail, Plus, RefreshCw, Search, 
  Trash2, LogOut, Calendar, Clock, Database, BarChart, Eye, 
  Bookmark, Filter, SlidersHorizontal, Lightbulb, Zap 
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create a helper component to render the summary JSON as bullet points
const SummaryBullets = ({ summaryJson }) => {
  // If summaryJson is not available, fall back to plain text
  if (!summaryJson) {
    return null;
  }

  let allPoints = [];

  // Handle the expected format with key_points, main_ideas, and insights arrays
  if (typeof summaryJson === 'object') {
    // Check if it's the expected format with arrays
    if (Array.isArray(summaryJson.key_points) || 
        Array.isArray(summaryJson.main_ideas) || 
        Array.isArray(summaryJson.insights)) {
      
      const keyPoints = Array.isArray(summaryJson.key_points) ? summaryJson.key_points : [];
      const mainIdeas = Array.isArray(summaryJson.main_ideas) ? summaryJson.main_ideas : [];
      const insights = Array.isArray(summaryJson.insights) ? summaryJson.insights : [];
      
      allPoints = [...keyPoints, ...mainIdeas, ...insights];
    } 
    // Handle the numeric key format (1, 2, 3, etc.)
    else {
      // Convert numeric keys to an array of values
      allPoints = Object.keys(summaryJson)
        .filter(key => !isNaN(Number(key))) // Only include numeric keys
        .sort((a, b) => Number(a) - Number(b)) // Sort numerically
        .map(key => summaryJson[key]);
    }
  }
  
  // Limit to prevent overcrowding
  allPoints = allPoints.slice(0, 3);
  
  if (allPoints.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-2">
      {allPoints.map((point, index) => (
        <div key={index} className="flex items-start mb-1.5 last:mb-0">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 mr-1.5 shrink-0"></div>
          <p className="text-xs text-muted-foreground line-clamp-2">{point}</p>
        </div>
      ))}
    </div>
  );
};

// Update the initialEntries to include summaryJson for the mock data
const initialEntries = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Education",
    source: "https://example.com/ai-education",
    summary:
      "This article explores how AI is transforming educational methodologies, enabling personalized learning experiences, and helping educators identify knowledge gaps. Key points include adaptive learning systems, automated grading, and AI tutors.",
    summaryJson: {
      key_points: [
        "AI enables personalized learning experiences",
        "Adaptive learning systems adjust to student needs",
        "Automated grading saves educator time"
      ],
      main_ideas: [
        "AI is transforming educational methodologies",
        "Technology helps identify knowledge gaps"
      ],
      insights: [
        "AI tutors provide 24/7 learning support"
      ]
    },
    date: "2023-04-15",
    type: "url",
    category: "Artificial Intelligence",
  },
  {
    id: "2",
    title: "Cognitive Science: Memory Formation and Retention",
    source: "https://example.com/cognitive-science",
    summary:
      "A comprehensive overview of how memories are formed, stored, and retrieved in the human brain. The article discusses the role of the hippocampus, the difference between short-term and long-term memory, and practical techniques to improve retention.",
    summaryJson: {
      key_points: [
        "Hippocampus plays crucial role in memory formation",
        "Short-term and long-term memory use different mechanisms",
        "Spaced repetition improves retention"
      ],
      main_ideas: [
        "Memory formation involves complex neural processes",
        "Different types of memories are stored differently"
      ],
      insights: [
        "Sleep is essential for memory consolidation"
      ]
    },
    date: "2023-03-22",
    type: "url",
    category: "Science",
  },
  {
    id: "3",
    title: "Weekly Research Update: Knowledge Mapping Techniques",
    source: "research@institute.edu",
    summary:
      "This email summarizes recent research on knowledge mapping techniques, including concept mapping, mind mapping, and knowledge graphs. It highlights how these techniques can be used to visualize complex relationships between ideas and enhance understanding.",
    summaryJson: {
      key_points: [
        "Concept mapping helps organize hierarchical knowledge",
        "Mind mapping is effective for brainstorming",
        "Knowledge graphs represent semantic relationships"
      ],
      main_ideas: [
        "Visual techniques enhance understanding of complex topics",
        "Different mapping methods serve different purposes"
      ],
      insights: [
        "Combining multiple mapping techniques yields best results"
      ]
    },
    date: "2023-05-01",
    type: "email",
    category: "Education",
  },
]

// Helper function to get color based on category
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Science': return 'bg-blue-100 text-blue-800';
    case 'Technology': return 'bg-purple-100 text-purple-800';
    case 'Artificial Intelligence': return 'bg-indigo-100 text-indigo-800';
    case 'Business': return 'bg-green-100 text-green-800';
    case 'Health': return 'bg-red-100 text-red-800';
    case 'Education': return 'bg-yellow-100 text-yellow-800';
    case 'Politics': return 'bg-orange-100 text-orange-800';
    case 'Environment': return 'bg-emerald-100 text-emerald-800';
    case 'Arts': return 'bg-pink-100 text-pink-800';
    case 'Sports': return 'bg-lime-100 text-lime-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColorValue = (category: string): string => {
  switch (category) {
    case 'Science': return '#dbeafe'; // blue-100
    case 'Technology': return '#f3e8ff'; // purple-100
    case 'Artificial Intelligence': return '#e0e7ff'; // indigo-100
    case 'Business': return '#dcfce7'; // green-100
    case 'Health': return '#fee2e2'; // red-100
    case 'Education': return '#fef9c3'; // yellow-100
    case 'Politics': return '#ffedd5'; // orange-100
    case 'Environment': return '#d1fae5'; // emerald-100
    case 'Arts': return '#fce7f3'; // pink-100
    case 'Sports': return '#ecfccb'; // lime-100
    default: return '#f3f4f6'; // gray-100
  }
};

// Add a debug component to check the structure of the entries
// Add this component temporarily for debugging
const DebugEntries = ({ entries }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="hidden">
      <pre>{JSON.stringify(entries[0]?.summaryJson, null, 2)}</pre>
    </div>
  );
};

export default function KnowledgeBasePage() {
  const [url, setUrl] = useState("")
  const [entries, setEntries] = useState(initialEntries)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userMetadata, setUserMetadata] = useState<{
    email: string;
    createdAt: string;
    lastSignInAt: string;
  }>({
    email: "",
    createdAt: "",
    lastSignInAt: "",
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState('newest');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Simple auth check
    const getUser = async () => {
      try {
        // Check if user is logged in
        const { data } = await supabase.auth.getUser()

        if (data.user) {
          setUser(data.user)

          // Set user metadata
          setUserMetadata({
            email: data.user.email || "",
            createdAt: formatDate(data.user.created_at),
            lastSignInAt: formatDate(data.user.last_sign_in_at),
          })

          // Fetch knowledge base entries for this user
          fetchKnowledgeBaseEntries(data.user.id);
        } else {
          // Redirect if not logged in
          window.location.href = "/login"
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Simple auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          window.location.href = '/login'
        } else if (session?.user) {
          setUser(session.user)

          // Update user metadata
          setUserMetadata({
            email: session.user.email || "",
            createdAt: formatDate(session.user.created_at),
            lastSignInAt: formatDate(session.user.last_sign_in_at),
          })

          // Fetch knowledge base entries when user signs in
          fetchKnowledgeBaseEntries(session.user.id);
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Helper function to format dates
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Function to fetch knowledge base entries
  const fetchKnowledgeBaseEntries = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('knowledgebase')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Log the first entry to check the structure
        console.log('First entry from database:', data[0]);
        
        // Transform the data to match the entries format
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
          
          return {
            id: item.id,
            title: item.summary_text.split('.')[0], // Use first sentence as title
            source: item.source_ref,
            summary: item.summary_text,
            summaryJson: summaryJson, // Use the parsed or original summary_json
            date: new Date(item.created_at).toISOString().split("T")[0],
            type: item.source_type,
            category: item.category || 'Uncategorized',
          };
        });

        console.log('Formatted entries:', formattedEntries[0]);
        setEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error fetching knowledge base entries:', error);
      toast({
        title: "Error loading entries",
        description: "Failed to load your knowledge base entries.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = () => {
    supabase.auth.signOut().then(() => {
      window.location.href = "/login"
    })
  }

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to add URLs');
      }

      // Call our API endpoint with the auth token
      const response = await fetch('/api/process-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ url }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = 'Failed to process URL';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      // Parse the response
      let responseData;
      try {
        const jsonResponse = await response.json();
        responseData = jsonResponse.data;

        if (!responseData || !responseData.id || !responseData.summary_text) {
          throw new Error('Invalid response data from server');
        }
      } catch (jsonError) {
        console.error('Error parsing response:', jsonError);
        throw new Error('Failed to parse server response');
      }

      // Create a new entry for the UI
      const newEntry = {
        id: responseData.id,
        title: responseData.summary_text.split('.')[0] || 'Untitled', // Use first sentence as title with fallback
        source: url,
        summary: responseData.summary_text,
        summaryJson: responseData.summary_json, // Include the summary_json field
        date: new Date().toISOString().split("T")[0],
        type: "url",
        category: responseData.category || 'Uncategorized', // Include the category
      };

      setEntries([newEntry, ...entries]);
      setUrl("");

      toast({
        title: "URL added to Knowledge Base",
        description: "The content has been successfully summarized and added to your knowledge base.",
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Error adding URL",
        description: error.message || "Failed to process the URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshFromEmail = async () => {
    setIsRefreshing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newEmailEntry = {
      id: Date.now().toString(),
      title: "Latest Research Findings on Learning Methodologies",
      source: "updates@research-institute.org",
      summary:
        "This email contains the latest research findings on effective learning methodologies, including spaced repetition, active recall, and interleaving. The studies show significant improvements in retention when these techniques are combined.",
      summaryJson: {
        key_points: [
          "Spaced repetition enhances long-term memory",
          "Active recall is more effective than passive review",
          "Interleaving improves ability to differentiate concepts"
        ],
        main_ideas: [
          "Combined learning techniques show synergistic effects",
          "Research validates effectiveness of modern study methods"
        ],
        insights: [
          "Implementation difficulty correlates with effectiveness"
        ]
      },
      date: new Date().toISOString().split("T")[0],
      type: "email",
      category: "Education",
    }

    setEntries([newEmailEntry, ...entries])
    setIsRefreshing(false)

    toast({
      title: "Email content refreshed",
      description: "New content from your emails has been added to your knowledge base.",
    })
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('knowledgebase')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update UI
      setEntries(entries.filter((entry) => entry.id !== id));

      toast({
        title: "Entry removed",
        description: "The entry has been removed from your knowledge base.",
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error removing entry",
        description: "Failed to remove the entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmarkEntry = (id: string) => {
    toast({
      title: "Entry bookmarked",
      description: "This feature will be available soon.",
    });
  };

  const filteredEntries = entries
    .filter((entry) => {
      // Text search filter
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || entry.category === selectedCategory;
      
      // Type filter
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOrder === 'popular') {
        return (b.viewCount || 0) - (a.viewCount || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Add a visual dashboard at the top with stats
  const KnowledgeStats = () => {
    const totalEntries = entries.length;
    const categoryCounts = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return (
      <div className="grid gap-3 mb-6 grid-cols-3">
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Entries</p>
                <h3 className="text-xl font-bold">{totalEntries}</h3>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Database className="h-4 w-4 text-indigo-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Top Category</p>
                <h3 className="text-sm font-bold truncate">{topCategory}</h3>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <BarChart className="h-4 w-4 text-indigo-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                <h3 className="text-sm font-bold">
                  {entries.length > 0 
                    ? new Date(Math.max(...entries.map(e => new Date(e.date).getTime()))).toLocaleDateString() 
                    : 'Never'}
                </h3>
              </div>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-indigo-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Dynamic category filtering - only show categories that exist in the knowledge base
  const SearchAndFilters = () => {
    // Get unique categories from entries
    const uniqueCategories = [...new Set(entries.map(entry => entry.category))].filter(Boolean);
    
    return (
      <div className="mb-4 space-y-3">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="font-rasa text-lg font-bold">Saved Knowledge</h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search knowledge..."
                className="pl-8 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto h-8" size="sm">
                  <SlidersHorizontal className="mr-1 h-3 w-3" />
                  <span className="text-xs">Sort & Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder('newest')} className="text-xs">
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')} className="text-xs">
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('popular')} className="text-xs">
                  Most Viewed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">Filter Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTypeFilter('all')} className="text-xs">
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('url')} className="text-xs">
                  Web Articles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('email')} className="text-xs">
                  Email Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`text-xs h-7 px-2.5 rounded-full ${selectedCategory === null ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'}`}
            >
              All
            </Button>
            {uniqueCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs h-7 px-2.5 rounded-full ${
                  selectedCategory === category 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : `border-${getCategoryColor(category).split(' ')[0].replace('bg-', '')} ${getCategoryColor(category).split(' ')[1]}`
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // More compact empty state
  const EmptyState = () => {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        {searchQuery ? (
          <>
            <div className="rounded-full bg-amber-100 p-2">
              <Search className="h-4 w-4 text-amber-700" />
            </div>
            <h3 className="mt-3 font-rasa text-base font-bold">No entries found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              No entries match your search query. Try a different search term or clear filters.
            </p>
            <Button 
              variant="outline" 
              className="mt-3 h-8 text-xs"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setTypeFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-full bg-indigo-100 p-2">
              <Lightbulb className="h-4 w-4 text-indigo-700" />
            </div>
            <h3 className="mt-3 font-rasa text-base font-bold">Your knowledge base is empty</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Start building your knowledge base by adding URLs or importing from email.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center">
                    <Globe className="h-6 w-6 text-indigo-700 mb-1" />
                    <h4 className="font-medium text-sm">Add Web Content</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 mb-2">
                      Summarize and save articles from the web
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full h-7 text-xs"
                      onClick={() => document.getElementById('url-input')?.focus()}
                    >
                      Add URL
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center">
                    <Mail className="h-6 w-6 text-indigo-700 mb-1" />
                    <h4 className="font-medium text-sm">Import from Email</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 mb-2">
                      Extract knowledge from your emails
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full h-7 text-xs"
                      onClick={handleRefreshFromEmail}
                    >
                      Connect Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-indigo-700" />
              <span className="inline-block font-rasa text-xl font-bold">CorePragya</span>
            </Link>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link href="/knowledge-base" className="text-sm font-medium transition-colors hover:text-foreground">
              Knowledge Base
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Settings
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-slate-50">
        <div className="container py-4 px-4 sm:px-6">
          {/* User information card - moved above the heading */}
          <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{userMetadata.email}</span>
              </div>
              <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Account created:</span> {userMetadata.createdAt}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">Last login:</span> {userMetadata.lastSignInAt}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-rasa text-2xl font-bold tracking-tight md:text-3xl">Your Knowledge Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access, manage, and explore your saved content from across the web and your emails.
            </p>
          </div>

          {/* Knowledge Stats Dashboard */}
          {entries.length > 0 && <KnowledgeStats />}

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Add New Content</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUrl} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="Paste a URL to summarize..."
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Refresh from Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Import and summarize content from your connected email accounts.
                </p>
                <Button onClick={handleRefreshFromEmail} disabled={isRefreshing} className="w-full">
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing from Email
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Refresh from Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <SearchAndFilters />

          {filteredEntries.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEntries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="overflow-hidden transition-all hover:shadow-md group border-l-4 flex flex-col h-full"
                  style={{ borderLeftColor: getCategoryColorValue(entry.category) }}
                >
                  <CardHeader className="p-3 pb-1">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-2 text-sm font-medium group-hover:text-indigo-700 transition-colors">
                        {entry.title}
                      </CardTitle>
                      <div className="flex space-x-1 ml-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-amber-500"
                          onClick={() => handleBookmarkEntry(entry.id)}
                        >
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getCategoryColor(entry.category)}`}>
                        {entry.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 flex-grow">
                    {entry.summaryJson ? (
                      <SummaryBullets summaryJson={entry.summaryJson} />
                    ) : (
                      <p className="line-clamp-3 text-xs text-muted-foreground">{entry.summary}</p>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between items-center border-t mt-auto">
                    <div className="flex items-center text-[10px] text-muted-foreground overflow-hidden">
                      {entry.type === "url" ? 
                        <Globe className="mr-1 h-2.5 w-2.5 shrink-0" /> : 
                        <Mail className="mr-1 h-2.5 w-2.5 shrink-0" />
                      }
                      <span className="truncate max-w-[100px]">{entry.source}</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <span className="whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <Button variant="link" className="h-6 p-0 text-indigo-700 text-xs">
                      Read More <ChevronRight className="ml-1 h-2 w-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Add this component to your JSX, just before the closing div of the main container
// <DebugEntries entries={entries} />







