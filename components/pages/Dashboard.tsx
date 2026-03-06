'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

interface DashboardProps {
  onNavigate: (page: any) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  useEffect(() => {
    const elements = document.querySelectorAll('.dashboard-item')
    gsap.from(elements, {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, [])

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="dashboard-item mb-12">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">Freelancer Pro</h1>
        <p className="text-cream/60">Manage contracts, time, and payments professionally</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="dashboard-item bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-light mb-4">Active Contracts</h2>
          <p className="text-4xl font-mono text-mint mb-4">3</p>
          <button
            onClick={() => onNavigate('contracts')}
            className="flex items-center gap-2 text-coral hover:text-coral/80 font-mono text-sm"
          >
            View Contracts →
          </button>
        </div>

        <div className="dashboard-item bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-light mb-4">This Week</h2>
          <p className="text-4xl font-mono text-mint mb-4">24h</p>
          <button
            onClick={() => onNavigate('time')}
            className="flex items-center gap-2 text-coral hover:text-coral/80 font-mono text-sm"
          >
            Track Time
          </button>
        </div>

        <div className="dashboard-item bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-light mb-4">Pending Invoices</h2>
          <p className="text-4xl font-mono text-coral mb-4">2</p>
          <button
            onClick={() => onNavigate('invoices')}
            className="flex items-center gap-2 text-mint hover:text-mint/80 font-mono text-sm"
          >
            Send Invoice
          </button>
        </div>

        <div className="dashboard-item bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-2xl font-light mb-4">Account Balance</h2>
          <p className="text-4xl font-mono text-mint mb-4">$3,240</p>
          <button
            onClick={() => onNavigate('payments')}
            className="flex items-center gap-2 text-coral hover:text-coral/80 font-mono text-sm"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="dashboard-item bg-surface rounded-lg p-6 border border-border">
        <h3 className="text-xl font-light mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('contracts')}
            className="bg-dark rounded-lg p-4 text-center hover:bg-border transition-colors"
          >
            <p className="text-sm font-mono text-mint">New Contract</p>
          </button>
          <button
            onClick={() => onNavigate('time')}
            className="bg-dark rounded-lg p-4 text-center hover:bg-border transition-colors"
          >
            <p className="text-sm font-mono text-mint">Start Timer</p>
          </button>
          <button
            onClick={() => onNavigate('invoices')}
            className="bg-dark rounded-lg p-4 text-center hover:bg-border transition-colors"
          >
            <p className="text-sm font-mono text-coral">Create Invoice</p>
          </button>
          <button
            onClick={() => onNavigate('payments')}
            className="bg-dark rounded-lg p-4 text-center hover:bg-border transition-colors"
          >
            <p className="text-sm font-mono text-mint">Withdraw Funds</p>
          </button>
        </div>
      </div>
    </div>
  )
}
