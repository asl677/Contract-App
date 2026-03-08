'use client'

import { motion, AnimatePresence } from 'framer-motion'

const inputStyle = `
  input[type="text"],
  input[type="email"],
  input[type="date"] {
    background-color: white !important;
    color: black !important;
  }
  input[type="text"]::placeholder,
  input[type="email"]::placeholder,
  input[type="date"]::placeholder {
    color: black !important;
    opacity: 0.6 !important;
  }
`

interface CreateContractPanelProps {
  isOpen: boolean
  onClose: () => void
  newContract: { freelancer: string; client: string; rate: string; startDate: string; endDate: string }
  onContractChange: (contract: { freelancer: string; client: string; rate: string; startDate: string; endDate: string }) => void
  onSave: () => void
}

const handleRateChange = (value: string, onContractChange: Function, newContract: any) => {
  // Extract just the number part and ensure "hr" is always at the end
  const numberPart = value.replace(/[^\d./]/g, '')
  onContractChange({ ...newContract, rate: numberPart ? `$${numberPart}/hr` : '$200/hr' })
}

export default function CreateContractPanel({
  isOpen,
  onClose,
  newContract,
  onContractChange,
  onSave,
}: CreateContractPanelProps) {
  return (
    <>
      <style>{inputStyle}</style>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="create-contract"
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 min-h-dvh md:inset-auto md:top-0 md:right-0 md:w-96 md:h-screen bg-white md:bg-dark z-50 overflow-y-auto md:border-l md:border-black flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white md:bg-dark px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-light text-dark md:text-cream">New Contract</h2>
              <button
                onClick={onClose}
                className="text-dark/50 md:text-cream/50 hover:text-dark md:hover:text-cream transition-colors"
                aria-label="Close contract panel"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-32">
        <div className="text-sm text-dark/60 leading-relaxed">
          Payments are handled outside of this app. This contract binding is for legal record-keeping only.
        </div>
        <div className="flex gap-4 text-sm">
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-dark hover:text-dark/70 transition-colors">
            Stripe
          </a>
          <a href="https://venmo.com" target="_blank" rel="noopener noreferrer" className="text-dark hover:text-dark/70 transition-colors">
            Venmo
          </a>
        </div>
        <div>
          <input
            type="text"
            value={newContract.freelancer}
            onChange={(e) =>
              onContractChange({ ...newContract, freelancer: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            placeholder="Your name"
          />
        </div>

        <div>
          <input
            type="email"
            value={newContract.client}
            onChange={(e) =>
              onContractChange({ ...newContract, client: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            placeholder="client@email.com"
          />
        </div>

        <div>
          <input
            type="text"
            value={newContract.rate}
            onChange={(e) =>
              handleRateChange(e.target.value, onContractChange, newContract)
            }
            className="w-full px-4 py-3 border border-black text-sm transition-colors focus:outline-none focus:border-black focus:ring-0 font-mono"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            placeholder="$200/hr"
          />
        </div>

        <div>
          <input
            type="date"
            value={newContract.startDate}
            onChange={(e) =>
              onContractChange({ ...newContract, startDate: e.target.value })
            }
            className="w-full px-4 py-3 border border-black text-sm transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
          />
        </div>

        <div>
          <input
            type="date"
            value={newContract.endDate}
            onChange={(e) =>
              onContractChange({ ...newContract, endDate: e.target.value })
            }
            className="w-full px-4 py-3 border border-black text-sm transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
          />
        </div>

              {/* Buttons - Fixed at bottom */}
              <div className="fixed bottom-5 left-0 right-0 md:left-auto md:w-96 flex gap-2 px-6">
                <button
                  onClick={onSave}
                  className="flex-1 bg-black text-white py-3 font-medium hover:opacity-90 transition-colors"
                >
                  Save Contract
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-white md:bg-surface border border-black md:border-cream/10 text-dark md:text-cream py-3 font-medium hover:bg-dark md:hover:bg-dark/80 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
