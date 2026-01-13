'use client'

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar, Plus, StickyNote, Trash2, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayDetailsSheetProps {
    date: Date | null
    open: boolean
    onOpenChange: (open: boolean) => void
    events: any[]
    notes: any[]
    onAddNote: (note: string) => void
    onDeleteNote: (noteId: string) => void
}

export function DayDetailsSheet({ 
    date, 
    open, 
    onOpenChange, 
    events, 
    notes, 
    onAddNote,
    onDeleteNote
}: DayDetailsSheetProps) {
    const [newNote, setNewNote] = useState("")

    if (!date) return null

    const handleAddNote = () => {
        if (!newNote.trim()) return
        onAddNote(newNote)
        setNewNote("")
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[500px] flex flex-col h-full bg-card text-card-foreground border-l-border [&>button]:hidden">
                <SheetHeader className="pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                         <SheetTitle className="text-xl capitalize text-foreground">
                            {format(date, 'EEEE, d MMMM', { locale: pl })}
                         </SheetTitle>
                         <div className="flex items-center gap-2">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors" 
                                onClick={() => onOpenChange(false)}
                             >
                                <X className="h-4 w-4" />
                             </Button>
                         </div>
                    </div>
                </SheetHeader>
                
                <div className="flex-1 overflow-hidden flex flex-col gap-6 py-6">
                    {/* Events Section */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Wydarzenia
                        </h3>
                        <ScrollArea className="flex-1 pr-4">
                            {events.length > 0 ? (
                                <div className="space-y-3">
                                    {events.map(event => (
                                        <div key={event.id} className="p-3 rounded-md bg-muted/30 border border-border">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-primary text-sm">
                                                    {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border">
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="font-medium text-foreground">{event.title}</div>
                                            {event.description && (
                                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm italic">
                                    Brak wydarzeń tego dnia
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <Separator className="bg-border" />

                    {/* Notes Section */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <StickyNote className="h-4 w-4" />
                            Notatki
                        </h3>
                        
                        {/* Add Note Input */}
                        <div className="flex gap-2 mb-4">
                            <Textarea 
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Dodaj szybką notatkę..."
                                className="min-h-[38px] h-[38px] py-2 resize-none bg-muted/30 border-border text-foreground focus:ring-primary placeholder:text-muted-foreground"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleAddNote()
                                    }
                                }}
                            />
                            <Button size="icon" onClick={handleAddNote} className="h-[38px] w-[38px] shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 pr-4">
                            {notes.length > 0 ? (
                                <div className="space-y-3">
                                    {notes.map(note => (
                                        <div key={note.id} className="group p-3 rounded-md bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors relative">
                                            <p className="text-sm text-amber-700 dark:text-amber-200 whitespace-pre-wrap">{note.content}</p>
                                            <div className="text-[10px] text-amber-500/50 mt-2 text-right">
                                                {format(new Date(note.created_at), 'HH:mm')}
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => onDeleteNote(note.id)}
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 text-amber-500/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm italic">
                                    Brak notatek
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}