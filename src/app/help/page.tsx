'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { HelpCircle, Mail, Phone, Book, FileText } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Centrum Pomocy</h1>
                <p className="text-muted-foreground">
                    Znajdź odpowiedzi na pytania i skontaktuj się z wsparciem.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Book className="h-5 w-5" />
                                Najczęściej Zadawane Pytania (FAQ)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Jak dodać nowego klienta?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Przejdź do zakładki "Klienci" w menu bocznym i kliknij przycisk "Dodaj klienta" w prawym górnym rogu. Wypełnij formularz danymi i zatwierdź.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Jak działa asystent AI?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Asystent AI (dymek w prawym dolnym rogu) ma dostęp do Twojej bazy danych. Możesz pytać go o sprawy, terminy czy dokumenty, a on przeszuka system za Ciebie.
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Jak zintegrować kalendarz?</h3>
                                <p className="text-sm text-muted-foreground">
                                    Obecnie kalendarz jest wbudowany w system. Integracja z Google Calendar jest planowana w kolejnej wersji.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Dokumentacja
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Pobierz pełną instrukcję obsługi systemu LawFlow w formacie PDF.
                            </p>
                            <Button variant="outline" className="w-full">
                                Pobierz Instrukcję (PDF)
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Kontakt z Wsparciem
                            </CardTitle>
                            <CardDescription>
                                Masz problem techniczny? Napisz do nas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Temat</Label>
                                <Input id="subject" placeholder="Np. Problem z logowaniem" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Wiadomość</Label>
                                <textarea 
                                    id="message" 
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                                    placeholder="Opisz swój problem..."
                                />
                            </div>
                            <Button className="w-full">Wyślij zgłoszenie</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Infolinia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm opacity-90 mb-2">
                                Dostępna w dni robocze od 8:00 do 16:00.
                            </p>
                            <p className="text-2xl font-bold">
                                +48 22 123 45 67
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
