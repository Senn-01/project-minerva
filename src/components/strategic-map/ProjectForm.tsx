import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { ProjectCategory, ProjectPriority, ProjectStatus } from '@/types'

interface ProjectFormProps {
  onClose: () => void
  editingId?: number | null
  initialData?: any
}

export function ProjectForm({ onClose, editingId, initialData }: ProjectFormProps) {
  const { addProject, updateProject, projects } = useApp()
  const editingProject = editingId ? projects.find(p => p.id === editingId) : null
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: 5,
    benefit: 5,
    priority: 'should_do' as ProjectPriority,
    status: 'active' as ProjectStatus,
    category: 'projects' as ProjectCategory,
    dueDate: '',
    ...editingProject,
    ...initialData
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId && editingProject) {
      updateProject(editingId, formData)
    } else {
      addProject(formData)
    }
    
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white border-4 border-black shadow-brutal p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black uppercase">
            {editingId ? 'Edit Project' : 'New Project'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-brutal-yellow">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full brutal-input"
              placeholder="e.g., Launch new feature"
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase mb-2">
              Description / Link
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full brutal-input min-h-[80px] resize-none"
              placeholder="Brief description or relevant links..."
            />
          </div>
          
          {/* Cost & Benefit */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Cost (Effort) *
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span>Quick Win</span>
                  <span className="font-bold text-lg">{formData.cost}</span>
                  <span>Major Effort</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Benefit (Impact) *
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.benefit}
                  onChange={(e) => setFormData({ ...formData, benefit: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span>Minor</span>
                  <span className="font-bold text-lg">{formData.benefit}</span>
                  <span>Game-Changer</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['work', 'growth', 'projects', 'life'] as ProjectCategory[]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`
                      p-2 border-2 border-black font-bold uppercase text-sm
                      ${formData.category === cat ? 'bg-brutal-yellow' : 'bg-white hover:bg-gray-100'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Priority *
              </label>
              <div className="space-y-2">
                {([
                  { value: 'must_do', label: 'Must-Do' },
                  { value: 'should_do', label: 'Should-Do' },
                  { value: 'nice_to_have', label: 'Nice-to-Have' }
                ] as { value: ProjectPriority, label: string }[]).map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={opt.value}
                      checked={formData.priority === opt.value}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as ProjectPriority })}
                      className="w-4 h-4"
                    />
                    <span className="font-bold">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Status & Due Date */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full brutal-input"
              >
                <option value="active">Active (This Week)</option>
                <option value="inactive">Inactive</option>
                <option value="parking_lot">Parking Lot</option>
                {editingId && (
                  <>
                    <option value="completed">Completed</option>
                    <option value="graveyard">Graveyard</option>
                  </>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full brutal-input"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t-2 border-black">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}