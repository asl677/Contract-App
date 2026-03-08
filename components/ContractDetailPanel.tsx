'use client'

import { motion, AnimatePresence } from 'framer-motion'

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

  // Calculate total hours tracked for this contract
  const contractEntries = entries.filter(entry => entry.contract === contract.client)
  const totalSeconds = contractEntries.reduce((sum, entry) => {
    const match = entry.duration.match(/(\d+)h\s*(\d+)m\s*(\d+)s/)
    if (match) {
      const h = parseInt(match[1]) || 0
      const m = parseInt(match[2]) || 0
      const s = parseInt(match[3]) || 0
      return sum + h * 3600 + m * 60 + s
    }
    return sum
  }, 0)

  const totalHours = Math.floor(totalSeconds / 3600)
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
  const totalSecs = totalSeconds % 60
  const totalEarnings = contractEntries.reduce((sum, entry) => {
    const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
    return sum + amount
  }, 0)

  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Duration', 'Rate', 'Earnings']
    const rows = contractEntries.map(entry => [
      new Date().toISOString().split('T')[0], // Date (using today as placeholder since entries don't have dates)
      entry.duration,
      contract.rate,
      entry.earnings || '$0.00'
    ])

    // Add summary row
    rows.push(['', `${totalHours}h ${totalMinutes}m ${totalSecs}s`, 'Total', `$${totalEarnings.toFixed(2)}`])

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '110%' }}
          animate={{ x: 0 }}
          exit={{ x: '110%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:w-96 md:h-screen bg-white flex flex-col md:border-l md:border-black z-50 overflow-y-auto"
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
        <div className="flex-1 p-6 space-y-4 overflow-y-auto w-full md:w-96 pb-24">
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

          <div className="border-t border-black/10 pt-4 mt-4">
            <label className="block text-sm font-medium text-dark mb-2">
              Hours Tracked
            </label>
            <p className="text-2xl font-light text-dark mb-3">
              {totalHours}h {totalMinutes}m {totalSecs}s
            </p>
            <div className="text-sm text-dark/70">
              <p>Entries: {contractEntries.length}</p>
              <p>Total Earnings: <span className="font-medium text-dark">${totalEarnings.toFixed(2)}</span></p>
            </div>
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
              className="text-dark hover:text-dark/70 transition-colors text-left"
            >
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
              className="text-dark hover:text-dark/70 transition-colors text-left"
            >
              Delete Contract
            </button>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  )
}
