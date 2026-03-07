'use client'

import { motion } from 'framer-motion'

interface DashboardProps {
  onNavigate: (page: any) => void
  totalTimeThisWeek?: string
  contracts?: any[]
  entries?: any[]
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
    transition: { duration: 0.4 },
  },
}

export default function Dashboard({ onNavigate, totalTimeThisWeek = '0h', contracts = [], entries = [] }: DashboardProps) {
  // Calculate total earnings all time
  const totalEarningsAllTime = entries.reduce((sum, entry) => {
    const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
    return sum + amount
  }, 0)

  const items = [
    { id: 'contracts', title: 'Active Contracts', value: String(contracts.length), action: 'View Contracts →' },
    { id: 'time', title: 'Hours Tracked', value: totalTimeThisWeek, action: 'Track' },
  ]

  const today = new Date()
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 md:py-8 pb-12 md:pb-8 flex md:flex-row flex-col items-start md:items-center justify-between gap-6 md:gap-0"
      >
        <h1 className="text-4xl font-light">Work</h1>
        <div className="mt-8 md:mt-0 mb-4 md:mb-0">
          <p className="text-3xl text-mint font-sans font-medium">${totalEarningsAllTime.toFixed(2)}</p>
        </div>
      </motion.div>
      <motion.p variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-20 left-0 right-0 md:left-20 bg-dark px-4 md:px-8 text-cream/60 font-mono text-sm mb-8 pt-0 z-39"
      >
        {dateString}
      </motion.p>
      <div className="pt-52 md:pt-40 py-8">
      <motion.div className="px-4 md:px-8 grid grid-cols-1 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {items.map((item, idx) => (
          <div key={item.id}>
            {idx === 1 && <div className="border-t border-cream/10 mb-6"></div>}
            <motion.div
              variants={itemVariants}
              className="bg-surface pt-6 pr-6 pb-6"
            >
              <h2 className="text-2xl font-light mb-4">{item.title}</h2>
              <p className="text-6xl text-mint mb-4 font-sans font-medium">{item.value}</p>
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
