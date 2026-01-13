'use client'

import { useState } from "react"
import { addDays, addWeeks, addMonths, format, startOfWeek, startOfMonth, endOfMonth, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, getWeek, startOfDay, endOfDay, eachHourOfInterval, setHours, subDays, setMonth, setYear, addYears, subYears, subMonths, addHours } from "date-fns"
import { pl } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, LayoutGrid, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { EventDetailsPanel } from "./event-details-panel"
import { AddEventDialog } from "./add-event-dialog"
import { DayDetailsSheet } from "./day-details-sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useData } from "@/context/data-context"

function DateSlider({ selected, onSelect }: { selected: Date, onSelect: (date: Date) => void }) {
    const [viewDate, setViewDate] = useState(selected)
    const [mode, setMode] = useState<'day' | 'month' | 'year'>('day')
    
    // Day View Logic
    const startDay = subDays(viewDate, 3)
    const endDay = addDays(viewDate, 3)
    const days = eachDayOfInterval({ start: startDay, end: endDay })

    // Month View Logic (5 months centered)
    const startMonth = subMonths(viewDate, 2)
    const months = Array.from({ length: 5 }).map((_, i) => addMonths(startMonth, i))

    // Year View Logic (5 years centered)
    const startYear = subYears(viewDate, 2)
    const years = Array.from({ length: 5 }).map((_, i) => addYears(startYear, i))

    const handlePrev = () => {
        if (mode === 'day') setViewDate(prev => subDays(prev, 1))
        if (mode === 'month') setViewDate(prev => subMonths(prev, 1))
        if (mode === 'year') setViewDate(prev => subYears(prev, 1))
    }

    const handleNext = () => {
        if (mode === 'day') setViewDate(prev => addDays(prev, 1))
        if (mode === 'month') setViewDate(prev => addMonths(prev, 1))
        if (mode === 'year') setViewDate(prev => addYears(prev, 1))
    }

    return (
        <div className="bg-card border border-border rounded-lg p-3 w-[350px]">
            <div className="flex items-center justify-between mb-4 px-1">
                {/* Month Navigator */}
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => setViewDate(prev => subMonths(prev, 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <button 
                        onClick={() => setMode(mode === 'month' ? 'day' : 'month')}
                        className={cn(
                            "text-sm font-medium w-24 text-center capitalize rounded px-1 py-0.5 transition-colors",
                            mode === 'month' ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                        )}
                    >
                        {format(viewDate, 'LLLL', { locale: pl })}
                    </button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => setViewDate(prev => addMonths(prev, 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Year Navigator */}
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => setViewDate(prev => subYears(prev, 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <button 
                        onClick={() => setMode(mode === 'year' ? 'day' : 'year')}
                        className={cn(
                            "text-sm font-medium w-14 text-center rounded px-1 py-0.5 transition-colors",
                            mode === 'year' ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                        )}
                    >
                        {format(viewDate, 'yyyy')}
                    </button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={() => setViewDate(prev => addYears(prev, 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            <div className="flex items-center justify-between gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePrev}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex gap-1 overflow-hidden flex-1 justify-center min-h-[56px] items-center">
                    {mode === 'day' && days.map(day => {
                        const isSelected = isSameDay(day, selected)
                        const isToday = isSameDay(day, new Date())
                        
                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => {
                                    onSelect(day)
                                    setViewDate(day)
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center w-10 h-14 rounded-md transition-all text-xs",
                                    isSelected 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 font-bold" 
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                    isToday && !isSelected && "text-primary font-medium"
                                )}
                            >
                                <span className="uppercase text-[10px] opacity-70 mb-1">
                                    {format(day, 'EEE', { locale: pl })}
                                </span>
                                <span className="text-base">
                                    {format(day, 'd')}
                                </span>
                            </button>
                        )
                    })}

                    {mode === 'month' && months.map(month => {
                        const isCurrent = isSameMonth(month, viewDate)
                        
                        return (
                            <button
                                key={month.toISOString()}
                                onClick={() => {
                                    const newDate = setMonth(viewDate, month.getMonth())
                                    setViewDate(newDate)
                                    onSelect(newDate)
                                    setMode('day')
                                }}
                                className={cn(
                                    "flex items-center justify-center w-14 h-10 rounded-md transition-all text-xs capitalize",
                                    isCurrent 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 font-bold" 
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {format(month, 'LLL', { locale: pl })}
                            </button>
                        )
                    })}

                    {mode === 'year' && years.map(year => {
                        const isCurrent = year.getFullYear() === viewDate.getFullYear()
                        
                        return (
                            <button
                                key={year.toISOString()}
                                onClick={() => {
                                    const newDate = setYear(viewDate, year.getFullYear())
                                    setViewDate(newDate)
                                    onSelect(newDate)
                                    setMode('day')
                                }}
                                className={cn(
                                    "flex items-center justify-center w-14 h-10 rounded-md transition-all text-xs",
                                    isCurrent 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 font-bold" 
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                {format(year, 'yyyy')}
                            </button>
                        )
                    })}
                </div>

                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNext}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="mt-4 flex justify-center border-t border-border pt-3">
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 h-7"
                    onClick={() => {
                        const today = new Date()
                        onSelect(today)
                        setViewDate(today)
                        setMode('day')
                    }}
                >
                    Wróć do dzisiaj
                </Button>
            </div>
        </div>
    )
}

// Mock Notes
const INITIAL_NOTES = [
    {
        id: '1',
        content: 'Przygotować dokumenty do sprawy rozwodowej.',
        created_at: '2024-01-15T10:00:00'
    },
    {
        id: '2',
        content: 'Zadzwonić do biegłego sądowego.',
        created_at: '2024-01-15T14:30:00'
    }
]

export function CalendarView() {
    const { calendarEvents, addEvent } = useData()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [view, setView] = useState<'month' | 'week' | 'day'>('month')
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    
    // New State for Features
    const [notes, setNotes] = useState(INITIAL_NOTES)
    const [isAddEventOpen, setIsAddEventOpen] = useState(false)
    const [selectedDayDetails, setSelectedDayDetails] = useState<Date | null>(null)
    const [isDayDetailsOpen, setIsDayDetailsOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<{date: Date, time: string} | null>(null)

    const handleSlotClick = (date: Date, hour: Date) => {
        setSelectedSlot({
            date: date,
            time: format(hour, 'HH:mm')
        })
        setIsAddEventOpen(true)
    }

    // Merge context cases with calendar events
    const events = [
        ...calendarEvents
    ]

    // Handlers
    const handleAddEvent = async (newEvent: any) => {
        const { id, ...eventData } = newEvent
        await addEvent(eventData)
    }

    const handleAddNote = (content: string) => {
        if (!selectedDayDetails) return
        
        const newNote = {
            id: Math.random().toString(36).substr(2, 9),
            content,
            created_at: new Date().toISOString()
        }
        const noteWithDate = { ...newNote, date: format(selectedDayDetails, 'yyyy-MM-dd') }
        setNotes([...notes, noteWithDate])
    }

    const handleDeleteNote = (noteId: string) => {
        setNotes(notes.filter(n => n.id !== noteId))
    }

    const handleDayClick = (date: Date) => {
        setSelectedDayDetails(date)
        setIsDayDetailsOpen(true)
    }

    const getNotesForDay = (date: Date) => {
        return notes.filter(n => {
            const noteDate = (n as any).date ? new Date((n as any).date) : new Date(n.created_at)
            return isSameDay(noteDate, date)
        })
    }

    // Navigation Logic
    const navigate = (direction: 'prev' | 'next') => {
        const amount = direction === 'next' ? 1 : -1
        if (view === 'month') setCurrentDate(prev => addMonths(prev, amount))
        if (view === 'week') setCurrentDate(prev => addWeeks(prev, amount))
        if (view === 'day') setCurrentDate(prev => addDays(prev, amount))
    }

    const getDays = () => {
        if (view === 'month') {
             const monthStart = startOfMonth(currentDate)
             const monthEnd = endOfMonth(monthStart)
             const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
             const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
             return eachDayOfInterval({ start: startDate, end: endDate })
        }
        if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 })
            const end = endOfWeek(currentDate, { weekStartsOn: 1 })
            return eachDayOfInterval({ start, end })
        }
        if (view === 'day') {
            return [currentDate]
        }
        return []
    }

    const days = getDays()
    const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
    
    // Group days into weeks for Month View
    const weeks = []
    if (view === 'month') {
        let currentWeek = []
        for (let day of days) {
            currentWeek.push(day)
            if (currentWeek.length === 7) {
                weeks.push(currentWeek)
                currentWeek = []
            }
        }
    }

    const getEventsForDay = (date: Date) => {
        return events.filter(e => {
            const eventDate = new Date(e.start_time)
            return isSameDay(eventDate, date)
        })
    }

    const getTitle = () => {
        if (view === 'month') return format(currentDate, 'LLLL yyyy', { locale: pl })
        if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 })
            const end = endOfWeek(currentDate, { weekStartsOn: 1 })
            return `${format(start, 'd MMM', { locale: pl })} - ${format(end, 'd MMM yyyy', { locale: pl })}`
        }
        return format(currentDate, 'd MMMM yyyy', { locale: pl })
    }

    return (
        <div className="flex h-full gap-6">
            {/* Left Side - Calendar Grid (3/4 width) */}
            <div className="flex-1 flex flex-col min-w-0 space-y-4">
                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    className={cn(
                                        "justify-start text-left font-bold text-2xl text-foreground hover:bg-accent hover:text-foreground px-2 h-auto py-1",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-6 w-6" />
                                    {format(currentDate, 'dd.MM.yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-transparent border-none shadow-none" align="start">
                                <DateSlider 
                                    selected={currentDate}
                                    onSelect={(date) => setCurrentDate(date)}
                                />
                            </PopoverContent>
                        </Popover>

                        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-3 bg-muted border border-border">
                                <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">
                                    <LayoutGrid className="h-4 w-4 mr-2" />
                                    Miesiąc
                                </TabsTrigger>
                                <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Tydzień
                                </TabsTrigger>
                                <TabsTrigger value="day" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Dzień
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="default" 
                            size="icon" 
                            onClick={() => setIsAddEventOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground mr-2"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigate('prev')} className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => navigate('next')} className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid - Modern Theme Wrapper */}
                <div className={cn(
                    "flex-1 flex flex-col min-h-0 rounded-lg shadow-sm overflow-hidden transition-all duration-300",
                    "bg-card border border-border"
                )}>
                    
                    {/* Month View */}
                    {view === 'month' && (
                        <>
                            {/* Header Row */}
                            <div className="grid grid-cols-[auto_1fr] border-b border-border bg-muted/30">
                                 <div className="w-8 p-3 text-center text-xs font-semibold text-muted-foreground border-r border-border">
                                     #
                                 </div>
                                 <div className="grid grid-cols-7">
                                    {weekDays.map((day) => (
                                        <div key={day} className="p-3 text-center text-sm font-semibold text-foreground">
                                            {day}
                                        </div>
                                    ))}
                                 </div>
                            </div>
                            
                            {/* Weeks Grid */}
                            <div className="flex-1 flex flex-col divide-y divide-border/50 overflow-y-auto">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="grid grid-cols-[auto_1fr] min-h-[100px] flex-1">
                                        <div className="w-8 flex items-center justify-center text-xs font-medium text-muted-foreground border-r border-border bg-muted/30">
                                            {getWeek(week[0], { locale: pl })}
                                        </div>
                                        <div className="grid grid-cols-7 divide-x divide-border/50">
                                            {week.map((day) => {
                                                const events = getEventsForDay(day)
                                                const isToday = isSameDay(day, new Date())
                                                const isCurrentMonth = isSameMonth(day, currentDate)
                                                
                                                const meetingCount = events.filter(e => e.type === 'meeting').length
                                                const reminderCount = events.filter(e => e.type === 'reminder').length
                                                const otherCount = events.filter(e => e.type === 'other').length

                                                return (
                                                    <div 
                                                        key={day.toString()} 
                                                        onClick={() => handleDayClick(day)}
                                                        className={cn(
                                                            "p-2 flex flex-col transition-colors hover:bg-accent/50 cursor-pointer",
                                                            !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                                            isToday && "bg-primary/5"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className={cn(
                                                                "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                                                isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                                                                !isCurrentMonth && "text-muted-foreground/50"
                                                            )}>
                                                                {format(day, 'd')}
                                                            </span>
                                                            
                                                            <div className="flex items-center gap-1">
                                                                {meetingCount > 0 && (
                                                                    <span className="flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold text-blue-600 bg-blue-500/10 dark:text-blue-400 rounded-full px-1" title="Spotkania">
                                                                        {meetingCount}
                                                                    </span>
                                                                )}
                                                                {reminderCount > 0 && (
                                                                    <span className="flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold text-red-600 bg-red-500/10 dark:text-red-400 rounded-full px-1" title="Przypomnienia">
                                                                        {reminderCount}
                                                                    </span>
                                                                )}
                                                                {otherCount > 0 && (
                                                                    <span className="flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold text-orange-600 bg-orange-500/10 dark:text-orange-400 rounded-full px-1" title="Inne">
                                                                        {otherCount}
                                                                    </span>
                                                                )}
                                                                
                                                                {getNotesForDay(day).length > 0 && (
                                                                    <div className="w-2 h-2 rounded-full bg-amber-500" title="Notatka" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                                            {events.map(event => (
                                                                <div 
                                                                    key={event.id}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setSelectedEvent(event)
                                                                    }}
                                                                    className={cn(
                                                                        "px-1.5 py-0.5 rounded text-[10px] cursor-pointer border shadow-sm truncate transition-all hover:scale-[1.02]",
                                                                        event.type === 'meeting' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : 
                                                                        event.type === 'reminder' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                                        "bg-gray-500/10 border-gray-500/20 text-gray-500"
                                                                    )}
                                                                    title={event.title}
                                                                >
                                                                    <span className="font-bold mr-1">{format(new Date(event.start_time), 'HH:mm')}</span>
                                                                    {event.title}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Week View */}
                    {view === 'week' && (
                        <div className="flex flex-col h-full overflow-hidden bg-card">
                             {/* Header */}
                             <div className="grid grid-cols-[80px_1fr] border-b border-border bg-muted/30 shrink-0">
                                <div className="p-3 text-center text-xs font-semibold text-muted-foreground border-r border-border">
                                    GMT+1
                                </div>
                                <div className="grid grid-cols-7 divide-x divide-border">
                                    {days.map((day) => {
                                        const isToday = isSameDay(day, new Date())
                                        return (
                                            <div 
                                                key={day.toString()} 
                                                onClick={() => handleDayClick(day)}
                                                className={cn("p-2 text-center cursor-pointer hover:bg-accent transition-colors", isToday && "bg-primary/5")}
                                            >
                                                <div className="text-xs font-medium text-muted-foreground mb-1">{format(day, 'EEE', { locale: pl })}</div>
                                                <div className={cn(
                                                    "text-sm font-bold inline-block w-7 h-7 leading-7 rounded-full",
                                                    isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                                                )}>
                                                    {format(day, 'd')}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                             </div>

                             {/* Time Grid */}
                             <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-[80px_1fr] divide-x divide-border min-h-[1040px]">
                                    {/* Time Column */}
                                    <div className="divide-y divide-border/50 border-r border-border">
                                        {eachHourOfInterval({ 
                                            start: setHours(startOfDay(currentDate), 7), 
                                            end: setHours(startOfDay(currentDate), 19) 
                                        }).map((hour) => (
                                            <div key={hour.toString()} className="h-20 text-xs text-muted-foreground text-right pr-3 pt-2 relative">
                                                {format(hour, 'HH:mm')}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Days Columns */}
                                    <div className="grid grid-cols-7 divide-x divide-border relative">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 grid grid-rows-[repeat(13,80px)] divide-y divide-border/50 pointer-events-none">
                                            {Array.from({ length: 13 }).map((_, i) => (
                                                <div key={i} className="w-full"></div>
                                            ))}
                                        </div>

                                        {days.map((day) => (
                                            <div key={day.toString()} className="relative h-full">
                                                {/* Events */}
                                                {getEventsForDay(day).map(event => {
                                                    const start = new Date(event.start_time)
                                                    const end = new Date(event.end_time)
                                                    const startHour = start.getHours()
                                                    const startMin = start.getMinutes()
                                                    const durationMin = (end.getTime() - start.getTime()) / (1000 * 60)
                                                    
                                                    const top = ((startHour - 7) * 80) + (startMin * (80/60))
                                                    const height = Math.max(durationMin * (80/60), 40)

                                                    if (startHour < 7 || startHour > 19) {
                                                    }

                                                    return (
                                                        <div 
                                                            key={event.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedEvent(event)
                                                            }}
                                                            style={{ top: `${top}px`, height: `${height}px` }}
                                                            className={cn(
                                                                "absolute left-1 right-1 p-1.5 rounded text-[10px] cursor-pointer border shadow-sm transition-all hover:scale-[1.02] hover:z-20 z-10 overflow-hidden leading-tight",
                                                                event.type === 'meeting' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : 
                                                                event.type === 'reminder' ? "bg-destructive/10 border-destructive/20 text-destructive" :
                                                                "bg-gray-500/10 border-gray-500/20 text-gray-500"
                                                            )}
                                                            title={`${event.title} (${format(start, 'HH:mm')} - ${format(end, 'HH:mm')})`}
                                                        >
                                                            <div className="font-bold mb-0.5">
                                                                {format(start, 'HH:mm')}
                                                            </div>
                                                            <div className="font-semibold truncate">{event.title}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Day View */}
                    {view === 'day' && (
                        <div className="flex flex-col h-full overflow-hidden bg-card">
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-[80px_1fr] divide-x divide-border">
                                    {/* Time Column */}
                                    <div className="divide-y divide-border/50 border-r border-border">
                                        {eachHourOfInterval({ 
                                            start: setHours(startOfDay(currentDate), 7), 
                                            end: setHours(startOfDay(currentDate), 19) 
                                        }).map((hour) => (
                                            <div key={hour.toString()} className="h-20 text-xs text-muted-foreground text-right pr-3 pt-2 relative">
                                                {format(hour, 'HH:mm')}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Events Column */}
                                    <div className="relative divide-y divide-border/50">
                                        {eachHourOfInterval({ 
                                            start: setHours(startOfDay(currentDate), 7), 
                                            end: setHours(startOfDay(currentDate), 19) 
                                        }).map((hour) => (
                                            <div 
                                                key={hour.toString()} 
                                                className="h-20 hover:bg-accent/30 transition-colors cursor-pointer"
                                                onClick={() => handleSlotClick(currentDate, hour)}
                                            ></div>
                                        ))}
                                        
                                        {/* Absolute Positioning for Events */}
                                        {getEventsForDay(currentDate).map(event => {
                                            const start = new Date(event.start_time)
                                            const end = new Date(event.end_time)
                                            const startHour = start.getHours()
                                            const startMin = start.getMinutes()
                                            const durationMin = (end.getTime() - start.getTime()) / (1000 * 60)
                                            
                                            const top = ((startHour - 7) * 80) + (startMin * (80/60))
                                            const height = Math.max(durationMin * (80/60), 40)

                                            if (startHour < 7 || startHour > 19) {
                                            }

                                            return (
                                                <div 
                                                    key={event.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedEvent(event)
                                                    }}
                                                    style={{ top: `${top}px`, height: `${height}px` }}
                                                    className={cn(
                                                        "absolute left-2 right-2 p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-all z-10 overflow-hidden",
                                                        event.type === 'meeting' ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" : 
                                                        event.type === 'reminder' ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400" :
                                                        "bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="font-bold text-sm">
                                                            {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                                                        </div>
                                                        {event.type === 'reminder' && <span className="text-[10px] bg-background/50 px-1 rounded uppercase font-bold">Przypomnienie</span>}
                                                    </div>
                                                    <div className="font-bold text-base mt-1">{event.title}</div>
                                                    <div className="text-sm opacity-90 mt-1">{event.description}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Right Side - Reminders (1/4 width) */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-card/50 p-4 rounded-lg border border-border h-full backdrop-blur-sm shadow-sm mt-[52px]">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive"></span>
                    Nadchodzące Przypomnienia
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                    {events.filter(e => {
                        if (e.type !== 'reminder') return false
                        const eventDate = new Date(e.start_time)
                        const today = startOfDay(new Date())
                        const nextWeek = endOfDay(addDays(today, 7))
                        return eventDate >= today && eventDate <= nextWeek
                    }).map(event => (
                        <div 
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="bg-card border-l-4 border-l-destructive border-y border-r border-y-border border-r-border p-3 rounded-r-md cursor-pointer hover:bg-accent transition-colors shadow-sm group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-destructive font-bold text-[10px] uppercase tracking-wider">PRZYPOMNIENIE</div>
                            </div>
                            <div className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{event.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span>{format(new Date(event.start_time), 'dd MMMM', { locale: pl })}</span>
                            </div>
                        </div>
                    ))}
                    {events.filter(e => e.type === 'reminder').length === 0 && (
                        <div className="text-center text-muted-foreground text-xs py-10">
                            Brak nadchodzących przypomnień
                        </div>
                    )}
                </div>
            </div>

            {/* Event Details Panel */}
            <EventDetailsPanel 
                event={selectedEvent} 
                open={!!selectedEvent}
                onOpenChange={(open) => !open && setSelectedEvent(null)}
            />

            {/* Add Event Dialog */}
            <AddEventDialog 
                open={isAddEventOpen} 
                onOpenChange={(open) => {
                    setIsAddEventOpen(open)
                    if (!open) setSelectedSlot(null)
                }}
                onAdd={handleAddEvent}
                defaultDate={selectedSlot?.date || currentDate}
                defaultTime={selectedSlot?.time}
            />

            {/* Day Details Sheet */}
            <DayDetailsSheet
                date={selectedDayDetails}
                open={isDayDetailsOpen}
                onOpenChange={setIsDayDetailsOpen}
                events={selectedDayDetails ? getEventsForDay(selectedDayDetails) : []}
                notes={selectedDayDetails ? getNotesForDay(selectedDayDetails) : []}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
            />
        </div>
    )
}
