'use client'

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock, Briefcase, Gavel, AlertCircle, Check, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { SmartDatePicker } from "@/components/ui/smart-date-picker"

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
}

function TimePicker({ value, onChange }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [hour, minute] = value.split(':')
    
    const scrollRefHours = useRef<HTMLDivElement>(null)
    const scrollRefMinutes = useRef<HTMLDivElement>(null)

    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                const hourBtn = scrollRefHours.current?.querySelector(`[data-value="${hour}"]`)
                const minuteBtn = scrollRefMinutes.current?.querySelector(`[data-value="${minute}"]`)
                
                if (hourBtn) {
                    hourBtn.scrollIntoView({ behavior: 'auto', block: 'center' })
                }
                if (minuteBtn) {
                    minuteBtn.scrollIntoView({ behavior: 'auto', block: 'center' })
                }
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-center text-center font-medium bg-background border-border text-foreground h-9 px-3 text-sm",
                        !value && "text-muted-foreground"
                    )}
                >
                    <Clock className="mr-2 h-3.5 w-3.5 text-primary" />
                    {value}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0 bg-card border-border" align="center">
                <div className="flex h-[180px] divide-x divide-border">
                    <ScrollArea className="flex-1 h-full">
                        <div ref={scrollRefHours} className="p-2 space-y-1">
                            {hours.map((h) => (
                                <Button
                                    key={h}
                                    data-value={h}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "w-full justify-center font-normal",
                                        hour === h && "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground"
                                    )}
                                    onClick={() => {
                                        onChange(`${h}:${minute}`)
                                    }}
                                >
                                    {h}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                    <ScrollArea className="flex-1 h-full">
                        <div ref={scrollRefMinutes} className="p-2 space-y-1">
                            {minutes.map((m) => (
                                <Button
                                    key={m}
                                    data-value={m}
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "w-full justify-center font-normal",
                                        minute === m && "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground"
                                    )}
                                    onClick={() => {
                                        onChange(`${hour}:${m}`)
                                        setIsOpen(false)
                                    }}
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    )
}

interface AddEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (event: any) => void
    defaultDate?: Date
    defaultTime?: string
}

export function AddEventDialog({ open, onOpenChange, onAdd, defaultDate = new Date(), defaultTime = "09:00" }: AddEventDialogProps) {
    const [title, setTitle] = useState("")
    const [date, setDate] = useState<Date | undefined>(defaultDate)
    const [startTime, setStartTime] = useState(defaultTime)
    const [endTime, setEndTime] = useState("10:00")
    const [type, setType] = useState("meeting")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (open) {
            setDate(defaultDate)
            setStartTime(defaultTime)
            
            // Calculate end time (+1 hour)
            const [h, m] = defaultTime.split(':').map(Number)
            const endH = (h + 1) % 24
            const endM = m
            setEndTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`)
        }
    }, [open, defaultDate, defaultTime])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!date) return

        const dateStr = format(date, 'yyyy-MM-dd')
        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            start_time: `${dateStr}T${startTime}:00`,
            end_time: `${dateStr}T${endTime}:00`,
            type,
            description
        }

        onAdd(newEvent)
        onOpenChange(false)
        
        // Reset form
        setTitle("")
        setDescription("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border text-card-foreground shadow-2xl p-0 gap-0 overflow-hidden [&>button]:hidden">
                <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            Nowe wydarzenie
                        </DialogTitle>
                    </DialogHeader>
                    <Button
                         variant="ghost"
                         size="icon"
                         className="h-8 w-8 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors -mr-2"
                         onClick={() => onOpenChange(false)}
                     >
                         <X className="h-4 w-4" />
                     </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {/* Type Selection - Visual Cards */}
                    <div className="grid grid-cols-1 gap-2 mb-4">
                        <div 
                            onClick={() => setType('meeting')}
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-2 flex flex-col items-center justify-center gap-1.5 transition-all",
                                type === 'meeting' 
                                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                                    : "border-muted bg-card text-muted-foreground hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-400"
                            )}
                        >
                            <Briefcase className="h-5 w-5" />
                            <span className="text-[10px] font-medium uppercase tracking-wide">Wydarzenie</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Title Section */}
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tytuł</Label>
                            <Input 
                                id="title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="np. Spotkanie" 
                                className="bg-background border-border text-foreground focus:ring-primary h-9 text-sm"
                                required 
                            />
                        </div>

                        {/* Date & Time Card */}
                        <div className="bg-muted/30 rounded-lg p-3 border border-border space-y-3">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Kiedy?</Label>
                                
                                <SmartDatePicker
                                    date={date}
                                    onSelect={setDate}
                                    placeholder="Wybierz datę wydarzenia"
                                    className="w-full"
                                />

                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                 <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Początek</Label>
                                    <div className="relative">
                                        <TimePicker value={startTime} onChange={setStartTime} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Koniec</Label>
                                    <div className="relative">
                                        <TimePicker value={endTime} onChange={setEndTime} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="desc" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Notatki</Label>
                            <Textarea 
                                id="desc" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                placeholder="Dodatkowe informacje..." 
                                className="bg-background border-border text-foreground focus:ring-primary min-h-[60px] resize-none text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                            Anuluj
                        </Button>
                        <Button type="submit" className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]">
                            Zapisz
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}