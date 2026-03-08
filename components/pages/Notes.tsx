'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import NavPanel from '@/components/NavPanel'

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
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

interface NotesProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate?: (page: any) => void
}

export default function Notes({ currentPage, onNavigate }: NotesProps) {
  const [text, setText] = useState('')
  const [showNav, setShowNav] = useState(false)

  const convertHyphensToBullets = (str: string) => {
    return str.replace(/- /g, '• ')
  }

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      try {
        // Try to parse as JSON (old format)
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed[0]?.text) {
          setText(convertHyphensToBullets(parsed[0].text))
        }
      } catch {
        // If not JSON, treat as plain text (new format)
        setText(convertHyphensToBullets(saved))
      }
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('notes', text)
  }, [text])

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-[22px] flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Notes</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setText('')}
            className="text-cream hover:text-coral transition-colors"
            aria-label="Clear notes"
          >
            Clear
          </button>
          <button
            onClick={() => setShowNav(!showNav)}
            className="text-cream hover:text-coral transition-colors md:hidden"
            aria-label="Toggle navigation"
          >
            <HamburgerMenuIcon width={22} height={22} />
          </button>
        </div>
      </motion.div>

      <NavPanel
        isOpen={showNav}
        onClose={() => setShowNav(false)}
        currentPage={currentPage}
        onNavigate={onNavigate || (() => {})}
      />

      <div className="px-4 md:px-8 py-4 pt-[80px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col min-h-[calc(100svh-120px)] bg-dark text-cream pb-24 md:pb-8"
        >
          {/* Textarea */}
          <motion.div variants={itemVariants} className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing..."
              className="resize-none focus:outline-none focus:ring-0 scrollbar-hide w-full"
              data-gramm="false"
              style={{
                fontFamily: 'inherit',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '0px',
                height: 'calc(100svh - 130px)',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
