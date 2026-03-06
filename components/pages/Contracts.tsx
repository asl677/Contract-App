'use client'

import { motion } from 'framer-motion'
import { CheckIcon, ClockIcon } from '@radix-ui/react-icons'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

interface ContractsProps {
  onNavigate: (page: any) => void
  contracts?: any[]
  onDeleteContract?: (id: number) => void
  onTrackTime?: (contractId: number) => void
}

export default function Contracts({ onNavigate, contracts = [], onDeleteContract, onTrackTime }: ContractsProps) {

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Contracts</h1>
        {contracts.length > 0 && (
          <button onClick={() => onNavigate('contracts')} className="bg-coral text-dark px-6 py-3 font-mono text-sm flex items-center gap-2 hover:bg-coral/90">
            + New Contract
          </button>
        )}
      </motion.div>

      <div className="px-4 md:px-8 pt-24">

      {contracts.length === 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex items-center justify-center min-h-[100dvh] -mt-[100px]">
          <motion.div variants={itemVariants}>
            <button
              onClick={() => onNavigate('contracts')}
              className="bg-coral text-dark px-8 py-3 font-mono font-medium hover:bg-coral/90"
            >
              Create one
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-0">
          {contracts.map((contract) => (
            <motion.div
              key={contract.id}
              variants={itemVariants}
              className="bg-surface pl-0 pr-6 py-6 border-t border-border transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-light mb-1">{contract.client}</h3>
                  <p className="text-cream/60 font-mono text-sm">{contract.rate}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
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
              <div className="flex items-center justify-between">
                <p className="text-cream/50 font-mono text-xs">Started {contract.startDate}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onTrackTime?.(contract.id)}
                    className="text-mint hover:text-mint/80 font-mono text-xs transition-colors"
                  >
                    Track
                  </button>
                  <button
                    onClick={() => onDeleteContract?.(contract.id)}
                    className="text-coral hover:text-coral/80 font-mono text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      </div>
    </div>
  )
}
