import React, { useState } from 'react'
import { Plus, Archive, CheckSquare } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { ProjectScatterPlot } from '@/components/strategic-map/ProjectScatterPlot'
import { ProjectForm } from '@/components/strategic-map/ProjectForm'
import { TriageModal } from '@/components/strategic-map/TriageModal'
import { ParkingLotModal } from '@/components/strategic-map/ParkingLotModal'

export function StrategicMap() {
  const { captureItems, projects, showTriage, setShowTriage } = useApp()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showParkingLot, setShowParkingLot] = useState(false)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  
  const untriaged = captureItems.filter(item => !item.triagedAt)
  
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black uppercase">Strategic Map</h2>
        
        <div className="flex items-center gap-4">
          {/* Add Project Button */}
          <Button
            onClick={() => setShowProjectForm(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </Button>
          
          {/* Parking Lot Button */}
          <Button
            onClick={() => setShowParkingLot(true)}
            className="flex items-center gap-2"
          >
            <Archive className="h-5 w-5" />
            Parking Lot
            {projects.filter(p => p.status === 'parking_lot').length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded">
                {projects.filter(p => p.status === 'parking_lot').length}
              </span>
            )}
          </Button>
          
          {/* Triage Button */}
          {untriaged.length > 0 && (
            <Button
              onClick={() => setShowTriage(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <CheckSquare className="h-5 w-5" />
              Triage ({untriaged.length})
            </Button>
          )}
        </div>
      </div>
      
      {/* Scatter Plot */}
      <div className="strategic-map">
        <ProjectScatterPlot
          projects={projects.filter(p => ['active', 'inactive'].includes(p.status))}
          onProjectClick={setEditingProject}
        />
      </div>
      
      {/* Modals */}
      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          editingId={editingProject}
        />
      )}
      
      {showTriage && untriaged.length > 0 && (
        <TriageModal
          captureItem={untriaged[0]}
          onClose={() => setShowTriage(false)}
        />
      )}
      
      {showParkingLot && (
        <ParkingLotModal
          onClose={() => setShowParkingLot(false)}
        />
      )}
    </div>
  )
}