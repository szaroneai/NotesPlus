'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    CalendarDays, 
    Scale,
    Archive,
    Gavel,
    FileText,
    LogOut,
    Settings,
    HelpCircle,
    ListTodo
} from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Avatar, AvatarFallback,
} from "@/components/ui/avatar"
import { useData } from "@/context/data-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [currentDate, setCurrentDate] = useState<Date | null>(null)

    useEffect(() => {
        setCurrentDate(new Date())
        const timer = setInterval(() => {
            setCurrentDate(new Date())
        }, 1000 * 60) // Update every minute is enough for HH:mm
        return () => clearInterval(timer)
    }, [])

    const routes = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboard',
            active: pathname === '/dashboard'
        },
        {
            label: 'Notatki',
            icon: FileText,
            href: '/notes',
            active: pathname === '/notes'
        },
        {
            label: 'Kalendarz',
            icon: CalendarDays,
            href: '/calendar',
            active: pathname === '/calendar'
        },
        {
            label: 'Lista zadań',
            icon: ListTodo,
            href: '/todo',
            active: pathname === '/todo'
        },
    ]

    return (
        <div className={cn("flex flex-col h-screen border-r border-border bg-background text-foreground relative z-20 overflow-y-auto", className)}>
            {/* Header Section */}
            <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold tracking-tight text-primary">
                            MyNotes
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">
                            AI Notebook
                        </p>
                    </div>
                </div>

                {currentDate && (
                    <div className="px-0 py-2 mb-2 flex items-center justify-between group cursor-default border-b border-border/60 pb-4">
                        <div className="flex flex-col w-full">
                            <span className="text-sm font-serif font-medium text-primary capitalize bg-primary/10 rounded-md px-3 py-1.5 text-center border border-primary/20 shadow-sm">
                                {format(currentDate, 'EEEE, d MMMM', { locale: pl })}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 py-2 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-3">
                    Menu
                </div>
                {routes.map((route) => (
                    <Button 
                        key={route.href}
                        asChild
                        variant="ghost" 
                        className={cn(
                            "w-full justify-start mb-1 h-10 transition-all duration-200 group px-3", 
                            route.active 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <Link href={route.href}>
                            <route.icon className={cn("mr-3 h-4 w-4", route.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            <span className="flex-1 text-left tracking-wide">{route.label}</span>
                        </Link>
                    </Button>
                ))}

                {/* Utilities moved into scrollable area */}
                <div className="pt-6 mt-6 border-t border-border/60">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                        Narzędzia
                    </div>
                    <Button 
                        asChild
                        variant="ghost" 
                        className={cn(
                            "w-full justify-start mb-1 h-9 px-3 transition-colors",
                            pathname === '/settings' 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <Link href="/settings">
                            <Settings className={cn("mr-3 h-4 w-4", pathname === '/settings' ? "text-primary-foreground" : "")} />
                            Ustawienia
                        </Link>
                    </Button>
                    <Button 
                        asChild
                        variant="ghost" 
                        className={cn(
                            "w-full justify-start h-9 px-3 transition-colors",
                            pathname === '/help' 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <Link href="/help">
                            <HelpCircle className={cn("mr-3 h-4 w-4", pathname === '/help' ? "text-primary-foreground" : "")} />
                            Pomoc
                        </Link>
                    </Button>
                </div>
            </div>

            {/* User Profile Section - Pushed to absolute bottom */}
            <div className="mt-auto p-4 border-t border-border bg-secondary/20">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors cursor-pointer group border border-transparent hover:border-border">
                    <Avatar className="h-9 w-9 border border-border bg-background">
                        <AvatarFallback className="bg-secondary text-foreground text-xs font-serif">USER</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate font-serif">
                            Użytkownik
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            user@mynotes.ai
                        </p>
                    </div>
                    <LogOut className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </div>
            </div>
        </div>
    )
}
