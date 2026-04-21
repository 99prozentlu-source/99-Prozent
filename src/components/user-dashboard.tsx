"use client"

import React, { useState } from 'react'
import { User, InventoryItem } from '@/lib/mock-db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Clock, ShoppingCart, User as UserIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UserDashboardProps {
  user: User
  inventory: InventoryItem[]
  onLogout: () => void
}

export function UserDashboard({ user, inventory, onLogout }: UserDashboardProps) {
  const [balance, setBalance] = useState(user.balance)
  const [isWorking, setIsWorking] = useState(user.isWorking)

  const handleBooking = (item: InventoryItem) => {
    if (balance >= item.price) {
      setBalance(prev => prev - item.price)
      toast({
        title: "Buchung erfolgreich",
        description: `${item.name} für ${item.price.toFixed(2)} CHF gebucht.`,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Guthaben zu niedrig",
        description: "Bitte lade dein Konto auf.",
      })
    }
  }

  const toggleWork = () => {
    setIsWorking(!isWorking)
    toast({
      title: isWorking ? "Ausgestempelt" : "Eingestempelt",
      description: `Arbeitszeit wird ${isWorking ? 'beendet' : 'erfasst'}.`,
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <UserIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">{user.name}</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <Card className="glass-card overflow-hidden border-l-4 border-l-primary shadow-2xl">
        <CardContent className="p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Dein Guthaben</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-5xl font-black tracking-tight">{balance.toFixed(2)}</h1>
            <span className="text-xl font-bold text-muted-foreground">CHF</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Schnellwahl
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {inventory.map((item) => (
            <Button
              key={item.id}
              variant="secondary"
              className="h-24 flex flex-col gap-2 rounded-2xl bg-card border-2 border-white/5 hover:border-primary/50 transition-all active:scale-95 text-left items-start p-4 group"
              onClick={() => handleBooking(item)}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{item.emoji}</span>
              <div className="flex flex-col">
                <span className="font-bold text-sm">{item.name}</span>
                <span className="text-xs text-primary font-bold">{item.price.toFixed(2)} CHF</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <Button
        variant={isWorking ? "destructive" : "secondary"}
        className="h-16 rounded-2xl font-bold flex gap-3 text-lg border-2 border-white/5 shadow-lg group"
        onClick={toggleWork}
      >
        <Clock className={cn("w-5 h-5", isWorking && "animate-spin-slow")} />
        {isWorking ? "Einsatz beenden" : "Einstempeln"}
      </Button>
    </div>
  )
}