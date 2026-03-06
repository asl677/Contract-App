'use client'

import { motion } from 'framer-motion'
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@radix-ui/react-icons'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

interface PaymentsProps {
  onNavigate: (page: any) => void
}

export default function Payments(_: PaymentsProps) {

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Payments
      </motion.h1>

      <div className="px-4 md:px-8 py-8">

      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="bg-surface p-8 border-t border-border mb-8"
      >
        <p className="text-cream/60 font-mono text-sm mb-4">ACCOUNT BALANCE</p>
        <p className="text-5xl font-mono text-mint mb-8">$0.00</p>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-coral text-dark px-6 py-3  font-mono text-sm flex items-center justify-center gap-2 hover:bg-coral/90">
            <ArrowUpIcon width={16} height={16} />
            Deposit
          </button>
          <button className="bg-mint text-dark px-6 py-3  font-mono text-sm flex items-center justify-center gap-2 hover:bg-mint/90">
            <ArrowDownIcon width={16} height={16} />
            Withdraw
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="bg-surface p-6 border-t border-border mb-8"
      >
        <h2 className="text-xl font-light mb-6">Deposit Methods</h2>
        <div className="space-y-3">
          <div className="p-4 bg-dark  border border-border flex items-center justify-between">
            <p className="font-light">Visa ending in 4242</p>
            <span className="text-cream/50 font-mono text-xs">Primary</span>
          </div>
          <button className="w-full p-4 bg-dark  border border-border hover:border-coral/50 transition-colors text-coral font-mono text-sm flex items-center justify-center gap-2">
            <PlusIcon width={16} height={16} />
            Add Card
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="bg-surface p-6 border-t border-border"
      >
        <motion.h2 variants={itemVariants} initial="hidden" animate="visible" className="text-xl font-light mb-6">Bank Accounts</motion.h2>
        <div className="space-y-3">
          <div className="p-4 bg-dark  border border-border flex items-center justify-between">
            <p className="font-light">Chase Checking ••••2419</p>
            <span className="text-mint font-mono text-xs">Verified</span>
          </div>
          <button className="w-full p-4 bg-dark  border border-border hover:border-coral/50 transition-colors text-coral font-mono text-sm flex items-center justify-center gap-2">
            <PlusIcon width={16} height={16} />
            Link Account
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
