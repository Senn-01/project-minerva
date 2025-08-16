import React from 'react'
import { X, Star, Archive } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'

interface ParkingLotModalProps {
  onClose: () => void
}

export function ParkingLotModal({ onClose }: ParkingLotModalProps) {
  const { projects, updateProject } = useApp()
  const parkingLotProjects = projects.filter(p => p.status === 'parking_lot')
  
  const handleActivate = (id: number) => {
    updateProject(id, { status: 'active' })
  }
  
  const handleMakeInactive = (id: number) => {
    updateProject(id, { status: 'inactive' })
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white border-4 border-black shadow-brutal">
        <div className="sticky top-0 bg-white border-b-4 border-black p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Archive className="h-6 w-6" />
              <h3 className="text-2xl font-black uppercase">Parking Lot</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brutal-yellow">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm mt-2 opacity-60">
            Someday/maybe projects - not active but not abandoned
          </p>
        </div>
        
        <div className="p-6">
          {parkingLotProjects.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <Archive className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold uppercase">No projects in parking lot</p>
              <p className="text-sm mt-2">
                Move inactive projects here to declutter your map
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {parkingLotProjects.map(project => (
                <div
                  key={project.id}
                  className="p-4 border-4 border-black bg-white hover:shadow-brutal transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold uppercase">{project.title}</h4>
                      {project.description && (
                        <p className="text-sm mt-1 opacity-80">{project.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span>C:{project.cost}</span>
                      <span>B:{project.benefit}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 font-bold uppercase">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 font-bold uppercase">
                        {project.priority.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleActivate(project.id!)}
                        size="sm"
                        variant="primary"
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3" />
                        Activate
                      </Button>
                      <Button
                        onClick={() => handleMakeInactive(project.id!)}
                        size="sm"
                        variant="default"
                      >
                        Make Inactive
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}