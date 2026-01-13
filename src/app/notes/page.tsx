'use client'

import { useData } from "@/context/data-context"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"

export default function NotesPage() {
    const { notes, deleteNote } = useData()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Notatki</h1>
                    <p className="text-muted-foreground">Twoje osobiste notatki i pomysły.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nowa notatka
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                    <Card key={note.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{note.title}</CardTitle>
                            <div className="text-xs text-muted-foreground">
                                {format(new Date(note.createdAt), "d MMMM yyyy", { locale: pl })}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-4">
                                {note.content}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {note.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-gray-500/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                             <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
