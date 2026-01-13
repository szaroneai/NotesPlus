'use client'

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  FileText,
  Gavel
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-[0.8rem] font-medium text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 w-full max-w-lg"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline-flex">Szukaj notatek, dokumentów...</span>
        <span className="inline-flex lg:hidden">Szukaj...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/calendar'))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Modules">
            <CommandItem onSelect={() => runCommand(() => router.push('/leads'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Leads</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/clients'))}>
              <Smile className="mr-2 h-4 w-4" />
              <span>Clients</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/cases'))}>
              <Gavel className="mr-2 h-4 w-4" />
              <span>Cases</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
