'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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

interface SettingsProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate?: (page: any) => void
}

export default function Settings({ currentPage, onNavigate }: SettingsProps) {
  const [showNav, setShowNav] = useState(false)
  const [enabledSources, setEnabledSources] = useState({
    'Greenhouse': true,
    'Y Combinator': true,
    'ArbeitsNow': true,
    'Job Boards': true,
  })

  const jobSources = [
    { name: 'Greenhouse' },
    { name: 'Y Combinator' },
    { name: 'ArbeitsNow' },
    { name: 'Job Boards' },
  ]

  const toggleSource = (name: string) => {
    setEnabledSources(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }))
  }

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-4 flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Settings</h1>
        <button
          onClick={() => setShowNav(!showNav)}
          className="text-cream hover:text-coral transition-colors md:hidden"
          aria-label="Toggle navigation"
        >
          <HamburgerMenuIcon width={22} height={22} />
        </button>
      </motion.div>

      <NavPanel
        isOpen={showNav}
        onClose={() => setShowNav(false)}
        currentPage={currentPage}
        onNavigate={onNavigate || (() => {})}
      />

      <div className="px-4 md:px-8 py-4 pt-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h2 variants={itemVariants}
            className="text-xl font-light mb-4"
          >
            About
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="bg-surface pl-0 pr-0 py-4"
          >
            <p className="text-sm text-cream/70 leading-relaxed">
              Remote tech jobs are everywhere but nowhere. This free (always will be) app removes the noise and pulls them together so you're not hunting across 10 different boards. Find opportunities from Y Combinator, Greenhouse, and more in one place. Be free, work from anywhere.
            </p>
          </motion.div>

          <motion.h2 variants={itemVariants}
            className="text-xl font-light mb-4 mt-12 pt-8 border-t border-border"
          >
            Job Sources
          </motion.h2>

          {jobSources.map((source) => (
            <motion.div
              key={source.name}
              variants={itemVariants}
              className={`bg-surface pl-0 pr-0 py-2 flex items-center justify-between`}
            >
              <span className="font-mono text-sm">{source.name}</span>
              <button
                onClick={() => toggleSource(source.name)}
                className={`w-10 h-6 rounded-full transition-all ${
                  enabledSources[source.name as keyof typeof enabledSources]
                    ? 'bg-mint'
                    : 'bg-cream/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-dark transition-transform ${
                  enabledSources[source.name as keyof typeof enabledSources]
                    ? 'translate-x-4'
                    : 'translate-x-0'
                }`} />
              </button>
            </motion.div>
          ))}

          <motion.h2 variants={itemVariants}
            className="text-xl font-light mb-4 mt-12 pt-8 border-t border-border"
          >
            Support
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="bg-surface pl-0 pr-0 py-4 flex items-center justify-between"
          >
            <a
              href="https://www.linkedin.com/in/latenights/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-cream/70 hover:text-cream transition-colors"
            >
              Buy Alex a coffee
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
