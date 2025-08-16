import React, { ReactNode } from 'react'
import { Navigation } from './Navigation'
import { CaptureBar } from './CaptureBar'
import { XPIndicator } from './XPIndicator'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with capture bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b-4 border-black bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black uppercase">Focus Architect</h1>
            <CaptureBar />
          </div>
          <XPIndicator />
        </div>
      </header>
      
      {/* Main content */}
      <main className="pt-20 pb-24">
        {children}
      </main>
      
      {/* Navigation */}
      <Navigation />
    </div>
  )
}