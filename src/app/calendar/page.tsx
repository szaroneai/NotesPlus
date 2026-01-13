import { CalendarView } from "@/components/features/calendar/calendar-view"

export default function CalendarPage() {
    return (
        <div className="h-[calc(100vh-120px)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Kalendarz</h1>
                <p className="text-muted-foreground">Tygodniowy plan wydarzeń i przypomnień.</p>
            </div>
            <div className="flex-1">
                <CalendarView />
            </div>
        </div>
    )
}
