'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'

interface TimeTrackingProps {
  onNavigate: (page: any) => void
}

export default function TimeTracking(_: TimeTrackingProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const elements = document.querySelectorAll('.time-item')
    gsap.from(elements, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = time % 60

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-light mb-8">Time Tracking</h1>

      <div className="time-item bg-surface rounded-lg p-8 border border-border mb-8 text-center">
        <p className="text-cream/60 font-mono text-sm mb-4">CURRENT SESSION</p>
        <div className="text-6xl font-mono text-mint mb-8 tracking-tight">
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-lg font-mono font-medium flex items-center gap-2 ${
              isRunning
                ? 'bg-coral text-dark hover:bg-coral/90'
                : 'bg-mint text-dark hover:bg-mint/90'
            }`}
          >
            {isRunning ? (
              <>
                <StopIcon width={20} height={20} />
                Stop
              </>
            ) : (
              <>
                <PlayIcon width={20} height={20} />
                Start
              </>
            )}
          </button>
        </div>
      </div>

      <div className="time-item bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-light mb-4">Today's Entries</h2>
        <div className="space-y-3">
          {[
            { contract: 'Acme Corp', duration: '4h 30m', rate: '$95/hr' },
            { contract: 'Zenith Design', duration: '3h 20m', rate: '$120/hr' },
          ].map((entry, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-dark rounded-lg">
              <div>
                <p className="font-light">{entry.contract}</p>
                <p className="text-cream/50 font-mono text-xs">{entry.rate}</p>
              </div>
              <p className="font-mono text-mint">{entry.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
