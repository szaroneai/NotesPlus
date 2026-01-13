'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
    Note,
    Attachment,
    Todo,
    User,
    MOCK_TODOS,
    MOCK_USERS,
    MOCK_NOTES,
    MOCK_ATTACHMENTS
} from '@/lib/mock-data'

export interface CalendarEvent {
    id: string
    title: string
    start_time: string
    end_time: string
    type: 'meeting' | 'reminder' | 'other'
    description?: string
    noteId?: string
}

interface DataContextType {
    notes: Note[]
    attachments: Attachment[]
    calendarEvents: CalendarEvent[]
    todos: Todo[]
    users: User[]
    
    // Notes
    addNote: (newNote: Note) => Promise<void>
    updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>
    deleteNote: (id: string) => Promise<void>
    
    // Attachments
    addAttachment: (attachment: Omit<Attachment, 'id' | 'uploadDate'>) => Promise<void>
    deleteAttachment: (id: string) => Promise<void>
    
    // Calendar
    addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>
    deleteEvent: (eventId: string) => Promise<void>
    
    // Todos
    addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => Promise<void>
    toggleTodo: (todoId: string) => Promise<void>
    deleteTodo: (todoId: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [notes, setNotes] = useState<Note[]>([])
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
    const [todos, setTodos] = useState<Todo[]>([])
    const [users, setUsers] = useState<User[]>(MOCK_USERS)

    useEffect(() => {
        const fetchData = async () => {
            // Check if connection works
            const { error } = await supabase.from('profiles').select('count').limit(1)
            if (error) {
                console.log('Supabase connection issue or empty tables, using mock data')
                setNotes(MOCK_NOTES)
                setTodos(MOCK_TODOS)
                setAttachments(MOCK_ATTACHMENTS)
                return
            }

            // Fetch Notes (from 'notes' table if exists, otherwise fallback to mock)
            const { data: notesData } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
            if (notesData && notesData.length > 0) {
                setNotes(notesData as any)
            } else {
                setNotes(MOCK_NOTES)
            }

            // Fetch Attachments
            const { data: attData } = await supabase.from('attachments').select('*')
            if (attData && attData.length > 0) {
                setAttachments(attData as any)
            }

            // Fetch Calendar Events
            const { data: eventsData } = await supabase.from('calendar_events').select('*')
            if (eventsData && eventsData.length > 0) {
                setCalendarEvents(eventsData as any)
            }

            // Fetch Todos
            const { data: todosData } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
            if (todosData && todosData.length > 0) {
                setTodos(todosData as any)
            } else {
                setTodos(MOCK_TODOS)
            }
        }
        
        fetchData()
    }, [])

    // --- Notes ---
    const addNote = async (newNote: Note) => {
        const { error } = await supabase.from('notes').insert(newNote as any)
        
        if (!error) {
            setNotes(prev => [newNote, ...prev])
        } else {
            // Mock fallback
            setNotes(prev => [newNote, ...prev])
        }
    }

    const updateNote = async (noteId: string, updates: Partial<Note>) => {
        // @ts-ignore
        const { error } = await supabase.from('notes').update(updates as any).eq('id', noteId)
        
        if (!error) {
            setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates } : n))
        } else {
            // Mock fallback
            setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates } : n))
        }
    }

    const deleteNote = async (id: string) => {
        const { error } = await supabase.from('notes').delete().eq('id', id)
        
        if (!error) {
            setNotes(prev => prev.filter(n => n.id !== id))
        } else {
            // Mock fallback
            setNotes(prev => prev.filter(n => n.id !== id))
        }
    }

    // --- Attachments ---
    const addAttachment = async (attachment: Omit<Attachment, 'id' | 'uploadDate'>) => {
        const newAttachment: Attachment = {
            ...attachment,
            id: Math.random().toString(36).substring(7),
            uploadDate: new Date().toISOString()
        }

        const { error } = await supabase.from('attachments').insert(newAttachment as any)
        if (!error) {
            setAttachments(prev => [newAttachment, ...prev])
        } else {
             setAttachments(prev => [newAttachment, ...prev])
        }
    }

    const deleteAttachment = async (id: string) => {
        const { error } = await supabase.from('attachments').delete().eq('id', id)
        if (!error) {
             setAttachments(prev => prev.filter(a => a.id !== id))
        } else {
             setAttachments(prev => prev.filter(a => a.id !== id))
        }
    }

    // --- Calendar ---
    const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
        const { data, error } = await supabase.from('calendar_events').insert(event as any).select().single()
        
        if (!error && data) {
            const newEvent = data as any
            setCalendarEvents(prev => [...prev, newEvent])
        } else {
             const mockEvent = { ...event, id: Math.random().toString() } as CalendarEvent
             setCalendarEvents(prev => [...prev, mockEvent])
        }
    }

    const deleteEvent = async (eventId: string) => {
        const { error } = await supabase.from('calendar_events').delete().eq('id', eventId)
        if (!error) {
            setCalendarEvents(prev => prev.filter(e => e.id !== eventId))
        } else {
            setCalendarEvents(prev => prev.filter(e => e.id !== eventId))
        }
    }

    // --- Todos ---
    const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
        const newTodo = {
            ...todo,
            createdAt: new Date().toISOString()
        }
        
        const { data, error } = await supabase.from('todos').insert(newTodo as any).select().single()
        
        if (!error && data) {
            setTodos(prev => [data as any, ...prev])
        } else {
            const mockTodo = { ...newTodo, id: Math.random().toString() } as Todo
            setTodos(prev => [mockTodo, ...prev])
        }
    }

    const toggleTodo = async (todoId: string) => {
        const todo = todos.find(t => t.id === todoId)
        if (!todo) return

        // @ts-ignore
        const { error } = await supabase.from('todos').update({ completed: !todo.completed }).eq('id', todoId)
        
        if (!error) {
             setTodos(prev => prev.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t))
        } else {
             setTodos(prev => prev.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t))
        }
    }

    const deleteTodo = async (todoId: string) => {
        await supabase.from('todos').delete().eq('id', todoId)
        setTodos(prev => prev.filter(t => t.id !== todoId))
    }

    return (
        <DataContext.Provider value={{
            notes,
            attachments,
            calendarEvents,
            todos,
            users,
            addNote,
            updateNote,
            deleteNote,
            addAttachment,
            deleteAttachment,
            addEvent,
            deleteEvent,
            addTodo,
            toggleTodo,
            deleteTodo
        }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
