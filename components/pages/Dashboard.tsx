'use client'

import { motion } from 'framer-motion'

interface DashboardProps {
  onNavigate: (page: any) => void
  contracts?: any[]
  entries?: any[]
}

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

export default function Dashboard({ onNavigate, contracts = [], entries = [] }: DashboardProps) {
  // Calculate total earnings all time
  const totalEarningsAllTime = entries.reduce((sum, entry) => {
    const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
    return sum + amount
  }, 0)

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8"
      >
        <h1 className="text-4xl font-light">Work</h1>
      </motion.div>
      <motion.p variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-20 left-0 right-0 md:left-20 bg-dark px-4 md:px-8 text-cream/60 font-mono text-sm mb-8 pt-0 z-39"
      >
        {dateString} • ${totalEarningsAllTime.toFixed(2)} earned
      </motion.p>

      <div className="pt-32 md:pt-32 pb-24 md:pb-8">
        <motion.div
          className="px-4 md:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Active Contracts Section */}
          {contracts.length > 0 && (
            <div className="mb-12">
              <motion.h2 variants={itemVariants} className="text-2xl font-light mb-6">
                Active Contracts
              </motion.h2>
              {contracts.map((contract) => (
                <motion.div
                  key={`${contract.id}-${contract.url}`}
                  className="relative"
                  variants={itemVariants}
                  layout
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ backgroundColor: '#2a2820' }}
                  />
                  <div
                    className="flex items-start justify-between py-3 cursor-pointer hover:bg-dark/50 transition-colors"
                    onClick={() => onNavigate('contracts')}
                  >
                    <div className="flex-1">
                      <p className="font-light text-lg">{contract.client}</p>
                      <p className="text-cream/60 font-mono text-xs">{contract.rate}</p>
                      <p className="text-cream/40 font-mono text-xs mt-1">{contract.startDate} → {contract.endDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-mint font-sans font-medium text-lg">{contract.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recent Time Entries Section */}
          {entries.length > 0 && (
            <div>
              <motion.h2 variants={itemVariants} className="text-2xl font-light mb-6">
                Hours Tracked
              </motion.h2>
              {entries.slice(0, 5).map((entry) => (
                <motion.div
                  key={entry.id}
                  className="relative"
                  variants={itemVariants}
                  layout
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ backgroundColor: '#2a2820' }}
                  />
                  <div
                    className="flex items-start justify-between py-3 cursor-pointer hover:bg-dark/50 transition-colors"
                    onClick={() => onNavigate('time')}
                  >
                    <div className="flex-1">
                      <p className="font-light text-lg">{entry.contract}</p>
                      <p className="text-cream/60 font-mono text-xs">{entry.rate}</p>
                      <p className="text-cream/40 font-mono text-xs mt-1">{entry.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-mint font-sans font-medium text-lg">{entry.earnings}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {entries.length > 5 && (
                <motion.button
                  variants={itemVariants}
                  onClick={() => onNavigate('time')}
                  className="mt-4 px-4 py-2 text-coral hover:text-coral/80 font-mono text-sm transition-colors"
                >
                  View all entries →
                </motion.button>
              )}
            </div>
          )}

          {/* Empty State */}
          {contracts.length === 0 && entries.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-12 flex items-center justify-center min-h-[100dvh] -mt-[100px]">
              
              <button
                onClick={() => onNavigate('contracts')}
                className="mt-4 text-coral hover:text-coral/80 font-mono text-sm transition-colors"
              >
                Create a contract →
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
