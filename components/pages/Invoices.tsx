'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { UploadIcon, CheckIcon } from '@radix-ui/react-icons'

interface InvoicesProps {
  onNavigate: (page: any) => void
}

const mockInvoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: '$2,150', status: 'paid', date: '2024-03-01' },
  { id: 'INV-002', client: 'Zenith Design', amount: '$3,420', status: 'pending', date: '2024-03-05' },
  { id: 'INV-003', client: 'Nexus Tech', amount: '$1,980', status: 'draft', date: '2024-03-10' },
]

export default function Invoices(_: InvoicesProps) {
  useEffect(() => {
    const elements = document.querySelectorAll('.invoice-item')
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
        <h1 className="text-4xl font-light">Invoices</h1>
        <button className="bg-coral text-dark px-6 py-3 rounded-lg font-mono text-sm flex items-center gap-2 hover:bg-coral/90">
          <UploadIcon width={16} height={16} />
          Generate
        </button>
      </div>

      <div className="space-y-4">
        {mockInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="invoice-item bg-surface rounded-lg p-6 border border-border hover:border-coral/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-sm text-cream/60 mb-1">{invoice.id}</p>
                <h3 className="text-xl font-light mb-2">{invoice.client}</h3>
                <p className="text-cream/50 font-mono text-xs">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono text-mint mb-2">{invoice.amount}</p>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-xs px-3 py-1 rounded ${
                    invoice.status === 'paid'
                      ? 'bg-mint/20 text-mint'
                      : invoice.status === 'pending'
                      ? 'bg-coral/20 text-coral'
                      : 'bg-border text-cream/60'
                  }`}
                >
                  {invoice.status === 'paid' && <CheckIcon width={12} height={12} />}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
