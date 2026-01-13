'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, MapPin, FileText, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Event {
    id: string
    title: string
    start_time: string
    end_time: string
    type: 'hearing' | 'deadline' | 'meeting'
    description: string
    client_name: string
    case_title: string
    location?: string
}

interface EventDetailsPanelProps {
    event: Event | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EventDetailsPanel({ event, open, onOpenChange }: EventDetailsPanelProps) {
    const [briefing, setBriefing] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    if (!event) return null

    const handleGenerateBriefing = () => {
        setIsGenerating(true)
        setTimeout(() => {
            setBriefing(`**Podsumowanie Wydarzenia:**\n\nDotyczy: ${event.title}\n\n1. Przygotować notatki.\n2. Sprawdzić załączniki.\n`)
            setIsGenerating(false)
        }, 1500)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[600px]">
                <SheetHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                             "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase",
                             "border-transparent bg-blue-500 text-white hover:bg-blue-500/80"
                         )}>
                            Wydarzenie
                        </div>
                    </div>
                    <SheetTitle className="text-xl">{event.title}</SheetTitle>
                    <SheetDescription>
                        {new Date(event.start_time).toLocaleDateString()}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(event.start_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 col-span-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {event.location}
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-medium mb-2">Opis</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>

                    <Separator />

                    {/* AI Briefing Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-primary">
                                <Sparkles className="h-4 w-4" />
                                AI Briefing
                            </h3>
                            {!briefing && (
                                <Button size="sm" variant="outline" onClick={handleGenerateBriefing} disabled={isGenerating} className="border-border hover:bg-accent text-muted-foreground">
                                    {isGenerating ? 'Generowanie...' : 'Generuj Briefing'}
                                </Button>
                            )}
                        </div>
                        
                        {briefing && (
                            <div className="bg-primary/10 dark:bg-primary/10 p-4 rounded-md text-sm whitespace-pre-line border border-primary/20 animate-in fade-in slide-in-from-bottom-2 text-foreground">
                                {briefing}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
