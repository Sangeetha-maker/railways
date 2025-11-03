"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TrainMessage } from "@/lib/railway-data"
import { MessageSquare, Clock, AlertTriangle, CheckCircle, Zap } from "lucide-react"

interface TrainMessagesPanelProps {
  messages: TrainMessage[]
  isPeakHours?: boolean
}

export function TrainMessagesPanel({ messages, isPeakHours = false }: TrainMessagesPanelProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-orange-500 bg-orange-50"
      default:
        return "border-green-500 bg-green-50"
    }
  }

  const getMessageTypeIcon = (trainType: string) => {
    if (trainType === "system") {
      return <Zap className="h-4 w-4 text-blue-500" />
    }
    return getPriorityIcon("medium")
  }

  const clearMessages = () => {
    // This would be handled by parent component in real implementation
    console.log("[v0] Clear messages requested")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Train Messages
            {isPeakHours && (
              <Badge variant="destructive" className="ml-2">
                PEAK HOURS
              </Badge>
            )}
            <Badge variant="outline" className="ml-2">
              {messages.length} Messages
            </Badge>
          </CardTitle>
          <Button onClick={clearMessages} variant="outline" size="sm">
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Train movements will appear here.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border-l-4 rounded-lg ${
                    message.trainType === "system" ? "border-blue-500 bg-blue-50" : getPriorityColor(message.priority)
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {message.trainType === "system" ? (
                          <Zap className="h-4 w-4 text-blue-500" />
                        ) : (
                          getPriorityIcon(message.priority)
                        )}
                        <Badge variant="outline" className="text-xs">
                          {message.trainType === "system" ? "SYSTEM" : message.trainType.toUpperCase()}
                        </Badge>
                        {message.trainNumber !== "SYSTEM" && (
                          <Badge variant="secondary" className="text-xs">
                            {message.trainNumber}
                          </Badge>
                        )}
                        {new Date().getTime() - message.timestamp.getTime() < 30000 && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-sm mb-1 ${
                          message.trainType === "system" ? "font-semibold text-blue-900" : "font-medium"
                        }`}
                      >
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                        {message.platform && ` • Platform ${message.platform}`}
                        {message.station && ` • ${message.station}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
