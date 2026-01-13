import { DocumentsView } from "@/components/features/documents/documents-view"

export default function DocumentsPage() {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dokumenty</h1>
                <p className="text-muted-foreground">Baza dokumentów, pism sądowych i faktur.</p>
            </div>
            <DocumentsView />
        </div>
    )
}