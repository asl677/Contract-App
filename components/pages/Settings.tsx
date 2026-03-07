'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

interface SettingsProps {
  onClearEntries?: () => void
}

export default function Settings({ onClearEntries }: SettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const jobSources = [
    { name: 'LinkedIn', status: 'active' },
    { name: 'AngelList', status: 'active' },
    { name: 'Upwork', status: 'active' },
    { name: 'Contra', status: 'active' },
  ]

  const handleClear = () => {
    localStorage.removeItem('timeEntries')
    onClearEntries?.()
    setShowConfirm(false)
  }

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Settings
      </motion.h1>

      <div className="px-4 md:px-8 py-4 pt-24">
        <motion.div variants={itemVariants} initial="hidden" animate="visible"
          className="bg-surface pl-0 pr-0 py-0 mb-8"
        >
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-3 text-left text-coral hover:bg-dark/50 transition-colors font-mono text-sm"
          >
            Clear all time entries
          </button>
        </motion.div>

        {showConfirm && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible"
            className="bg-surface pl-0 pr-0 py-0 mb-8"
          >
            <div className="px-4 py-3 text-cream text-sm mb-3">
              Are you sure? This cannot be undone.
            </div>
            <div className="flex gap-2 px-4 pb-3">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 bg-coral text-dark hover:bg-coral/90 font-mono text-sm transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-cream/30 text-cream hover:bg-dark/50 font-mono text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        <motion.h2 variants={itemVariants} initial="hidden" animate="visible"
          className="text-xl font-light mb-4"
        >
          Job Sources
        </motion.h2>

        <div className="space-y-0">
          {jobSources.map((source, idx) => (
            <motion.div
              key={source.name}
              variants={itemVariants}
              transition={{ delay: idx * 0.05 + 0.3 }}
              initial="hidden"
              animate="visible"
              className={`bg-surface pl-0 pr-6 py-4 flex items-center justify-between ${idx > 0 ? 'border-t border-border' : ''}`}
            >
              <span className="font-mono text-sm">{source.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-mint rounded-full"></div>
                <span className="text-cream/60 font-mono text-xs uppercase">{source.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
