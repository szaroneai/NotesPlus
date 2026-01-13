'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ustawienia</h1>
                <p className="text-muted-foreground">
                    Zarządzaj preferencjami konta i aplikacji.
                </p>
            </div>
            <Separator />
            
            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Konto
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Powiadomienia
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Wygląd
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Użytkownika</CardTitle>
                            <CardDescription>
                                Zarządzaj swoimi danymi osobowymi i kontaktowymi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Imię i Nazwisko</Label>
                                <Input id="name" defaultValue="Mec. Jan Kowalski" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="kancelaria@law.pl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input id="phone" defaultValue="+48 123 456 789" />
                            </div>
                            <Button>Zapisz zmiany</Button>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Zmiana Hasła</CardTitle>
                            <CardDescription>
                                Zaktualizuj swoje hasło do konta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Obecne hasło</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nowe hasło</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button variant="secondary">Zmień hasło</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferencje Powiadomień</CardTitle>
                            <CardDescription>
                                Wybierz, jakie powiadomienia chcesz otrzymywać.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="notifications-email" className="flex flex-col space-y-1">
                                    <span>Powiadomienia Email</span>
                                    <span className="font-normal text-xs text-muted-foreground">Otrzymuj podsumowania dzienne na email.</span>
                                </Label>
                                {/* Placeholder for Switch component since it's not in UI yet, using checkbox style input */}
                                <input type="checkbox" id="notifications-email" className="h-4 w-4" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="notifications-sms" className="flex flex-col space-y-1">
                                    <span>Powiadomienia SMS</span>
                                    <span className="font-normal text-xs text-muted-foreground">Otrzymuj pilne alerty o terminach rozpraw.</span>
                                </Label>
                                <input type="checkbox" id="notifications-sms" className="h-4 w-4" />
                            </div>
                            <Button className="mt-4">Zapisz preferencje</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wygląd Aplikacji</CardTitle>
                            <CardDescription>
                                Dostosuj wygląd panelu do swoich potrzeb.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Motyw</Label>
                                <div className="flex gap-4">
                                    <div className="border-2 border-primary rounded-md p-2 w-32 cursor-pointer bg-background">
                                        <div className="h-16 bg-slate-100 rounded mb-2"></div>
                                        <div className="text-center text-sm font-medium">Jasny</div>
                                    </div>
                                    <div className="border border-border rounded-md p-2 w-32 cursor-pointer opacity-50">
                                        <div className="h-16 bg-slate-800 rounded mb-2"></div>
                                        <div className="text-center text-sm font-medium">Ciemny</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
