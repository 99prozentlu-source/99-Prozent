"use client"

import React, { useState } from 'react'
import { User, InventoryItem, MOCK_USERS } from '@/lib/mock-db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  LogOut, 
  Package, 
  Download, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Users as UsersIcon, 
  Plus, 
  Minus, 
  Settings,
  TrendingUp
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { adminInvoiceDescriptionGenerator } from '@/ai/flows/admin-invoice-description-generator-flow'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  user: User
  inventory: InventoryItem[]
  onLogout: () => void
}

export function AdminDashboard({ user, inventory, onLogout }: AdminDashboardProps) {
  const [stock, setStock] = useState(inventory)
  const [users] = useState(MOCK_USERS)
  const [invoiceDraft, setInvoiceDraft] = useState('')
  const [invoiceClient, setInvoiceClient] = useState('')
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesc, setGeneratedDesc] = useState('')

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      admin: user.name,
      inventory: stock,
      users: users
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Club99_FullBackup_${new Date().toLocaleDateString()}.json`
    a.click()
    toast({ title: "Backup erstellt", description: "Vollständiger Datenexport erfolgreich." })
  }

  const updateStock = (id: string, delta: number) => {
    setStock(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ))
  }

  const handleGenerateDescription = async () => {
    if (!invoiceDraft) return
    setIsGenerating(true)
    try {
      const result = await adminInvoiceDescriptionGenerator({ draftDescription: invoiceDraft })
      setGeneratedDesc(result.professionalDescription)
      toast({ title: "KI-Text generiert", description: "Professionelle Beschreibung wurde erstellt." })
    } catch (error) {
      console.error('Failed to generate invoice description:', error);
      toast({ variant: "destructive", title: "Fehler", description: "KI-Dienst nicht erreichbar." });
    } finally {
      setIsGenerating(false)
    }
  }

  const createInvoice = () => {
    if (!invoiceClient || !invoiceAmount) {
      toast({ variant: "destructive", title: "Fehler", description: "Bitte Kunde und Betrag angeben." })
      return
    }
    toast({ title: "PDF erstellt", description: `Rechnung für ${invoiceClient} wurde generiert.` })
    setInvoiceClient('')
    setInvoiceAmount('')
    setGeneratedDesc('')
    setInvoiceDraft('')
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 h-screen overflow-hidden animate-in fade-in duration-500">
      <header className="flex justify-between items-center py-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-primary flex items-center gap-2 tracking-tighter">
            ADMIN <span className="text-foreground">ZENTRALE</span>
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Verein 99% SmartManager</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="border-white/10 hover:bg-destructive/10 hover:text-destructive group transition-all">
          <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Abmelden
        </Button>
      </header>

      <Tabs defaultValue="inventory" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-4 bg-card border border-white/5 p-1 rounded-xl mb-6">
          <TabsTrigger value="inventory" className="rounded-lg gap-2"><Package className="w-4 h-4" /> Lager</TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg gap-2"><UsersIcon className="w-4 h-4" /> Nutzer</TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-lg gap-2"><FileText className="w-4 h-4" /> Rechnungen</TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg gap-2"><Settings className="w-4 h-4" /> System</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto pr-2 pb-10">
          <TabsContent value="inventory" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stock.map(item => (
                <Card key={item.id} className="glass-card border-white/5">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
                        {item.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className={cn(
                          "text-sm font-medium",
                          item.stock <= item.minStock ? "text-destructive flex items-center gap-1" : "text-muted-foreground"
                        )}>
                          Bestand: <span className="font-bold">{item.stock}</span> 
                          {item.stock <= item.minStock && <AlertTriangle className="w-3 h-3 animate-pulse" />}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="secondary" className="rounded-lg h-10 w-10 border border-white/5" onClick={() => updateStock(item.id, -1)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="rounded-lg h-10 w-10 border border-white/5 bg-primary/10 text-primary hover:bg-primary/20" onClick={() => updateStock(item.id, 1)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0 space-y-4">
            <Card className="glass-card">
              <CardHeader className="p-6">
                <CardTitle className="text-lg">Mitgliederverwaltung</CardTitle>
                <CardDescription>Übersicht über alle registrierten Nutzer und deren Kontostände.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{u.name}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{u.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-lg font-black", u.balance < 0 ? "text-destructive" : "text-accent")}>
                          {u.balance.toFixed(2)} <span className="text-xs text-muted-foreground">CHF</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">Letzte Buchung: Vor 2h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-0 space-y-4">
            <Card className="glass-card border-primary/20">
              <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> KI Rechnungserstellung
                </CardTitle>
                <CardDescription>Erstelle professionelle Belege für externe Partner oder Mitglieder.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Empfänger</Label>
                    <Input 
                      placeholder="Name des Kunden..." 
                      className="bg-background/50 border-white/10" 
                      value={invoiceClient}
                      onChange={(e) => setInvoiceClient(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Betrag (CHF)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      className="bg-background/50 border-white/10" 
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inhalt / Stichpunkte</Label>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">AI ASSISTANT</span>
                  </div>
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="z.B. 10 Bier für Event X, Reinigungspauschale..." 
                      className="bg-background/50 border-white/10 min-h-[100px]" 
                      value={invoiceDraft}
                      onChange={(e) => setInvoiceDraft(e.target.value)}
                    />
                    <Button 
                      className="h-auto aspect-square bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || !invoiceDraft}
                    >
                      {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {generatedDesc && (
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 animate-in zoom-in-95 duration-300">
                    <p className="text-[10px] font-black uppercase text-accent mb-2">KI-Vorschlag:</p>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">"{generatedDesc}"</p>
                  </div>
                )}

                <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/10 hover:scale-[1.01] transition-all" onClick={createInvoice}>
                  PDF DOKUMENT GENERIEREN
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Datensicherheit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 border-white/5 hover:bg-white/5" onClick={handleExport}>
                    <Download className="w-5 h-5 text-primary" /> Full-Backup (JSON)
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 border-white/5 hover:bg-white/5" onClick={() => window.print()}>
                    <FileText className="w-5 h-5 text-accent" /> Bericht drucken
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest text-destructive">Gefahrenzone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" className="w-full h-12 font-bold opacity-50 hover:opacity-100 transition-opacity">
                    System zurücksetzen
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
