'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

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

export default function Settings() {
  const [enabledSources, setEnabledSources] = useState({
    Lever: true,
    Greenhouse: true,
    Workable: true,
    'Y Combinator': true,
  })

  const jobSources = [
    { name: 'Lever' },
    { name: 'Greenhouse' },
    { name: 'Workable' },
    { name: 'Y Combinator' },
  ]

  const toggleSource = (name: string) => {
    setEnabledSources(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }))
  }

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Settings
      </motion.h1>

      <div className="px-4 md:px-8 py-4 pt-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h2 variants={itemVariants}
            className="text-xl font-light mb-4"
          >
            Job Sources
          </motion.h2>

          {jobSources.map((source) => (
            <motion.div
              key={source.name}
              variants={itemVariants}
              className={`bg-surface pl-0 pr-0 py-4 flex items-center justify-between border-t border-border`}
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
            className="bg-surface pl-0 pr-0 py-4 flex items-center justify-between border-t border-border"
          >
            <a
              href="https://linkedin.com/in/alexlakas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/70 hover:text-cream transition-colors text-sm"
            >
              Buy Alex a coffee
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
