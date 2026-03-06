'use client'

import { motion } from 'framer-motion'

const inputStyle = `
  input[type="text"],
  input[type="date"] {
    background-color: white !important;
    color: black !important;
  }
  input[type="text"]::placeholder,
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
      <motion.div
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 384 : 0 }}
      exit={{ width: 0 }}
      transition={{ duration: 0.3,  }}
      className="fixed md:relative right-0 top-0 bg-white border-l border-black flex flex-col h-screen overflow-hidden z-40 md:z-auto"
      style={{ width: isOpen ? 384 : 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white flex-shrink-0">
        <h2 className="text-2xl font-light text-dark">New Contract</h2>
        <button
          onClick={onClose}
          className="text-dark/60 hover:text-dark text-2xl transition-colors"
        >
          ×
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto w-96">
        <div className="bg-dark/50 p-4 rounded text-sm text-dark/70 mb-4">
          Payments are handled outside of this app. This contract binding is for legal record-keeping only.
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Freelancer Name
          </label>
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
          <label className="block text-sm font-medium text-dark mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={newContract.client}
            onChange={(e) =>
              onContractChange({ ...newContract, client: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Hourly Rate
          </label>
          <input
            type="text"
            value={newContract.rate}
            onChange={(e) =>
              onContractChange({ ...newContract, rate: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            placeholder="$95/hr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={newContract.startDate}
            onChange={(e) =>
              onContractChange({ ...newContract, startDate: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            End Date
          </label>
          <input
            type="date"
            value={newContract.endDate}
            onChange={(e) =>
              onContractChange({ ...newContract, endDate: e.target.value })
            }
            className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
          />
        </div>
      </div>

      {/* Footer - Buttons */}
      <div className="p-6 space-y-2 bg-white sticky bottom-0">
        <button
          onClick={onSave}
          className="w-full !bg-black !text-white py-3 font-medium hover:opacity-90 transition-colors"
        >
          Save Contract
        </button>
        <button
          onClick={onClose}
          className="w-full bg-white border border-black text-dark py-3 font-medium hover:bg-dark hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
    </>
  )
}
