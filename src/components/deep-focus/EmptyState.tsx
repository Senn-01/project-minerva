import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <MapPin className="h-16 w-16 mb-4 opacity-30" />
      <h2 className="text-2xl font-black uppercase mb-2">📍 No Active Projects</h2>
      <Button
        onClick={() => navigate('/map')}
        variant="primary"
        size="lg"
        className="mt-6"
      >
        GO TO STRATEGIC MAP
      </Button>
    </div>
  )
}