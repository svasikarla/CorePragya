"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Brain, Send, Loader2, User, Bot, BookOpen, Check, List, ListChecks } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: {
    id: string
    uniqueId: string
    title: string
    category: string
    similarity: number
  }[]
}

export default function RagChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get auth token on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setToken(data.session.access_token)
      }
    }
    
    getSession()
  }, [])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Add initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! I\'m your CorePragya knowledge assistant. Ask me anything about your knowledge base.',
          timestamp: new Date()
        }
      ])
    }
  }, [messages])

  // Format the AI response for better readability
  const formatResponse = (text: string): string => {
    // Replace markdown-style headers with styled text
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers but keep the text
      .replace(/\n\n/g, '\n') // Reduce excessive newlines
    
    return formatted
  }

  // Render formatted message content with proper styling
  const renderFormattedContent = (content: string) => {
    // Check if the content has list items (numbered or bullet points)
    const hasNumberedList = content.match(/^\d+\.\s/m)
    const hasBulletList = content.match(/^[-*•]\s/m)
    
    if (hasNumberedList || hasBulletList) {
      // Split by newlines and process each line
      const lines = content.split('\n').filter(line => line.trim() !== '')
      
      return (
        <div className="space-y-2">
          {lines.map((line, idx) => {
            // Check if this is a header-like line (ends with a colon)
            if (line.trim().endsWith(':') && !line.trim().match(/^\d+\.\s|^[-*•]\s/)) {
              return <p key={idx} className="font-medium text-sm">{line}</p>
            }
            
            // Check if this is a list item
            const numberedMatch = line.match(/^(\d+)\.\s(.*)/)
            const bulletMatch = line.match(/^[-*•]\s(.*)/)
            
            if (numberedMatch) {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-700">{numberedMatch[1]}</span>
                  </div>
                  <p className="text-sm">{numberedMatch[2]}</p>
                </div>
              )
            } else if (bulletMatch) {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-shrink-0 h-2 w-2 mt-1.5 rounded-full bg-indigo-400" />
                  <p className="text-sm">{bulletMatch[1]}</p>
                </div>
              )
            } else {
              return <p key={idx} className="text-sm">{line}</p>
            }
          })}
        </div>
      )
    }
    
    // For content without lists, just apply basic formatting
    return (
      <div className="space-y-2">
        {content.split('\n').filter(line => line.trim() !== '').map((paragraph, idx) => (
          <p key={idx} className="text-sm">{paragraph}</p>
        ))}
      </div>
    )
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || !token) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // Call the RAG search API
      const response = await fetch('/api/rag-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: input,
          limit: 5,
          useAI: true
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }
      
      // Format sources from results
      const sources = data.results?.map((result, index) => ({
        id: result.kb_id,
        uniqueId: `${result.kb_id}-${index}`,
        title: result.title,
        category: result.category,
        similarity: result.similarity
      })) || []
      
      // Format the response for better readability
      const formattedResponse = data.aiResponse ? formatResponse(data.aiResponse) : 'I couldn\'t find relevant information in your knowledge base.'
      
      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: formattedResponse,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error querying RAG:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while searching your knowledge base.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-indigo-600" />
          CorePragya Knowledge Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    {message.role === 'user' ? (
                      <>
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        <AvatarImage src="/user-avatar.png" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        <AvatarImage src="/bot-avatar.png" />
                      </>
                    )}
                  </Avatar>
                  
                  <div>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.role === 'user' ? (
                        <p>{message.content}</p>
                      ) : (
                        renderFormattedContent(message.content)
                      )}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 flex items-center mb-1">
                          <BookOpen className="h-3 w-3 mr-1" /> 
                          Sources:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, sourceIndex) => (
                            <Badge 
                              key={`${source.uniqueId || source.id}-${sourceIndex}`}
                              variant="outline" 
                              className="text-xs"
                            >
                              {source.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about your knowledge base..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
