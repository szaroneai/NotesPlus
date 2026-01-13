'use client'

import { Sidebar } from "./sidebar"
import { AiAssistant } from "@/components/features/ai-assistant/ai-assistant"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Sidebar */}
            <Sidebar className="hidden md:block w-64 flex-shrink-0" />

            {/* Main Content */}
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                {/* Content Area */}
                <main className="flex-1 overflow-auto p-8 md:p-10">
                    {children}
                </main>
            </div>
            
            {/* AI Assistant */}
            <AiAssistant />
        </div>
    )
}
