export interface Note {
    id: string
    title: string
    content: string
    category: 'Osobiste' | 'Praca' | 'Pomysły' | 'Projekty' | 'Inne'
    tags: string[]
    createdAt: string
    updatedAt: string
    isFavorite: boolean
}

export interface Attachment {
    id: string
    name: string
    type: 'pdf' | 'image' | 'text' | 'other'
    size: string
    uploadDate: string
    noteId?: string
    url?: string
}

export interface User {
    id: string
    name: string
    role: 'owner' | 'viewer'
    avatar?: string
}

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Użytkownik', role: 'owner', avatar: 'U' }
]

export interface Todo {
    id: string
    text: string
    description?: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
    createdAt: string
}

export const MOCK_TODOS: Todo[] = [
    {
        id: 't1',
        text: 'Zrobić zakupy',
        description: 'Mleko, chleb, jajka, warzywa.',
        completed: false,
        priority: 'medium',
        createdAt: '2026-01-10T10:00:00Z',
        dueDate: '2026-01-12'
    },
    {
        id: 't2',
        text: 'Napisać raport miesięczny',
        description: 'Podsumowanie wydatków i przychodów.',
        completed: true,
        priority: 'high',
        createdAt: '2026-01-09T14:30:00Z'
    },
    {
        id: 't3',
        text: 'Umówić wizytę u dentysty',
        description: 'Kontrola roczna.',
        completed: false,
        priority: 'low',
        createdAt: '2026-01-11T09:15:00Z'
    }
]

export const MOCK_ATTACHMENTS: Attachment[] = []

export const MOCK_NOTES: Note[] = [
    {
        id: 'n1',
        title: 'Pomysły na aplikację',
        content: '1. Notatnik głosowy\n2. Integracja z kalendarzem\n3. AI asystent',
        category: 'Projekty',
        tags: ['app', 'dev', 'ideas'],
        createdAt: '2026-01-10T12:00:00Z',
        updatedAt: '2026-01-10T12:00:00Z',
        isFavorite: true
    },
    {
        id: 'n2',
        title: 'Przepis na ciasto',
        content: 'Składniki: mąka, cukier, jajka, masło...',
        category: 'Osobiste',
        tags: ['kuchnia', 'przepisy'],
        createdAt: '2026-01-11T15:30:00Z',
        updatedAt: '2026-01-11T15:30:00Z',
        isFavorite: false
    },
    {
        id: 'n3',
        title: 'Spotkanie z zespołem',
        content: 'Omówienie sprintu, podział zadań.',
        category: 'Praca',
        tags: ['spotkanie', 'agile'],
        createdAt: '2026-01-12T09:00:00Z',
        updatedAt: '2026-01-12T09:00:00Z',
        isFavorite: false
    }
]
