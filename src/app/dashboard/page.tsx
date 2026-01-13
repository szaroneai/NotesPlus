'use client'

import { useData } from "@/context/data-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileText, Paperclip, Clock } from "lucide-react"

export default function DashboardPage() {
    const { notes, attachments } = useData()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Przegląd Twoich notatek i dokumentów.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wszystkie Notatki</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notes.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Załączniki</CardTitle>
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attachments.length}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ostatnia aktywność</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Teraz</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
