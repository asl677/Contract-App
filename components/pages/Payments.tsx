'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'

interface PaymentsProps {
  onNavigate: (page: any) => void
}

export default function Payments(_: PaymentsProps) {
  useEffect(() => {
    const elements = document.querySelectorAll('.payment-item')
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
      <h1 className="text-4xl font-light mb-8">Payments</h1>

      <div className="payment-item bg-surface rounded-lg p-8 border border-border mb-8">
        <p className="text-cream/60 font-mono text-sm mb-4">ACCOUNT BALANCE</p>
        <p className="text-5xl font-mono text-mint mb-8">$3,240.50</p>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-coral text-dark px-6 py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 hover:bg-coral/90">
            <ArrowUpIcon width={16} height={16} />
            Deposit
          </button>
          <button className="bg-mint text-dark px-6 py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 hover:bg-mint/90">
            <ArrowDownIcon width={16} height={16} />
            Withdraw
          </button>
        </div>
      </div>

      <div className="payment-item bg-surface rounded-lg p-6 border border-border mb-8">
        <h2 className="text-xl font-light mb-6">Deposit Methods</h2>
        <div className="space-y-3">
          <div className="p-4 bg-dark rounded-lg border border-border flex items-center justify-between">
            <p className="font-light">Visa ending in 4242</p>
            <span className="text-cream/50 font-mono text-xs">Primary</span>
          </div>
          <button className="w-full p-4 bg-dark rounded-lg border border-border hover:border-coral/50 transition-colors text-coral font-mono text-sm flex items-center justify-center gap-2">
            <PlusIcon width={16} height={16} />
            Add Card
          </button>
        </div>
      </div>

      <div className="payment-item bg-surface rounded-lg p-6 border border-border">
        <h2 className="text-xl font-light mb-6">Bank Accounts</h2>
        <div className="space-y-3">
          <div className="p-4 bg-dark rounded-lg border border-border flex items-center justify-between">
            <p className="font-light">Chase Checking ••••2419</p>
            <span className="text-mint font-mono text-xs">Verified</span>
          </div>
          <button className="w-full p-4 bg-dark rounded-lg border border-border hover:border-coral/50 transition-colors text-coral font-mono text-sm flex items-center justify-center gap-2">
            <PlusIcon width={16} height={16} />
            Link Account
          </button>
        </div>
      </div>
    </div>
  )
}
