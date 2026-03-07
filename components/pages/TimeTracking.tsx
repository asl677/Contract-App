'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon, StopIcon } from '@radix-ui/react-icons'

const selectStyle = `
  select {
    background-color: white !important;
    color: black !important;
  }
  select option {
    background-color: white !important;
    color: black !important;
  }
`

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

interface TimeTrackingProps {
  contracts?: any[]
  selectedContractId?: number | null
  onSelectContract?: (id: number | null) => void
  isRunning?: boolean
  time?: number
  onStart?: () => void
  onStop?: () => void
  onSaveEntry?: (entry: any) => void
  entries?: any[]
}

export default function TimeTracking({ contracts = [], selectedContractId = null, onSelectContract, isRunning = false, time = 0, onStart, onStop, onSaveEntry, entries = [] }: TimeTrackingProps) {
  const timeRef = useRef(0)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClear = () => {
    localStorage.removeItem('timeEntries')
    setShowClearConfirm(false)
  }

  useEffect(() => {
    timeRef.current = time
  }, [time])


  const selectedContract = contracts.find((c) => c.id === selectedContractId)

  const hours = Math.floor(timeRef.current / 3600)
  const minutes = Math.floor((timeRef.current % 3600) / 60)
  const seconds = timeRef.current % 60

  return (
    <div className="w-full">
      <style>{selectStyle}</style>
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Time Tracking</h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-coral hover:text-coral/80 transition-colors font-mono text-sm"
        >
          Clear entries
        </button>
      </motion.div>

      <div className="px-4 md:px-8 py-4 pt-24">
      {showClearConfirm && (
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
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 px-4 py-2 border border-cream/30 text-cream hover:bg-dark/50 font-mono text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-4">
          <div className="text-7xl text-mint font-sans font-medium tracking-tight">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}
          className="bg-surface pl-0 pr-0 py-0 mb-0"
        >
          <label className="block text-left text-dark font-mono text-sm mb-2">SELECT CONTRACT</label>
          <select
            value={selectedContractId || ''}
            onChange={(e) => onSelectContract?.(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-3 border border-black bg-white text-black font-mono text-sm focus:outline-none focus:border-black focus:ring-0"
            style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
          >
            <option value="">Choose a contract</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.client} - {contract.rate}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants}
          className="bg-surface p-4 mb-4 text-center"
        >
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                if (isRunning) {
                  const h = Math.floor(timeRef.current / 3600)
                  const m = Math.floor((timeRef.current % 3600) / 60)
                  const s = timeRef.current % 60
                  const durationStr = `${h}h ${m}m ${s}s`
                  const rateStr = selectedContract?.rate || '$0/hr'
                  const rateNum = parseFloat(rateStr.replace(/[^0-9.]/g, '')) || 0
                  const totalTime = timeRef.current / 3600
                  const earnings = isNaN(rateNum) ? '0.00' : (rateNum * totalTime).toFixed(2)
                  const newEntry = {
                    id: Date.now(),
                    contract: selectedContract?.client || 'Contract',
                    duration: durationStr,
                    rate: rateStr,
                    earnings: `$${earnings}`
                  }
                  onSaveEntry?.(newEntry)
                  onStop?.()
                } else if (selectedContractId) {
                  onStart?.()
                }
              }}
              disabled={!isRunning && !selectedContractId}
              className={`px-8 py-4  font-mono font-medium flex items-center gap-2 ${
                isRunning
                  ? 'bg-coral text-dark hover:bg-coral/90'
                  : selectedContractId ? 'bg-mint text-dark hover:bg-mint/90' : 'bg-cream/30 text-dark cursor-not-allowed'
              }`}
            >
              {isRunning ? (
                <>
                  <StopIcon width={20} height={20} />
                  Stop
                </>
              ) : (
                <>
                  <PlayIcon width={20} height={20} />
                  Start
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="border-t border-cream/10 my-4"></motion.div>

        <motion.div variants={itemVariants}
          className="bg-surface pl-0 pr-0 py-0"
        >
          <h2 className="text-left text-xl font-light mb-4">Today's Entries</h2>
        </motion.div>

        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            variants={itemVariants}
            className="flex items-center justify-between bg-dark border-t border-cream/10 py-3"
          >
            <div>
              <p className="font-light">{entry.contract}</p>
              <p className="text-cream/50 font-mono text-xs">{entry.rate}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-mint">{entry.earnings}</p>
              <p className="text-cream/50 font-mono text-xs">{entry.duration}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </div>
  )
}
