'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { PlayIcon, StopIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import NavPanel from '@/components/NavPanel'
import CustomDropdown from '@/components/CustomDropdown'
import { useToast } from '@/components/Toast'

const AnimatedNumber = ({ value, pad = true }: { value: number; pad?: boolean }) => {
  const motionValue = useMotionValue(value)
  const rounded = useTransform(motionValue, latest => {
    const num = Math.round(latest)
    return pad ? String(num).padStart(2, '0') : String(num)
  })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  return <motion.span>{rounded}</motion.span>
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
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

interface TimeTrackingProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate?: (page: any) => void
  contracts?: any[]
  selectedContractId?: number | null
  onSelectContract?: (id: number | null) => void
  isRunning?: boolean
  time?: number
  onStart?: () => void
  onStop?: () => void
  onSaveEntry?: (entry: any) => void
  onClearEntries?: () => void
  entries?: any[]
}

export default function TimeTracking({ currentPage, onNavigate, contracts = [], selectedContractId = null, onSelectContract, isRunning = false, time = 0, onStart, onStop, onSaveEntry, onClearEntries, entries = [] }: TimeTrackingProps) {
  const { addToast } = useToast()
  const timeRef = useRef(0)
  const [showNav, setShowNav] = useState(false)
  const [isMd, setIsMd] = useState(false)

  useEffect(() => {
    const checkMd = () => setIsMd(window.innerWidth >= 768)
    checkMd()
    window.addEventListener('resize', checkMd)
    return () => window.removeEventListener('resize', checkMd)
  }, [])

  const handleClear = () => {
    localStorage.removeItem('timeEntries')
    onClearEntries?.()
    addToast('Entries cleared', 'success')
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
      <AnimatePresence mode="wait">
        <motion.div
          key="track-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3 }}
          className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-50 px-4 md:px-8 py-4 flex items-center justify-between"
        >
        <h1 className="text-4xl font-light">Track</h1>
        <div className="flex items-center gap-8">
          <p className="text-mint font-sans font-medium text-2xl">
            ${entries.reduce((sum, entry) => {
              const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
              return sum + amount
            }, 0).toFixed(2)}
          </p>
          <button
            onClick={() => setShowNav(!showNav)}
            className="text-cream hover:text-coral transition-colors md:hidden"
            aria-label="Toggle navigation"
          >
            <HamburgerMenuIcon width={22} height={22} />
          </button>
        </div>
        </motion.div>
      </AnimatePresence>

      <NavPanel
        isOpen={showNav}
        onClose={() => setShowNav(false)}
        currentPage={currentPage}
        onNavigate={onNavigate || (() => {})}
      />

      <motion.div
        animate={{ opacity: !isMd && showNav ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: !isMd && showNav ? 'none' : 'auto' }}
      >
        <div className="px-4 md:px-8 py-4 pt-24 overflow-y-auto">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}
              className="flex items-center justify-between mb-4"
            >
              <div className="text-7xl text-mint font-sans font-medium tracking-tight" style={{ flex: 1, fontVariantNumeric: 'tabular-nums' }}>
                <AnimatedNumber value={hours} />:<AnimatedNumber value={minutes} />:<AnimatedNumber value={seconds} />
              </div>
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
                className={`ml-4 ${
                  isRunning
                    ? 'text-coral hover:text-coral/90'
                    : selectedContractId ? 'text-mint hover:text-mint/90' : 'text-cream/30 cursor-not-allowed'
                }`}
              >
                {isRunning ? (
                  <StopIcon width={60} height={60} />
                ) : (
                  <PlayIcon width={60} height={60} />
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants}
              className="bg-surface pl-0 pr-0 py-0 mb-4"
            >
              <CustomDropdown
                value={selectedContractId ? String(selectedContractId) : ''}
                onChange={(value) => onSelectContract?.(value ? Number(value) : null)}
                options={['', ...Array.from(new Set(contracts.map(c => String(c.id))))]}
                displayFormat={(value) => {
                  if (!value) return 'Choose a contract'
                  const contract = contracts.find(c => c.id === Number(value))
                  return contract ? `${contract.client} - ${contract.rate}` : 'Choose a contract'
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}
              className="flex items-center justify-between py-6 mb-2"
            >
              {entries.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-coral hover:text-coral/80 transition-colors font-mono text-sm"
                >
                  Clear
                </button>
              )}
            </motion.div>
          </motion.div>

          {entries.length > 0 ? (
            <motion.div
              key="entries-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {entries.map((entry) => (
              <motion.div
                key={entry.id}
                className="relative overflow-hidden border-t border-border py-3"
                variants={itemVariants}
                layout
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <p className="font-light text-lg">{entry.contract}</p>
                  <p className="text-cream/60 font-mono text-xs">{entry.rate}</p>
                  <p className="text-cream/40 font-mono text-xs mt-1">{entry.duration}</p>
                </motion.div>
              </motion.div>
            ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-entries"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center min-h-[100dvh]"
            >
              <div className="text-cream/40 text-center">
                No entries yet
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
