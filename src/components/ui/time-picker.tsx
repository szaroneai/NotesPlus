import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const [hours, setHours] = React.useState(date ? date.getHours().toString().padStart(2, '0') : "12")
  const [minutes, setMinutes] = React.useState(date ? date.getMinutes().toString().padStart(2, '0') : "00")

  React.useEffect(() => {
    if (date) {
        setHours(date.getHours().toString().padStart(2, '0'))
        setMinutes(date.getMinutes().toString().padStart(2, '0'))
    }
  }, [date])

  const updateTime = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours)
    const m = parseInt(newMinutes)
    
    if (!isNaN(h) && !isNaN(m)) {
        if (date) {
            const newDate = new Date(date)
            newDate.setHours(h)
            newDate.setMinutes(m)
            setDate(newDate)
        } else {
            // If no date selected, pick today with this time
            const newDate = new Date()
            newDate.setHours(h)
            newDate.setMinutes(m)
            newDate.setSeconds(0)
            newDate.setMilliseconds(0)
            setDate(newDate)
        }
    }
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    // Allow typing
    setHours(val)
    
    // Validate and update if valid number
    const num = parseInt(val)
    if (!isNaN(num) && num >= 0 && num <= 23) {
         // Only update date if length is 2 or it's valid
         updateTime(val, minutes)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    setMinutes(val)
    
    const num = parseInt(val)
    if (!isNaN(num) && num >= 0 && num <= 59) {
        updateTime(hours, val)
    }
  }

  const handleBlur = () => {
     // Format on blur
     let h = parseInt(hours)
     let m = parseInt(minutes)

     if (isNaN(h) || h < 0) h = 0
     if (h > 23) h = 23
     
     if (isNaN(m) || m < 0) m = 0
     if (m > 59) m = 59

     const hStr = h.toString().padStart(2, '0')
     const mStr = m.toString().padStart(2, '0')
     
     setHours(hStr)
     setMinutes(mStr)
     updateTime(hStr, mStr)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 bg-card h-full min-h-[300px]">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Czas</span>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-[10px] text-muted-foreground uppercase">Godz</Label>
                <Input
                    id="hours"
                    className="w-16 text-center text-lg h-12 bg-background"
                    value={hours}
                    onChange={handleHourChange}
                    onBlur={handleBlur}
                    type="number"
                    min={0}
                    max={23}
                />
            </div>
            <span className="text-2xl font-light text-muted-foreground mt-4">:</span>
            <div className="grid gap-1 text-center">
                <Label htmlFor="minutes" className="text-[10px] text-muted-foreground uppercase">Min</Label>
                <Input
                    id="minutes"
                    className="w-16 text-center text-lg h-12 bg-background"
                    value={minutes}
                    onChange={handleMinuteChange}
                    onBlur={handleBlur}
                    type="number"
                    min={0}
                    max={59}
                    step={5}
                />
            </div>
        </div>
        
        <div className="text-xs text-muted-foreground text-center max-w-[150px] mt-2">
            Wpisz godzinę lub użyj strzałek
        </div>
    </div>
  )
}
