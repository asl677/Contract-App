'use client'

import { motion } from 'framer-motion'

interface DashboardProps {
  onNavigate: (page: any) => void
  totalTimeThisWeek?: string
  contracts?: any[]
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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Dashboard({ onNavigate, totalTimeThisWeek = '0h', contracts = [] }: DashboardProps) {
  const items = [
    { id: 'contracts', title: 'Active Contracts', value: String(contracts.length), action: 'View Contracts →' },
    { id: 'time', title: 'This Week', value: totalTimeThisWeek, action: 'Track Time' },
  ]

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Work
      </motion.h1>
      <motion.p variants={itemVariants} initial="hidden" animate="visible"
        className="px-4 md:px-8 text-cream/60 font-mono text-sm mb-8 pt-0"
      >
        {dateString}
      </motion.p>
      <div className="py-8">
      <motion.div className="px-4 md:px-8 grid grid-cols-1 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {items.map((item, idx) => (
          <div key={item.id}>
            {idx === 1 && <div className="border-t border-cream/10 mb-6"></div>}
            <motion.div
              variants={itemVariants}
              className="bg-surface pt-6 pr-6 pb-6"
            >
              <h2 className="text-2xl font-light mb-4">{item.title}</h2>
              <p className={`text-4xl font-mono ${item.valueColor || 'text-mint'} mb-4`}>{item.value}</p>
              <button
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-2 text-coral hover:text-coral/80 font-mono text-sm"
              >
                {item.action}
              </button>
            </motion.div>
          </div>
        ))}
      </motion.div>
      </div>
    </div>
  )
}
