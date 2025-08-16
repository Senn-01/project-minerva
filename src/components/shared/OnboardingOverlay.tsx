import React from 'react'
import { useOnboarding } from '@/context/OnboardingContext'
import { cn } from '@/lib/utils/cn'

export function OnboardingOverlay() {
  const { isActive, currentStep, completeStep, skipOnboarding } = useOnboarding()
  
  if (!isActive || currentStep === 'complete') return null
  
  const steps = {
    capture: {
      title: 'The Capture System',
      message: `This is your cognitive relief valve - a GTD-inspired capture system that's always present on every page. Dump any thought, idea, or task here instantly (CMD+C for quick access). You'll triage these later when you have time, keeping your mind clear for deep work.`,
      checkboxLabel: 'Got it, my second brain',
      highlightSelector: '.capture-bar',
    },
    project: {
      title: 'Your Strategic Map',
      message: `Your projects visualized by cost (effort) vs benefit (impact). Add real projects you're working on - that client deadline, the side app you're building, or personal goals. The quadrants help you see at a glance what deserves your focus. Triage your captured items here when ready.`,
      checkboxLabel: 'I see how this works',
      highlightSelector: '.strategic-map',
    },
    focus: {
      title: 'Deep Focus Sessions',
      message: `This is where real work happens. Pick an active project, check your willpower level (be honest!), and dive into distraction-free focus. No pause button - we're building discipline here. Complete sessions earn XP based on difficulty.`,
      checkboxLabel: 'Ready to focus',
      highlightSelector: '.focus-nav',
    },
  }
  
  const currentStepData = steps[currentStep as keyof typeof steps]
  if (!currentStepData) return null
  
  const stepIndex = Object.keys(steps).indexOf(currentStep)
  
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Skip button */}
      <button
        onClick={skipOnboarding}
        className="absolute top-4 right-4 z-[102] text-white underline hover:no-underline"
      >
        Skip Tutorial
      </button>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute z-[101] max-w-md",
        "bg-white border-4 border-black shadow-brutal p-6",
        "animate-bounce-subtle",
        currentStep === 'capture' && "top-24 left-1/2 -translate-x-1/2",
        currentStep === 'project' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        currentStep === 'focus' && "bottom-32 right-24"
      )}>
        <h3 className="text-lg font-black uppercase mb-4">{currentStepData.title}</h3>
        <p className="text-sm mb-6">{currentStepData.message}</p>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                completeStep()
              }
            }}
            className="w-5 h-5 border-2 border-black"
          />
          <span className="font-bold">{currentStepData.checkboxLabel}</span>
        </label>
      </div>
      
      {/* Progress dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[101] flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full",
              i === stepIndex ? "bg-brutal-yellow" : "bg-gray-400"
            )}
          />
        ))}
      </div>
    </div>
  )
}