import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type OnboardingStep = 'capture' | 'project' | 'focus' | 'complete'

interface OnboardingContextType {
  isActive: boolean
  currentStep: OnboardingStep
  hasSkipped: boolean
  completeStep: () => void
  skipOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_KEYS = {
  COMPLETE: 'fa_onboarding_complete',
  CURRENT_STEP: 'fa_onboarding_step',
  SKIPPED: 'fa_onboarding_skipped',
  STARTED_AT: 'fa_onboarding_started',
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('capture')
  const [hasSkipped, setHasSkipped] = useState(false)
  
  // Check onboarding status on mount
  useEffect(() => {
    const isComplete = localStorage.getItem(ONBOARDING_KEYS.COMPLETE) === 'true'
    const savedStep = localStorage.getItem(ONBOARDING_KEYS.CURRENT_STEP) as OnboardingStep
    const skipped = localStorage.getItem(ONBOARDING_KEYS.SKIPPED) === 'true'
    
    if (!isComplete && !skipped) {
      setIsActive(true)
      if (savedStep) {
        setCurrentStep(savedStep)
      }
      if (!localStorage.getItem(ONBOARDING_KEYS.STARTED_AT)) {
        localStorage.setItem(ONBOARDING_KEYS.STARTED_AT, new Date().toISOString())
      }
    }
    
    setHasSkipped(skipped)
  }, [])
  
  const completeStep = () => {
    const steps: OnboardingStep[] = ['capture', 'project', 'focus', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      setCurrentStep(nextStep)
      localStorage.setItem(ONBOARDING_KEYS.CURRENT_STEP, nextStep)
      
      if (nextStep === 'complete') {
        completeOnboarding()
      }
    }
  }
  
  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEYS.COMPLETE, 'true')
    localStorage.removeItem(ONBOARDING_KEYS.CURRENT_STEP)
    setIsActive(false)
  }
  
  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEYS.COMPLETE, 'true')
    localStorage.setItem(ONBOARDING_KEYS.SKIPPED, 'true')
    localStorage.removeItem(ONBOARDING_KEYS.CURRENT_STEP)
    setIsActive(false)
    setHasSkipped(true)
  }
  
  const resetOnboarding = () => {
    // For development/testing
    localStorage.removeItem(ONBOARDING_KEYS.COMPLETE)
    localStorage.removeItem(ONBOARDING_KEYS.CURRENT_STEP)
    localStorage.removeItem(ONBOARDING_KEYS.SKIPPED)
    localStorage.removeItem(ONBOARDING_KEYS.STARTED_AT)
    setIsActive(true)
    setCurrentStep('capture')
    setHasSkipped(false)
  }
  
  const value: OnboardingContextType = {
    isActive,
    currentStep,
    hasSkipped,
    completeStep,
    skipOnboarding,
    resetOnboarding,
  }
  
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}