"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PinPadProps {
  onComplete: (pin: string) => void
  error?: string
}

export function PinPad({ onComplete, error }: PinPadProps) {
  const [pin, setPin] = useState('')

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      if (newPin.length === 4) {
        setTimeout(() => {
          onComplete(newPin)
          setPin('')
        }, 200)
      }
    }
  }

  const handleClear = () => setPin('')
  const handleDelete = () => setPin(prev => prev.slice(0, -1))

  const digits = Array(4).fill(0)

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xs mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-black tracking-tighter text-primary">99<span className="text-foreground">%</span></h1>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Smart System Access</p>
      </div>

      <div className="flex gap-4">
        {digits.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center transition-all duration-200",
              pin.length > i ? "pin-digit-active border-primary bg-primary" : "bg-card"
            )}
          >
            {pin.length > i && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
          </div>
        ))}
      </div>

      {error && <p className="text-destructive text-sm font-semibold animate-bounce">{error}</p>}

      <div className="grid grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="secondary"
            className="h-20 text-2xl font-bold rounded-full border-2 border-white/5 bg-card hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
            onClick={() => handlePress(num.toString())}
          >
            {num}
          </Button>
        ))}
        <Button
          variant="ghost"
          className="h-20 text-lg rounded-full"
          onClick={handleClear}
        >
          C
        </Button>
        <Button
          variant="secondary"
          className="h-20 text-2xl font-bold rounded-full border-2 border-white/5 bg-card hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
          onClick={() => handlePress('0')}
        >
          0
        </Button>
        <Button
          variant="ghost"
          className="h-20 rounded-full"
          onClick={handleDelete}
        >
          <Delete className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}