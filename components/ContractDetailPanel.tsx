'use client'

import { motion } from 'framer-motion'
import { TrashIcon, DownloadIcon } from '@radix-ui/react-icons'

interface ContractDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  contract?: {
    id: number
    freelancer: string
    client: string
    rate: string
    startDate: string
    endDate: string
    status: string
  }
  entries?: any[]
  onDelete?: (id: number) => void
  onEmailInvoice?: (id: number) => void
  onDownloadCSV?: (id: number) => void
}

export default function ContractDetailPanel({
  isOpen,
  onClose,
  contract,
  entries = [],
  onDelete,
  onEmailInvoice,
  onDownloadCSV,
}: ContractDetailPanelProps) {
  if (!contract) return null

  const handleDownloadCSV = () => {
    // Filter entries for this contract
    const contractEntries = entries.filter(entry => entry.contract === contract.client)

    // Create CSV content
    const headers = ['Date', 'Duration', 'Rate', 'Earnings']
    const rows = contractEntries.map(entry => [
      new Date().toISOString().split('T')[0], // Date (using today as placeholder since entries don't have dates)
      entry.duration,
      entry.rate,
      entry.earnings
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${contract.client.replace(/\s+/g, '_')}_hours.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Call callback for toast notification
    onDownloadCSV?.(contract.id)
  }

  return (
    <>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isOpen ? 384 : 0 }}
        exit={{ width: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 bg-white border-l border-black flex flex-col h-screen overflow-hidden"
        style={{ width: isOpen ? 384 : 0, zIndex: 9999999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white flex-shrink-0">
          <h2 className="text-2xl font-light text-dark">Contract Details</h2>
          <button
            onClick={onClose}
            className="text-dark/60 hover:text-dark text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto w-96">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Client
            </label>
            <p className="text-lg text-dark font-light">{contract.client}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Freelancer
            </label>
            <p className="text-lg text-dark font-light">{contract.freelancer}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Rate
            </label>
            <p className="text-lg text-dark font-light">{contract.rate}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Start Date
              </label>
              <p className="text-dark font-light">{contract.startDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                End Date
              </label>
              <p className="text-dark font-light">{contract.endDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Status
            </label>
            <p className="text-dark font-light capitalize">{contract.status}</p>
          </div>

          <div className="flex gap-4 text-sm">
            <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-dark/70 hover:text-dark transition-colors">
              Stripe
            </a>
            <a href="https://venmo.com" target="_blank" rel="noopener noreferrer" className="text-dark/70 hover:text-dark transition-colors">
              Venmo
            </a>
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="p-6 space-y-2 bg-white sticky bottom-0">
          <div className="flex flex-col gap-3 text-sm">
            <button
              onClick={handleDownloadCSV}
              className="text-dark hover:text-dark/70 transition-colors flex items-center gap-2 text-left"
            >
              <DownloadIcon width={16} height={16} />
              Download CSV
            </button>
            <button
              onClick={() => {
                onEmailInvoice?.(contract.id)
                onClose()
              }}
              className="text-dark hover:text-dark/70 transition-colors text-left"
            >
              Email Invoice
            </button>
            <button
              onClick={() => {
                onDelete?.(contract.id)
                onClose()
              }}
              className="text-dark hover:text-dark/70 transition-colors flex items-center gap-2 text-left"
            >
              <TrashIcon width={16} height={16} />
              Delete Contract
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
