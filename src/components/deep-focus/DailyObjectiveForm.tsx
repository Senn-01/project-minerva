import React, { useState } from 'react'
import { Target } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DailyObjectiveFormProps {
  onComplete: (sessionCount: number, duration: number) => void
  onSkip: () => void
}

export function DailyObjectiveForm({ onComplete, onSkip }: DailyObjectiveFormProps) {
  const [sessionCount, setSessionCount] = useState(3)
  const [duration, setDuration] = useState<number | 'mixed'>(60)
  
  const handleSubmit = () => {
    onComplete(sessionCount, typeof duration === 'number' ? duration : 60)
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-lg">
      <div className="text-center mb-8">
        <Target className="h-16 w-16 mx-auto mb-4 text-brutal-yellow" />
        <h2 className="text-3xl font-black uppercase mb-2">Daily Commitment</h2>
        <p className="text-sm opacity-60">First session of the day - set your intention</p>
      </div>
      
      <div className="space-y-6">
        {/* Session Count */}
        <div>
          <label className="block text-sm font-bold uppercase mb-3">
            How many sessions today?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={sessionCount}
              onChange={(e) => setSessionCount(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-2xl font-bold text-center">{sessionCount}</span>
          </div>
        </div>
        
        {/* Duration */}
        <div>
          <label className="block text-sm font-bold uppercase mb-3">
            Session Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[25, 60, 90, 'mixed' as const].map(dur => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`
                  p-3 border-4 border-black font-bold uppercase text-sm
                  ${duration === dur ? 'bg-brutal-yellow shadow-brutal' : 'bg-white hover:shadow-brutal'}
                `}
              >
                {dur === 'mixed' ? 'Mixed' : `${dur}min`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="p-4 bg-brutal-yellow/20 border-2 border-black">
          <p className="font-bold text-center">
            {sessionCount} sessions × {duration === 'mixed' ? 'varied' : `${duration}min`}
          </p>
          {typeof duration === 'number' && (
            <p className="text-xs text-center mt-1 opacity-60">
              Total: {sessionCount * duration} minutes
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Set Commitment
          </Button>
          
          <Button
            onClick={onSkip}
            variant="ghost"
            className="w-full"
          >
            No commitment today
          </Button>
        </div>
        
        <p className="text-xs text-center opacity-40">
          This commitment resets at midnight
        </p>
      </div>
    </div>
  )
}