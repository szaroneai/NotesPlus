
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileImage, File, Download } from "lucide-react"
import { Document } from "@/lib/mock-data"

interface DocumentPreviewDialogProps {
    document: Document | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DocumentPreviewDialog({ document, open, onOpenChange }: DocumentPreviewDialogProps) {
    if (!document) return null

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-6 w-6 text-red-500" />
            case 'docx': return <FileText className="h-6 w-6 text-blue-500" />
            case 'image': return <FileImage className="h-6 w-6 text-purple-500" />
            default: return <File className="h-6 w-6 text-muted-foreground" />
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-card border-border text-foreground p-0 gap-0">
                <DialogHeader className="p-4 border-b border-border">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        {getFileIcon(document.type)}
                        <span className="truncate">{document.title}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {document.relatedTo} • {document.size} • {document.uploadDate}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 bg-muted/20 flex items-center justify-center overflow-hidden relative w-full h-full p-4">
                    {document.type === 'image' && document.url ? (
                        <img 
                            src={document.url} 
                            alt={document.title} 
                            className="w-full h-full object-contain"
                        />
                    ) : document.type === 'pdf' && document.url ? (
                        <iframe 
                            src={document.url} 
                            className="w-full h-full rounded-md shadow-sm bg-white" 
                            title={document.title}
                        />
                    ) : document.type === 'image' ? (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <FileImage className="h-24 w-24 opacity-20" />
                            <p>Podgląd obrazu niedostępny (brak URL)</p>
                        </div>
                    ) : document.type === 'pdf' ? (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <FileText className="h-24 w-24 opacity-20" />
                            <p>Podgląd PDF niedostępny (brak URL)</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <File className="h-24 w-24 opacity-20" />
                            <p>Brak podglądu dla tego typu pliku</p>
                            <p className="text-sm">Pobierz plik, aby go otworzyć.</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t border-border bg-card">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Zamknij</Button>
                    <Button onClick={() => document.url && window.open(document.url, '_blank')}>
                        <Download className="mr-2 h-4 w-4" />
                        Pobierz
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
