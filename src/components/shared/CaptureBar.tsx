import React, { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils/cn'

export function CaptureBar() {
  const { addCaptureItem, captureItems } = useApp()
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const untriaged = captureItems.filter(item => !item.triagedAt)
  
  // Keyboard shortcut (CMD+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault()
        setIsExpanded(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (input.trim()) {
      addCaptureItem(input.trim())
      setInput('')
      setIsExpanded(false)
    }
  }
  
  const handleBlur = () => {
    if (!input.trim()) {
      setIsExpanded(false)
    }
  }
  
  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className={cn(
          "relative transition-all duration-200",
          isExpanded ? "w-96" : "w-48"
        )}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={handleBlur}
            placeholder={isExpanded ? "Capture any thought..." : "Quick capture..."}
            maxLength={280}
            className={cn(
              "w-full brutal-input",
              "placeholder:text-gray-400",
              isExpanded && "ring-4 ring-brutal-yellow"
            )}
          />
          {input.length > 240 && (
            <span className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono",
              input.length > 260 ? "text-brutal-red" : "text-gray-500"
            )}>
              {280 - input.length}
            </span>
          )}
        </div>
        
        {untriaged.length > 0 && (
          <div className="flex items-center gap-1 px-3 py-2 border-2 border-black bg-brutal-yellow">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-bold">{untriaged.length}</span>
          </div>
        )}
        
        <span className="text-xs font-mono text-gray-500">⌘C</span>
      </form>
    </div>
  )
}