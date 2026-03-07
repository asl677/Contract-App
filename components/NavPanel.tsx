'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-110%' }}
            animate={{ x: 0 }}
            exit={{ x: '-110%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 w-80 bg-white md:bg-dark z-50 overflow-y-auto border-r border-cream/10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white md:bg-dark px-6 py-4 flex items-center justify-between border-b border-cream/10">
              <h2 className="text-lg font-light text-dark md:text-cream">Menu</h2>
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
              {navItems.map(({ id, label, Icon }) => (
                <motion.button
                  key={id}
                  onClick={() => handleNavClick(id as any)}
                  className={`w-full px-6 py-3 flex items-center gap-3 transition-colors ${
                    currentPage === id
                      ? 'bg-coral text-dark'
                      : 'text-dark md:text-cream hover:bg-black/5 md:hover:bg-cream/10'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
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
