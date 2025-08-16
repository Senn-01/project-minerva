import React, { useState } from 'react'
import { FileText, CheckCircle, ExternalLink, Trash2 } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { ProjectForm } from './ProjectForm'
import type { CaptureItem } from '@/types'

interface TriageModalProps {
  captureItem: CaptureItem
  onClose: () => void
}

export function TriageModal({ captureItem, onClose }: TriageModalProps) {
  const { triageCaptureItem, captureItems } = useApp()
  const [showProjectForm, setShowProjectForm] = useState(false)
  
  const untriaged = captureItems.filter(item => !item.triagedAt)
  const currentIndex = untriaged.findIndex(item => item.id === captureItem.id)
  
  const handleDecision = (decision: string) => {
    triageCaptureItem(captureItem.id!, decision)
    
    // Move to next item or close
    if (currentIndex < untriaged.length - 1) {
      // Auto-advance handled by parent
    } else {
      onClose()
    }
  }
  
  if (showProjectForm) {
    return (
      <ProjectForm
        onClose={() => {
          handleDecision('project')
          onClose()
        }}
        initialData={{
          title: captureItem.text,
        }}
      />
    )
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white border-4 border-black shadow-brutal p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black uppercase">Triage Capture</h3>
            <span className="text-sm font-mono opacity-60">
              {currentIndex + 1} of {untriaged.length}
            </span>
          </div>
          
          <div className="p-4 bg-brutal-yellow/20 border-2 border-black">
            <p className="font-mono">{captureItem.text}</p>
            <p className="text-xs mt-2 opacity-60">
              Captured {new Date(captureItem.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => setShowProjectForm(true)}
            className="w-full justify-start gap-3"
            variant="default"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-bold">Promote to Project</div>
              <div className="text-xs opacity-60">Create a new project from this capture</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleDecision('quick_task')}
            className="w-full justify-start gap-3"
            variant="default"
          >
            <CheckCircle className="h-5 w-5" />
            <div className="text-left">
              <div className="font-bold">Less than 2min?</div>
              <div className="text-xs opacity-60">Consider doing it now</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleDecision('routed')}
            className="w-full justify-start gap-3"
            variant="default"
            disabled
          >
            <ExternalLink className="h-5 w-5" />
            <div className="text-left">
              <div className="font-bold">Route Elsewhere</div>
              <div className="text-xs opacity-60">Send to Notion/Todoist/Calendar (Coming Soon)</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleDecision('deleted')}
            className="w-full justify-start gap-3"
            variant="destructive"
          >
            <Trash2 className="h-5 w-5" />
            <div className="text-left">
              <div className="font-bold">Not Relevant</div>
              <div className="text-xs opacity-60">Delete this capture</div>
            </div>
          </Button>
        </div>
        
        <div className="mt-6 pt-4 border-t-2 border-black">
          <Button onClick={onClose} variant="ghost" className="w-full">
            Close Triage
          </Button>
        </div>
      </div>
    </div>
  )
}