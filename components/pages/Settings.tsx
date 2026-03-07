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

export default function Settings() {
  const [enabledSources, setEnabledSources] = useState({
    Lever: true,
    Greenhouse: true,
    Workable: true,
  })

  const jobSources = [
    { name: 'Lever' },
    { name: 'Greenhouse' },
    { name: 'Workable' },
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
        </div>
      </div>
    </div>
  )
}
