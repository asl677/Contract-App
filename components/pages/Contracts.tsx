'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { CheckIcon, ClockIcon } from '@radix-ui/react-icons'

interface ContractsProps {
  onNavigate: (page: any) => void
}

const mockContracts = [
  { id: 1, client: 'Acme Corp', rate: '$95/hr', status: 'active', startDate: '2024-01-15' },
  { id: 2, client: 'Zenith Design', rate: '$120/hr', status: 'active', startDate: '2024-02-01' },
  { id: 3, client: 'Nexus Tech', rate: '$110/hr', status: 'pending', startDate: '2024-03-01' },
]

export default function Contracts({ onNavigate }: ContractsProps) {
  useEffect(() => {
    const elements = document.querySelectorAll('.contract-item')
    gsap.from(elements, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-light">Contracts</h1>
        <button className="bg-coral text-dark px-6 py-3 rounded-lg font-mono text-sm flex items-center gap-2 hover:bg-coral/90">
          + New Contract
        </button>
      </div>

      <div className="space-y-4">
        {mockContracts.map((contract) => (
          <div
            key={contract.id}
            className="contract-item bg-surface rounded-lg p-6 border border-border hover:border-coral/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-light mb-1">{contract.client}</h3>
                <p className="text-cream/60 font-mono text-sm">{contract.rate}</p>
              </div>
              <div className="flex items-center gap-2">
                {contract.status === 'active' ? (
                  <div className="flex items-center gap-1 text-mint">
                    <CheckIcon width={16} height={16} />
                    <span className="font-mono text-xs">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-coral">
                    <ClockIcon width={16} height={16} />
                    <span className="font-mono text-xs">Pending</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-cream/50 font-mono text-xs">Started {contract.startDate}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-surface rounded-lg p-8 border border-border text-center">
        <p className="text-cream/60 mb-6">Want to create a new contract?</p>
        <button
          onClick={() => onNavigate('contracts')}
          className="bg-coral text-dark px-8 py-3 rounded-lg font-mono font-medium hover:bg-coral/90"
        >
          Start New Contract
        </button>
      </div>
    </div>
  )
}
