'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

interface SettingsProps {
  onNavigate: (page: any) => void
  onClearEntries?: () => void
}

export default function Settings({ onNavigate, onClearEntries }: SettingsProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClear = () => {
    localStorage.removeItem('timeEntries')
    onClearEntries?.()
    setShowConfirm(false)
  }

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Settings
      </motion.h1>

      <div className="px-4 md:px-8 py-4">
        <motion.div variants={itemVariants} initial="hidden" animate="visible"
          className="bg-surface pl-0 pr-0 py-0 mb-2"
        >
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-4 py-3 text-left text-coral hover:bg-dark/50 transition-colors font-mono text-sm"
          >
            Clear all time entries
          </button>
        </motion.div>

        {showConfirm && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible"
            className="bg-surface pl-0 pr-0 py-0 mb-2"
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
      </div>
    </div>
  )
}
