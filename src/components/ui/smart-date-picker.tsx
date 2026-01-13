import * as React from "react"
import { format, addDays, nextSaturday, isSameDay, startOfToday, setHours, setMinutes } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "./time-picker"

interface SmartDatePickerProps {
  date?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  includeTime?: boolean
}

export function SmartDatePicker({
  date,
  onSelect,
  placeholder = "Wybierz datę",
  className,
  disabled = false,
  includeTime = false
}: SmartDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      onSelect(undefined)
      setOpen(false)
      return
    }

    let updatedDate = newDate
    if (includeTime && date) {
      // Preserve time from existing date if available
      updatedDate = setHours(updatedDate, date.getHours())
      updatedDate = setMinutes(updatedDate, date.getMinutes())
    } else if (includeTime && !date) {
      // Default to 09:00 if no previous time
      updatedDate = setHours(updatedDate, 9)
      updatedDate = setMinutes(updatedDate, 0)
    }

    onSelect(updatedDate)
    
    // If we have time, don't close automatically so user can adjust time
    if (!includeTime) {
      setOpen(false)
    }
  }

  const presets = [
    { label: "Dzisiaj", getValue: () => startOfToday() },
    { label: "Jutro", getValue: () => addDays(startOfToday(), 1) },
    { label: "Weekend", getValue: () => nextSaturday(startOfToday()) },
    { label: "Za tydzień", getValue: () => addDays(startOfToday(), 7) },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal transition-all hover:bg-accent hover:text-accent-foreground",
            !date && "text-muted-foreground",
            open && "ring-2 ring-primary ring-offset-2",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            <span className="font-medium flex items-center gap-2">
                <span>{format(date, "d MMMM yyyy", { locale: pl })}</span>
                {includeTime && (
                    <span className="text-muted-foreground font-normal flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs">
                        <Clock className="h-3 w-3" />
                        {format(date, "HH:mm")}
                    </span>
                )}
                {!includeTime && (
                   <span className="text-muted-foreground font-normal ml-1">
                      ({format(date, "EEEE", { locale: pl })})
                   </span>
                )}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl rounded-xl overflow-hidden" align="start">
        <div className="p-3 bg-muted/30 border-b border-border">
             <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                    <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 text-xs font-medium border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-colors",
                        date && isSameDay(date, preset.getValue()) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-solid border-primary"
                    )}
                    onClick={() => handleSelect(preset.getValue())}
                    >
                    {preset.label}
                    </Button>
                ))}
             </div>
        </div>
        
        <div className="flex divide-x divide-border">
            <div className="p-1">
                <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
                locale={pl}
                className="p-3"
                classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                }}
                />
            </div>
            
            {includeTime && (
                <div className="bg-card">
                   <TimePicker date={date} setDate={onSelect} />
                </div>
            )}
        </div>

        {(date || includeTime) && (
            <div className="p-2 border-t border-border bg-muted/10 flex justify-between gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                        onSelect(undefined)
                        setOpen(false)
                    }} 
                    className="flex-1 h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                    Wyczyść
                </Button>
                {includeTime && (
                    <Button 
                        size="sm" 
                        onClick={() => setOpen(false)} 
                        className="flex-1 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Zatwierdź
                    </Button>
                )}
            </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
