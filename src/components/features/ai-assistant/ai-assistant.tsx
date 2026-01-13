'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, X, MessageCircle, User, Minimize2, Maximize2, Mic, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/context/data-context"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Cześć! Jestem Twoim asystentem AI. Pomogę Ci w zarządzaniu notatkami i zadaniami. W czym mogę Ci dzisiaj pomóc?',
            timestamp: new Date()
        }
    ])
    const [isThinking, setIsThinking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const recognitionRef = useRef<any>(null)
    const shouldBeListeningRef = useRef(false)
    const lastCommittedTextRef = useRef("")
    const inputValueRef = useRef("")
    const { toast } = useToast()

    // Data Context Access
    const { notes, attachments, todos, calendarEvents, addEvent } = useData()

    // Sync inputValueRef
    useEffect(() => {
        inputValueRef.current = inputValue
    }, [inputValue])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages, isOpen])

    // Focus input on open
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen, isMinimized])

    const toggleListening = () => {
        if (isListening) {
            shouldBeListeningRef.current = false
            recognitionRef.current?.stop()
            setIsListening(false)
        } else {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognitionRef.current = recognition
                recognition.lang = 'pl-PL'
                recognition.continuous = false // Zmiana na false dla większej stabilności
                recognition.interimResults = true
                shouldBeListeningRef.current = true

                recognition.onstart = () => {
                    setIsListening(true)
                    lastCommittedTextRef.current = inputValueRef.current
                }
                
                recognition.onend = () => {
                    // Jeśli użytkownik nie zatrzymał ręcznie, wznów nasłuchiwanie
                    if (shouldBeListeningRef.current) {
                        try {
                            recognition.start()
                        } catch (e) {
                            setIsListening(false)
                            shouldBeListeningRef.current = false
                        }
                    } else {
                        setIsListening(false)
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error)
                    if (event.error === 'network') {
                        setIsListening(false)
                        shouldBeListeningRef.current = false
                        toast({
                            title: "Błąd sieci",
                            description: "Sprawdź połączenie z internetem. Rozpoznawanie mowy wymaga dostępu do sieci.",
                            variant: "destructive"
                        })
                    } else if (event.error === 'not-allowed') {
                        setIsListening(false)
                        shouldBeListeningRef.current = false
                        toast({
                            title: "Brak dostępu",
                            description: "Sprawdź uprawnienia do mikrofonu.",
                            variant: "destructive"
                        })
                    }
                    // Ignoruj błędy 'no-speech' i 'aborted' przy restarcie
                }
                
                recognition.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0].transcript)
                        .join('')
                    
                    setInputValue(() => {
                        const prefix = lastCommittedTextRef.current
                        const spacer = prefix && !prefix.endsWith(' ') ? ' ' : ''
                        return prefix + spacer + transcript
                    })
                }
                
                try {
                    recognition.start()
                } catch (e) {
                    console.error("Failed to start recognition", e)
                    setIsListening(false)
                }
            } else {
                toast({
                    title: "Błąd",
                    description: "Twoja przeglądarka nie obsługuje rozpoznawania mowy.",
                    variant: "destructive"
                })
            }
        }
    }

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'pl-PL'
        window.speechSynthesis.speak(utterance)
    }

    const handleSendMessage = async (text?: string) => {
        const content = text || inputValue
        if (!content.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsThinking(true)

        try {
            // Prepare context data
            const contextData = {
                notesCount: notes.length,
                latestNotes: notes.slice(0, 3).map(n => n.title).join(", "),
                attachmentsCount: attachments.length,
                pendingTodosCount: todos.filter(t => !t.completed).length,
                nextEvents: calendarEvents
                    .filter(e => new Date(e.start_time) >= new Date())
                    .slice(0, 3)
                    .map(e => `${e.title} (${format(new Date(e.start_time), "dd.MM HH:mm")})`)
                    .join(", ")
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    context: contextData
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.useLocal) {
                    throw new Error("Use local logic")
                }
                throw new Error(data.error || "Błąd komunikacji")
            }

            // Handle Actions
            if (data.action === 'add_event' && data.event) {
                await addEvent({
                    title: data.event.title,
                    start_time: data.event.start_time,
                    end_time: data.event.end_time || new Date(new Date(data.event.start_time).getTime() + 60 * 60 * 1000).toISOString(),
                    type: 'meeting', // Default type
                    description: data.event.description
                })
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || "Zrobione!",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            speak(aiMessage.content)
            
        } catch (error) {
            console.log("Falling back to local logic", error)
            // Fallback to local logic
            setTimeout(async () => {
                const response = await processLocalCommand(userMessage.content)
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, aiMessage])
                speak(response)
            }, 500)
        } finally {
            setIsThinking(false)
        }
    }

    const processLocalCommand = async (query: string): Promise<string> => {
        const lowerQuery = query.toLowerCase()

        // --- Action: Add Event (Local) ---
        // Pattern: "dodaj spotkanie [tytuł] jutro o 14"
        if (lowerQuery.startsWith("dodaj spotkanie") || lowerQuery.startsWith("dodaj wydarzenie")) {
            try {
                const now = new Date()
                let targetDate = new Date()
                let title = "Spotkanie"
                
                // Simple parsing logic
                if (lowerQuery.includes("jutro")) {
                    targetDate.setDate(targetDate.getDate() + 1)
                }
                
                // Extract time (HH:MM or HH)
                const timeMatch = query.match(/(\d{1,2})[:\.]?(\d{2})?/)
                if (timeMatch) {
                    const hours = parseInt(timeMatch[1])
                    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
                    targetDate.setHours(hours, minutes, 0, 0)
                } else {
                    targetDate.setHours(12, 0, 0, 0) // Default 12:00
                }

                // Extract title (simple heuristic: text between "dodaj spotkanie" and "jutro"/"o")
                const titleMatch = query.match(/dodaj (spotkanie|wydarzenie) (.+?) (jutro|dziś|o \d)/i)
                if (titleMatch && titleMatch[2]) {
                    title = titleMatch[2].trim()
                }

                await addEvent({
                    title: title,
                    start_time: targetDate.toISOString(),
                    end_time: new Date(targetDate.getTime() + 60 * 60 * 1000).toISOString(),
                    type: 'meeting',
                    description: "Dodane przez asystenta AI"
                })

                return `Dodałem wydarzenie: "${title}" na ${format(targetDate, "dd.MM.yyyy HH:mm")}.`
            } catch (e) {
                return "Próbowałem dodać wydarzenie, ale coś poszło nie tak. Spróbuj podać dokładniejszą datę."
            }
        }

        // --- Chit-Chat & General ---
        if (lowerQuery.match(/^(cześć|hej|witaj|dzień dobry)/)) {
            return "Dzień dobry! W czym mogę Ci pomóc?"
        }
        if (lowerQuery.includes("kim jesteś")) {
            return "Jestem Twoim asystentem notatnika AI. Pomagam organizować Twoje myśli i zadania."
        }
        
        // --- Logic for Notes ---
        if (lowerQuery.includes("notat")) {
            if (lowerQuery.includes("ile") || lowerQuery.includes("liczba")) {
                return `Masz aktualnie ${notes.length} notatek.`
            }
            if (lowerQuery.includes("lista") || lowerQuery.includes("pokaż")) {
                const notesList = notes.slice(0, 5).map(n => `- ${n.title}`).join('\n')
                return `Oto Twoje ostatnie notatki:\n${notesList}`
            }
        }

        // --- Logic for Todos ---
        if (lowerQuery.includes("zadan") || lowerQuery.includes("todo")) {
             const pendingTodos = todos.filter(t => !t.completed)
             return `Masz ${pendingTodos.length} niezakończonych zadań.`
        }
        
        // Default response
        return "Przepraszam, nie zrozumiałem. Zapytaj o notatki, zadania lub kalendarz."
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
            >
                <MessageCircle className="h-7 w-7" />
                <span className="sr-only">Otwórz asystenta AI</span>
            </Button>
        )
    }

    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
            isMinimized ? "w-72" : "w-[380px] sm:w-[450px]"
        )}>
            <Card className="border-0 shadow-2xl overflow-hidden bg-background/95 backdrop-blur-sm border-t border-l border-border">
                {/* Header */}
                <CardHeader className={cn(
                    "bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer",
                    isMinimized && "py-3"
                )}
                onClick={() => isMinimized && setIsMinimized(false)}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-foreground/20 p-2 rounded-lg backdrop-blur-md">
                            <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-medium">Asystent AI</CardTitle>
                            {!isMinimized && <p className="text-xs text-primary-foreground/80">MyNotes Intelligence</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsMinimized(!isMinimized)
                            }}
                        >
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {/* Body */}
                {!isMinimized && (
                    <>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full",
                                                msg.role === 'user' ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex max-w-[80%] gap-2",
                                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                            )}>
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                    msg.role === 'user' ? "bg-primary" : "bg-indigo-100"
                                                )}>
                                                    {msg.role === 'user' ? (
                                                        <User className="h-4 w-4 text-primary-foreground" />
                                                    ) : (
                                                        <Bot className="h-4 w-4 text-indigo-600" />
                                                    )}
                                                </div>
                                                <div className={cn(
                                                    "p-3 rounded-2xl text-sm whitespace-pre-wrap",
                                                    msg.role === 'user' 
                                                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                                                        : "bg-muted text-foreground rounded-tl-sm"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isThinking && (
                                        <div className="flex w-full justify-start">
                                            <div className="flex max-w-[80%] gap-2 flex-row">
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100">
                                                    <Bot className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <div className="bg-muted p-3 rounded-2xl rounded-tl-sm flex items-center gap-1 h-10">
                                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="p-3 bg-muted/20 border-t">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                                className="flex w-full gap-2"
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleListening}
                                    className={cn(isListening && "text-red-500 animate-pulse")}
                                >
                                    <Mic className="h-5 w-5" />
                                </Button>
                                <Input
                                    ref={inputRef}
                                    placeholder="Napisz wiadomość..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!inputValue.trim() || isThinking}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    )
}
