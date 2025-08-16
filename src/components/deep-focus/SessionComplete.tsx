import React, { useState } from 'react'
import { CheckCircle, Zap, Coffee, Battery } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'

interface SessionCompleteProps {
  onContinue: () => void
}

export function SessionComplete({ onContinue }: SessionCompleteProps) {
  const { endSession, weeklyXP } = useApp()
  const [energyLevel, setEnergyLevel] = useState<string | null>(null)
  const [qualityRating, setQualityRating] = useState<string | null>(null)
  const [breakDuration, setBreakDuration] = useState<number | null>(null)
  const [step, setStep] = useState<'quality' | 'energy' | 'break'>('quality')
  
  const handleComplete = () => {
    endSession(qualityRating || undefined, energyLevel || undefined)
    onContinue()
  }
  
  if (step === 'quality') {
    return (
      <div className="container mx-auto px-6 py-8 max-w-lg text-center">
        <CheckCircle className="h-16 w-16 mx-auto mb-6 text-brutal-green" />
        <h2 className="text-3xl font-black uppercase mb-2">Session Complete!</h2>
        <p className="text-xl mb-8">60 minutes done ✓</p>
        
        <div className="space-y-4 mb-8">
          <h3 className="font-bold uppercase">How was that session?</h3>
          {['excellent', 'good', 'average', 'challenging', 'bad'].map(rating => (
            <button
              key={rating}
              onClick={() => {
                setQualityRating(rating)
                setStep('energy')
              }}
              className="w-full p-3 border-4 border-black bg-white hover:bg-brutal-yellow hover:shadow-brutal transition-all font-bold uppercase"
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    )
  }
  
  if (step === 'energy') {
    return (
      <div className="container mx-auto px-6 py-8 max-w-lg text-center">
        <Battery className="h-16 w-16 mx-auto mb-6" />
        <h2 className="text-2xl font-black uppercase mb-8">Energy Check</h2>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={() => {
              setEnergyLevel('fired_up')
              setStep('break')
            }}
            className="w-full p-4 border-4 border-black bg-white hover:bg-brutal-yellow hover:shadow-brutal transition-all"
          >
            <span className="text-2xl mb-2">🔥</span>
            <p className="font-bold uppercase">Still Fired Up</p>
          </button>
          
          <button
            onClick={() => {
              setEnergyLevel('need_break')
              setStep('break')
            }}
            className="w-full p-4 border-4 border-black bg-white hover:bg-brutal-yellow hover:shadow-brutal transition-all"
          >
            <span className="text-2xl mb-2">☕</span>
            <p className="font-bold uppercase">Need That Break</p>
          </button>
          
          <button
            onClick={() => {
              setEnergyLevel('spent')
              setStep('break')
            }}
            className="w-full p-4 border-4 border-black bg-white hover:bg-brutal-yellow hover:shadow-brutal transition-all"
          >
            <span className="text-2xl mb-2">🥱</span>
            <p className="font-bold uppercase">Totally Spent</p>
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-6 py-8 max-w-lg text-center">
      <Coffee className="h-16 w-16 mx-auto mb-6" />
      <h2 className="text-2xl font-black uppercase mb-2">Time for your reward</h2>
      <p className="mb-8 opacity-60">Take a break?</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[5, 10, 15].map(duration => (
          <button
            key={duration}
            onClick={() => setBreakDuration(duration)}
            className={`
              p-4 border-4 border-black font-bold
              ${breakDuration === duration ? 'bg-brutal-yellow shadow-brutal' : 'bg-white hover:shadow-brutal'}
            `}
          >
            {duration} MIN
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        <Button
          onClick={handleComplete}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {breakDuration ? `Start ${breakDuration} Min Break` : 'Continue Without Break'}
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-brutal-yellow/20 border-2 border-black">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          <span className="font-mono font-bold">+47 XP</span>
        </div>
        <p className="text-xs mt-1 opacity-60">
          Weekly Total: {weeklyXP} XP
        </p>
      </div>
    </div>
  )
}