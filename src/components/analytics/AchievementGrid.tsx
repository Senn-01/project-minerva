import React from 'react'
import { Achievement } from '@/types'
import { Trophy, Lock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AchievementGridProps {
  achievements: Achievement[]
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  // Mock some locked achievements for display
  const allAchievements = [
    ...achievements,
    {
      id: 999,
      type: 'consistency' as const,
      name: 'Iron Will',
      description: '21 consecutive days',
      pointsValue: 500,
      icon: '🏆',
      unlockedAt: undefined,
      userId: 1
    },
    {
      id: 998,
      type: 'difficulty_champion' as const,
      name: 'Balls of Steel Legend',
      description: '25 highest difficulty sessions',
      pointsValue: 750,
      icon: '⚪',
      unlockedAt: undefined,
      userId: 1
    }
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allAchievements.map(achievement => (
        <div
          key={achievement.id}
          className={cn(
            "p-4 border-4 border-black relative",
            achievement.unlockedAt 
              ? "bg-brutal-yellow shadow-brutal" 
              : "bg-gray-100 opacity-60"
          )}
        >
          <div className="text-center">
            {achievement.unlockedAt ? (
              <>
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold uppercase text-xs">{achievement.name}</h4>
                <p className="text-xs mt-1 opacity-60">{achievement.pointsValue} XP</p>
              </>
            ) : (
              <>
                <Lock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <h4 className="font-bold uppercase text-xs">???</h4>
                <p className="text-xs mt-1 opacity-40">Locked</p>
              </>
            )}
          </div>
          
          {achievement.unlockedAt && (
            <Trophy className="absolute top-2 right-2 h-4 w-4" />
          )}
        </div>
      ))}
    </div>
  )
}