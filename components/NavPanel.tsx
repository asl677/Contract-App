'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  TimerIcon,
  GearIcon,
  BookmarkIcon,
  BackpackIcon,
  FileTextIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons'

interface NavPanelProps {
  isOpen: boolean
  onClose: () => void
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate: (page: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes') => void
}

export default function NavPanel({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}: NavPanelProps) {
  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    // Detect Safari to avoid stagger flickering
    const ua = navigator.userAgent.toLowerCase()
    const isSafariDetected = /safari/.test(ua) && !/chrome/.test(ua) && !/edge/.test(ua)
    setIsSafari(isSafariDetected)
  }, [])

  const navItems = [
    { id: 'jobs', label: 'Jobs', Icon: BackpackIcon },
    { id: 'dashboard', label: 'Dashboard', Icon: BookmarkIcon },
    { id: 'contracts', label: 'Contracts', Icon: FileTextIcon },
    { id: 'time', label: 'Time', Icon: TimerIcon },
    { id: 'notes', label: 'Notes', Icon: Pencil2Icon },
    { id: 'settings', label: 'Settings', Icon: GearIcon },
  ] as const

  const handleNavClick = (page: typeof navItems[number]['id']) => {
    onNavigate(page as any)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Panel - Full height on mobile, sidebar on desktop */}
          <motion.div
            initial={{ y: '-110%' }}
            animate={{ y: 0 }}
            exit={{ y: '-110%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 right-0 top-0 h-screen w-full bg-white md:inset-y-0 md:h-auto md:w-80 md:left-0 md:right-auto md:bg-dark z-50 overflow-y-auto border-b md:border-b-0 md:border-r border-cream/10"
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-white md:bg-dark px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="text-dark/50 md:text-cream/50 hover:text-dark md:hover:text-cream transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="py-4 space-y-1">
              {navItems.map(({ id, label, Icon }, idx) => (
                <motion.button
                  key={id}
                  onClick={() => handleNavClick(id as any)}
                  className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
                    currentPage === id
                      ? 'bg-coral text-dark'
                      : 'text-dark md:text-cream hover:bg-black/5 md:hover:bg-cream/10'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: isSafari ? 0 : idx * 0.05 }}
                >
                  <Icon width={20} height={20} />
                  <span className="font-light">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
