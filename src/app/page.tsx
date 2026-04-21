"use client"

import React, { useState, useEffect } from 'react'
import { PinPad } from '@/components/pin-pad'
import { UserDashboard } from '@/components/user-dashboard'
import { AdminDashboard } from '@/components/admin-dashboard'
import { MOCK_USERS, MOCK_INVENTORY, User } from '@/lib/mock-db'
import { Toaster } from '@/components/ui/toaster'

type AppView = 'login' | 'user' | 'admin'

export default function Club99App() {
  const [view, setView] = useState<AppView>('login')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loginError, setLoginError] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (pin: string) => {
    const user = MOCK_USERS.find(u => u.pin === pin)
    if (user) {
      setCurrentUser(user)
      setLoginError('')
      setView(user.role === 'admin' ? 'admin' : 'user')
    } else {
      setLoginError('Ungültiger PIN. Versuche es erneut.')
    }
  }

  const handleLogout = () => {
    setView('login')
    setCurrentUser(null)
    setLoginError('')
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center relative">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent blur-[120px] rounded-full" />
      </div>

      <div className="w-full h-full flex items-center justify-center p-4 z-10">
        {view === 'login' && (
          <PinPad onComplete={handleLogin} error={loginError} />
        )}

        {view === 'user' && currentUser && (
          <UserDashboard
            user={currentUser}
            inventory={MOCK_INVENTORY}
            onLogout={handleLogout}
          />
        )}

        {view === 'admin' && currentUser && (
          <AdminDashboard
            user={currentUser}
            inventory={MOCK_INVENTORY}
            onLogout={handleLogout}
          />
        )}
      </div>

      <Toaster />
    </main>
  )
}