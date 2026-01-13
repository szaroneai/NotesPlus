'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet"
import { Bot, Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export function AISidebar() {
    const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
        {role: 'ai', content: 'Witaj, jestem Twoim asystentem LawFlow. W czym mogę pomóc?'}
    ])
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, {role: 'user', content: input}])
        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {role: 'ai', content: `Otrzymałem Twoje zapytanie: "${input}". (To jest mock odpowiedzi AI)`}])
        }, 1000)
        setInput('')
    }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-none shadow-lg">
          <Bot className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            LawFlow Agent
            </SheetTitle>
            <SheetDescription>
                Twój osobisty asystent prawny.
            </SheetDescription>
        </SheetHeader>
        <div className="flex-1 py-4 overflow-hidden">
             <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                                m.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>
             </ScrollArea>
        </div>
        <SheetFooter className="pt-2">
          <div className="flex w-full items-center space-x-2">
            <Input 
                type="text" 
                placeholder="Zapytaj o klienta lub sprawę..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button type="submit" size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
