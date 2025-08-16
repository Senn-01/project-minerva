import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Map, Target, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'q':
            e.preventDefault()
            navigate('/map')
            break
          case 's':
            e.preventDefault()
            navigate('/focus')
            break
          case 'd':
            e.preventDefault()
            navigate('/analytics')
            break
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
  
  const navItems = [
    { path: '/map', label: 'Map', icon: Map, shortcut: 'Q' },
    { path: '/focus', label: 'Focus', icon: Target, shortcut: 'S' },
    { path: '/analytics', label: 'Data', icon: BarChart3, shortcut: 'D' },
  ]
  
  return (
    <nav className="fixed bottom-6 right-6 z-50">
      <div className="grid grid-cols-2 gap-0 border-4 border-black bg-white shadow-brutal">
        {navItems.map(({ path, label, icon: Icon, shortcut }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "relative flex flex-col items-center justify-center p-4",
              "border-2 border-black transition-all",
              "hover:bg-brutal-yellow hover:z-10",
              location.pathname === path && "bg-brutal-yellow",
              path === '/analytics' && "col-span-2"
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold uppercase">{label}</span>
            <span className="absolute top-1 right-1 text-[10px] font-mono opacity-50">
              ⌘{shortcut}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}