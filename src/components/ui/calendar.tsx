"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { pl } from "date-fns/locale"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={pl}
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-fit", className)}
      formatters={{
        formatWeekdayName: (date) => format(date, "EEEEE", { locale: pl }),
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-separate border-spacing-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-full w-10 h-10 font-bold text-[0.8rem] flex items-center justify-center bg-muted/30",
        row: "flex w-full mt-2 justify-between",
        cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-full"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // @ts-ignore
        Caption: (props: any) => {
            const { goToMonth, nextMonth, previousMonth } = useNavigation()
            const { displayMonth } = props
            
            const months = [
                "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 
                "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
            ]
            
            const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i)

            return (
                <div className="flex items-center justify-between gap-2 px-1">
                    <div className="flex items-center gap-1">
                        <Select 
                            value={months[displayMonth.getMonth()]} 
                            onValueChange={(value) => {
                                const newMonth = months.indexOf(value)
                                const newDate = new Date(displayMonth)
                                newDate.setMonth(newMonth)
                                goToMonth(newDate)
                            }}
                        >
                            <SelectTrigger className="h-7 w-[120px] text-xs font-medium border-none shadow-none focus:ring-0 hover:bg-accent/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(month => (
                                    <SelectItem key={month} value={month} className="text-xs">
                                        {month}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={displayMonth.getFullYear().toString()} 
                            onValueChange={(value) => {
                                const newYear = parseInt(value)
                                const newDate = new Date(displayMonth)
                                newDate.setFullYear(newYear)
                                goToMonth(newDate)
                            }}
                        >
                            <SelectTrigger className="h-7 w-[80px] text-xs font-medium border-none shadow-none focus:ring-0 hover:bg-accent/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()} className="text-xs">
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => previousMonth && goToMonth(previousMonth)}
                            disabled={!previousMonth}
                            className={cn(
                                buttonVariants({ variant: "outline" }), 
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-none shadow-none"
                            )}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => nextMonth && goToMonth(nextMonth)}
                            disabled={!nextMonth}
                            className={cn(
                                buttonVariants({ variant: "outline" }), 
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-none shadow-none"
                            )}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
