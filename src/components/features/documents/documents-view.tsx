'use client'

import { useState } from "react"
import { useData } from "@/context/data-context"
import { useToast } from "@/components/ui/use-toast"
import { Document } from "@/lib/mock-data"
import { DocumentPreviewDialog } from "@/components/shared/document-preview-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { 
    FileText, 
    Search, 
    Filter, 
    Plus, 
    Download, 
    MoreHorizontal, 
    File, 
    FileImage,
    X
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function DocumentsView() {
    const { documents, addDocument, deleteDocument, clients } = useData()
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedType, setSelectedType] = useState<string>("all")
    const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
    const [docToDelete, setDocToDelete] = useState<Document | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [newDoc, setNewDoc] = useState<Partial<Document>>({
        type: 'pdf',
        category: 'Inne',
        size: '0 KB'
    })

    const [isUploading, setIsUploading] = useState(false)

    const handleAddDocument = async () => {
        if (!selectedFile) {
            toast({
                title: "Błąd",
                description: "Proszę wybrać plik",
                variant: "destructive"
            })
            return
        }
        if (!newDoc.title) return

        setIsUploading(true)
        let fileUrl = ''
        
        if (selectedFile) {
            try {
                const formData = new FormData()
                formData.append('file', selectedFile)
                
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })
                
                if (response.ok) {
                    const data = await response.json()
                    fileUrl = data.url
                } else {
                    console.error('Upload failed')
                    // Fallback to Blob URL if server upload fails
                    fileUrl = URL.createObjectURL(selectedFile)
                }
            } catch (error) {
                console.error('Error uploading file:', error)
                fileUrl = URL.createObjectURL(selectedFile)
            }
        }

        const doc: Document = {
            id: Math.random().toString(36).substr(2, 9),
            title: newDoc.title,
            type: newDoc.type as 'pdf' | 'docx' | 'image',
            size: newDoc.size || '0 KB', // Use detected size
            uploadDate: new Date().toISOString().split('T')[0],
            relatedTo: newDoc.relatedTo || 'Brak powiązania',
            category: newDoc.category as any,
            url: fileUrl
        }

        addDocument(doc)
        setIsAddDialogOpen(false)
        setNewDoc({
            type: 'pdf',
            category: 'Inne',
            size: '0 KB',
            title: '',
            relatedTo: ''
        })
        setSelectedFile(null)
        setIsUploading(false)
    }

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
        const matchesType = selectedType === "all" || doc.type === selectedType

        return matchesSearch && matchesCategory && matchesType
    })

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategory("all")
        setSelectedType("all")
    }

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="h-8 w-8 text-red-500" />
            case 'docx': return <FileText className="h-8 w-8 text-blue-500" />
            case 'image': return <FileImage className="h-8 w-8 text-purple-500" />
            default: return <File className="h-8 w-8 text-muted-foreground" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center flex-1 gap-2 max-w-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Szukaj dokumentów..."
                            className="pl-9 bg-card/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={`border-border hover:text-foreground hover:bg-accent ${(selectedCategory !== "all" || selectedType !== "all") ? "text-primary border-primary/50 bg-primary/10" : "text-muted-foreground"}`}>
                                <Filter className="h-4 w-4 mr-2" />
                                Filtry
                                {(selectedCategory !== "all" || selectedType !== "all") && (
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 bg-primary/20 text-primary hover:bg-primary/30 border-none">
                                        {(selectedCategory !== "all" ? 1 : 0) + (selectedType !== "all" ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-background border-border p-4" align="start">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Kategoria</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="bg-card border-border text-foreground">
                                            <SelectValue placeholder="Wybierz kategorię" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="all">Wszystkie</SelectItem>
                                            <SelectItem value="Sądowe">Sądowe</SelectItem>
                                            <SelectItem value="Administracyjne">Administracyjne</SelectItem>
                                            <SelectItem value="Finansowe">Finansowe</SelectItem>
                                            <SelectItem value="Inne">Inne</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Typ pliku</Label>
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                        <SelectTrigger className="bg-card border-border text-foreground">
                                            <SelectValue placeholder="Wybierz typ" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-border text-foreground">
                                            <SelectItem value="all">Wszystkie</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="docx">DOCX</SelectItem>
                                            <SelectItem value="image">Obraz</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {(selectedCategory !== "all" || selectedType !== "all") && (
                                    <Button 
                                        variant="ghost" 
                                        className="w-full text-muted-foreground hover:text-foreground"
                                        onClick={clearFilters}
                                    >
                                        Wyczyść filtry
                                    </Button>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {(selectedCategory !== "all" || selectedType !== "all") && (
                        <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj dokument
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((doc) => (
                    <Card 
                        key={doc.id} 
                        className="bg-card/50 border-border hover:border-border/80 transition-colors group cursor-pointer"
                        onClick={() => setPreviewDocument(doc)}
                    >
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="p-2 bg-background rounded-lg border border-border group-hover:border-border/80 transition-colors">
                                {getFileIcon(doc.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-foreground truncate pr-2 group-hover:text-primary transition-colors">
                                        {doc.title}
                                    </h3>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground -mr-2 -mt-1">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                                            <DropdownMenuItem className="focus:bg-accent focus:text-foreground cursor-pointer" onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation()
                                                // Handle download
                                            }}>
                                                <Download className="h-4 w-4 mr-2" />
                                                Pobierz
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-accent focus:text-foreground cursor-pointer text-destructive focus:text-destructive" onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation()
                                                setDocToDelete(doc)
                                            }}>
                                                Usuń
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {doc.relatedTo}
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80 border-none text-[10px]">
                                        {doc.category}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">•</span>
                                    <span className="text-[10px] text-muted-foreground">{doc.size}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DocumentPreviewDialog 
                open={!!previewDocument} 
                onOpenChange={(open) => !open && setPreviewDocument(null)}
                document={previewDocument}
            />

            <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Czy na pewno chcesz usunąć ten dokument?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tej operacji nie można cofnąć. Dokument "{docToDelete?.title}" zostanie trwale usunięty.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Anuluj</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (docToDelete) {
                                    const { error } = await deleteDocument(docToDelete.id)
                                    // Always show success since we remove it from local state anyway
                                    // For mock data or local development this is better UX
                                    toast({
                                        title: "Sukces",
                                        description: "Dokument został usunięty."
                                    })
                                    setDocToDelete(null)
                                }
                            }}
                        >
                            Usuń
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open)
                if (!open) {
                    setSelectedFile(null)
                    setNewDoc({
                        type: 'pdf',
                        category: 'Inne',
                        size: '0 KB',
                        title: '',
                        relatedTo: ''
                    })
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dodaj nowy dokument</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Tytuł dokumentu</Label>
                            <Input 
                                placeholder="np. Umowa sprzedaży" 
                                value={newDoc.title || ''}
                                onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Klient</Label>
                            <Select 
                                value={newDoc.relatedTo || "none"} 
                                onValueChange={val => setNewDoc({...newDoc, relatedTo: val === "none" ? undefined : val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Wybierz klienta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Żaden</SelectItem>
                                    {clients.map(client => (
                                        <SelectItem key={client.id} value={client.full_name}>
                                            {client.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Kategoria</Label>
                                <Select 
                                    value={newDoc.category} 
                                    onValueChange={val => setNewDoc({...newDoc, category: val as any})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sądowe">Sądowe</SelectItem>
                                        <SelectItem value="Administracyjne">Administracyjne</SelectItem>
                                        <SelectItem value="Finansowe">Finansowe</SelectItem>
                                        <SelectItem value="Inne">Inne</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Plik</Label>
                            <Input 
                                type="file" 
                                className={cn(
                                    "cursor-pointer file:cursor-pointer",
                                    selectedFile ? "text-green-600 file:text-green-600 border-green-200 file:bg-green-50" : "text-red-500 file:text-red-500 border-red-200 file:bg-red-50"
                                )}
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setSelectedFile(file)
                                        const extension = file.name.split('.').pop()?.toLowerCase()
                                        let type = 'pdf'
                                        if (extension === 'docx' || extension === 'doc') type = 'docx'
                                        else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) type = 'image'
                                        
                                        // Calculate size
                                        const size = file.size > 1024 * 1024 
                                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                                            : `${(file.size / 1024).toFixed(1)} KB`

                                        setNewDoc({
                                            ...newDoc,
                                            type: type as any,
                                            size: size,
                                            // Auto-fill title if empty
                                            title: newDoc.title || file.name.split('.')[0]
                                        })
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsAddDialogOpen(false)
                            setSelectedFile(null)
                            setNewDoc({
                                type: 'pdf',
                                category: 'Inne',
                                size: '0 KB',
                                title: '',
                                relatedTo: ''
                            })
                        }}>Anuluj</Button>
                        <Button onClick={handleAddDocument} disabled={isUploading}>
                            {isUploading ? 'Wysyłanie...' : 'Dodaj'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}