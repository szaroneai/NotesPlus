import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, CheckCircle2, Circle, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Todo } from '@/lib/mock-data'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useData } from '@/context/data-context'

interface TodoDetailsDialogProps {
    todo: Todo | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
}

export function TodoDetailsDialog({ todo, open, onOpenChange, onToggle, onDelete }: TodoDetailsDialogProps) {
    const { users } = useData()
    
    if (!todo) return null

    // const assignedUser = null // todo.assignedTo ? users.find(u => u.id === todo.assignedTo) : null

    const priorityColor = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800'
    }

    const priorityLabel = {
        low: 'Niski',
        medium: 'Średni',
        high: 'Wysoki'
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 mr-6">
                        <DialogTitle className="text-xl leading-normal break-words">
                            {todo.text}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    {/* Status and Priority */}
                    <div className="flex flex-wrap gap-3">
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 text-sm font-medium border-0",
                                todo.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            )}
                        >
                            {todo.completed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Zakończone
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4" />
                                    Do zrobienia
                                </>
                            )}
                        </Badge>

                        <Badge 
                            variant="secondary" 
                            className={cn("text-sm font-medium border-0", priorityColor[todo.priority])}
                        >
                            Priorytet: {priorityLabel[todo.priority]}
                        </Badge>

                        {/* {assignedUser && (
                            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium border-0 bg-secondary/50">
                                <Avatar className="h-4 w-4">
                                    <AvatarFallback className="text-[8px]">{assignedUser.avatar}</AvatarFallback>
                                </Avatar>
                                {assignedUser.name}
                            </Badge>
                        )} */}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Opis</h4>
                        <div className="text-sm bg-muted/30 p-4 rounded-lg min-h-[100px] whitespace-pre-wrap border">
                            {todo.description || <span className="text-muted-foreground italic">Brak dodatkowego opisu...</span>}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Termin wykonania
                            </span>
                            <p className="font-medium pl-6">
                                {todo.dueDate ? todo.dueDate.split('-').reverse().join('.') : 'Nie określono'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Utworzono
                            </span>
                            <p className="font-medium pl-6">
                                {format(new Date(todo.createdAt), "d MMMM yyyy, HH:mm", { locale: pl })}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant={todo.completed ? "outline" : "default"}
                        onClick={() => {
                            onToggle(todo.id)
                            onOpenChange(false)
                        }}
                        className="w-full sm:w-auto"
                    >
                        {todo.completed ? 'Oznacz jako do zrobienia' : 'Oznacz jako wykonane'}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onDelete(todo.id)
                            onOpenChange(false)
                        }}
                        className="w-full sm:w-auto"
                    >
                        Usuń zadanie
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
