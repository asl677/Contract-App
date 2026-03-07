'use client'

import { motion } from 'framer-motion'
import { TrashIcon } from '@radix-ui/react-icons'

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
  onDelete?: (id: number) => void
  onEmailInvoice?: (id: number) => void
}

export default function ContractDetailPanel({
  isOpen,
  onClose,
  contract,
  onDelete,
  onEmailInvoice,
}: ContractDetailPanelProps) {
  if (!contract) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.5 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black z-40 pointer-events-none"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-96 bg-white flex flex-col z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-light text-dark">Contract Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Client
            </label>
            <p className="text-lg text-dark font-light">{contract.client}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Freelancer
            </label>
            <p className="text-lg text-dark font-light">{contract.freelancer}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rate
            </label>
            <p className="text-lg text-dark font-light">{contract.rate}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <p className="text-dark font-light">{contract.startDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End Date
              </label>
              <p className="text-dark font-light">{contract.endDate}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <p className="text-dark font-light capitalize">{contract.status}</p>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="p-6 space-y-2 bg-white border-t border-gray-200">
          <button
            onClick={() => {
              onEmailInvoice?.(contract.id)
              onClose()
            }}
            className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            Email Invoice
          </button>
          <button
            onClick={() => {
              onDelete?.(contract.id)
              onClose()
            }}
            className="w-full bg-red-50 text-red-600 py-3 rounded font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <TrashIcon width={16} height={16} />
            Delete Contract
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </>
  )
}
