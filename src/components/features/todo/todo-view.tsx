'use client'

import { useState } from 'react'
import { useData } from '@/context/data-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Trash2, Plus, Calendar as CalendarIcon, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TodoDetailsDialog } from './todo-details-dialog'
import { Todo } from '@/lib/mock-data'
import { Textarea } from '@/components/ui/textarea'
import { SmartDatePicker } from '@/components/ui/smart-date-picker'

export function TodoView() {
    const { todos, users, addTodo, toggleTodo, deleteTodo } = useData()
    const [newTodoText, setNewTodoText] = useState('')
    const [newTodoDescription, setNewTodoDescription] = useState('')
    const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [date, setDate] = useState<Date>()
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
    const [isAddingTask, setIsAddingTask] = useState(false)

    const handleAddTodo = async () => {
        if (!newTodoText.trim()) return

        await addTodo({
            text: newTodoText,
            description: newTodoDescription,
            completed: false,
            priority: newTodoPriority,
            dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
            // assignedTo: selectedUser || undefined
        })

        setNewTodoText('')
        setNewTodoDescription('')
        setNewTodoPriority('medium')
        setSelectedUser(null)
        setDate(undefined)
        setIsAddingTask(false)
    }

    const priorityColor = {
        low: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
        medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        high: 'bg-red-100 text-red-800 hover:bg-red-100'
    }
    
    const priorityBorder = {
        low: 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50',
        medium: 'border-yellow-200 bg-yellow-50/30 hover:bg-yellow-50/50',
        high: 'border-red-200 bg-red-50/30 hover:bg-red-50/50'
    }

    const priorityLabel = {
        low: 'Niski',
        medium: 'Średni',
        high: 'Wysoki'
    }

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed === b.completed) {
            // Sort by priority (high > medium > low)
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
            if (pDiff !== 0) return pDiff
            
            // If same priority, sort by due date (earlier first)
            if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
            if (a.dueDate) return -1
            if (b.dueDate) return 1
            return 0
        }
        return a.completed ? 1 : -1
    })

    return (
        <div className="space-y-6 p-6 pb-20 sm:pb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-primary">Lista Zadań</h2>
                    <p className="text-muted-foreground mt-1">
                        Zarządzaj swoimi zadaniami i priorytetami
                    </p>
                </div>
                {!isAddingTask && (
                    <Button onClick={() => setIsAddingTask(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Dodaj zadanie
                    </Button>
                )}
            </div>

            {isAddingTask && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Nowe zadanie</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsAddingTask(false)}>
                            <span className="sr-only">Zamknij</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <Input
                                    placeholder="Co jest do zrobienia?"
                                    value={newTodoText}
                                    onChange={(e) => setNewTodoText(e.target.value)}
                                    className="w-full"
                                />
                                <div className="flex gap-2 flex-wrap">
                                <SmartDatePicker
                                    date={date}
                                    onSelect={setDate}
                                    placeholder="Termin"
                                    className="flex-1 min-w-[140px]"
                                />

                                    <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                                        <SelectTrigger className="flex-1 min-w-[180px]">
                                            <div className="flex items-center text-muted-foreground">
                                                <User className="w-4 h-4 mr-2" />
                                                {!selectedUser && <span>Przypisz osobę</span>}
                                            </div>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-5 w-5">
                                                            <AvatarFallback className="text-[10px]">{user.avatar}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={newTodoPriority} onValueChange={(v: any) => setNewTodoPriority(v)}>
                                        <SelectTrigger className="flex-1 min-w-[140px]">
                                            <SelectValue placeholder="Priorytet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Niski</SelectItem>
                                            <SelectItem value="medium">Średni</SelectItem>
                                            <SelectItem value="high">Wysoki</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Textarea
                                    placeholder="Dodatkowy opis (opcjonalnie)..."
                                    value={newTodoDescription}
                                    onChange={(e) => setNewTodoDescription(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsAddingTask(false)}>
                                        Anuluj
                                    </Button>
                                    <Button onClick={handleAddTodo}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Dodaj zadanie
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedTodos.map(todo => (
                    <Card 
                        key={todo.id} 
                        className={cn(
                            "transition-all duration-200 border-2 cursor-pointer hover:shadow-lg relative group", 
                            todo.completed 
                                ? "opacity-60 bg-muted/50 border-transparent" 
                                : priorityBorder[todo.priority]
                        )}
                        onClick={() => setSelectedTodo(todo)}
                    >
                        <CardContent className="p-4 flex flex-col gap-3 h-full">
                            <div className="flex items-start justify-between gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleTodo(todo.id)
                                    }}
                                    className={cn(
                                        "transition-colors focus:outline-none mt-1 shrink-0 z-10", 
                                        todo.completed ? "text-primary" : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    {todo.completed ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                        <Circle className="h-5 w-5" />
                                    )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    <p className={cn("font-medium break-words leading-tight", todo.completed && "line-through text-muted-foreground")}>
                                        {todo.text}
                                    </p>
                                    {todo.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {todo.description}
                                        </p>
                                    )}
                                </div>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteTodo(todo.id)
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={cn("font-normal border-0", priorityColor[todo.priority])}>
                                        {priorityLabel[todo.priority]}
                                    </Badge>
                                    {todo.dueDate && (
                                        <span className="flex items-center gap-1 text-muted-foreground/80">
                                            <CalendarIcon className="h-3 w-3" />
                                            {todo.dueDate.split('-').reverse().join('.')}
                                        </span>
                                    )}
                                </div>
                                {/* {todo.assignedTo && (
                                    <div className="flex items-center gap-1.5" title={users.find(u => u.id === todo.assignedTo)?.name}>
                                        <span className="text-[10px] hidden sm:inline-block">
                                            {users.find(u => u.id === todo.assignedTo)?.name.split(' ')[1] || 'Osoba'}
                                        </span>
                                        <Avatar className="h-5 w-5 border border-border">
                                            <AvatarFallback className="text-[9px] bg-background">
                                                {users.find(u => u.id === todo.assignedTo)?.avatar || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )} */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
                
            {sortedTodos.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Brak zadań. Dodaj pierwsze zadanie powyżej!</p>
                </div>
            )}

            <TodoDetailsDialog 
                todo={selectedTodo}
                open={!!selectedTodo}
                onOpenChange={(open) => !open && setSelectedTodo(null)}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />
        </div>
    )
}
