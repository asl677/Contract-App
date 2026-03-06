'use client'

import { motion } from 'framer-motion'
import { UploadIcon, CheckIcon } from '@radix-ui/react-icons'

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

interface InvoicesProps {
  onNavigate: (page: any) => void
}

export default function Invoices(_: InvoicesProps) {
  const mockInvoices: any[] = []

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8"
      >
        <h1 className="text-4xl font-light">Invoices</h1>
      </motion.div>

      <div className="px-4 md:px-8 py-8">

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {mockInvoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            variants={itemVariants}
            className="bg-surface py-4 px-0 border-t border-border hover:border-t-coral/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-sm text-cream/60 mb-1">{invoice.id}</p>
                <h3 className="text-xl font-light mb-2">{invoice.client}</h3>
                <p className="text-cream/50 font-mono text-xs">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono text-mint mb-2">{invoice.amount}</p>
                <span
                  className={`inline-flex items-center gap-1 font-mono text-xs px-3 py-1 ${
                    invoice.status === 'paid'
                      ? 'bg-mint/20 text-mint'
                      : invoice.status === 'pending'
                      ? 'bg-coral/20 text-coral'
                      : 'bg-border text-cream/60'
                  }`}
                >
                  {invoice.status === 'paid' && <CheckIcon width={12} height={12} />}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </div>
  )
}
