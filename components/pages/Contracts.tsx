'use client'

import { motion } from 'framer-motion'
import { CheckIcon, ClockIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import ContractDetailPanel from '@/components/ContractDetailPanel'
import CreateContractPanel from '@/components/CreateContractPanel'
import NavPanel from '@/components/NavPanel'
import { useToast } from '@/components/Toast'

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
    transition: { duration: 0.6 },
  },
}

interface ContractsProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate: (page: any) => void
  contracts?: any[]
  entries?: any[]
  onDeleteContract?: (id: number) => void
  onTrackTime?: (contractId: number) => void
}

export default function Contracts({ currentPage, onNavigate, contracts = [], entries = [], onDeleteContract, onTrackTime }: ContractsProps) {
  const { addToast } = useToast()
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const selectedContract = contracts.find(c => c.id === selectedContractId)
  const isPanelOpen = !!selectedContractId || showCreateForm

  return (
    <>
      <ContractDetailPanel
        isOpen={!!selectedContractId}
        contract={selectedContract}
        entries={entries}
        onClose={() => setSelectedContractId(null)}
        onDelete={(id) => {
          onDeleteContract?.(id)
          setSelectedContractId(null)
        }}
        onDownloadCSV={() => {
          addToast('CSV downloaded', 'success')
        }}
      />

      <CreateContractPanel
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        newContract={{ freelancer: '', client: '', rate: '', startDate: '', endDate: '' }}
        onContractChange={() => {}}
        onSave={() => {
          addToast('Contract created', 'success')
          setShowCreateForm(false)
        }}
      />
    <div className="w-full" style={{ marginRight: isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s' }}>
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ marginRight: isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s' }}
      >
        <h1 className="text-4xl font-light">Contracts</h1>
        <div className="flex items-center gap-4">
          {contracts.length > 0 && (
            <button onClick={() => setShowCreateForm(true)} className="bg-coral text-dark px-6 py-3 font-mono text-sm flex items-center gap-2 hover:bg-coral/90">
              + New
            </button>
          )}
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
        onNavigate={onNavigate}
      />

      <div className="px-4 md:px-8 pt-24" style={{ marginRight: isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s' }}>

      {contracts.length === 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex items-center justify-center min-h-[100dvh] -mt-[100px]">
          <motion.div variants={itemVariants}>
            <button
              onClick={() => onNavigate('contracts')}
              className="bg-coral text-dark px-8 py-3 font-mono font-medium hover:bg-coral/90"
            >
              Create one
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-0">
          {contracts.map((contract, idx) => (
            <motion.div
              key={contract.id}
              variants={itemVariants}
              className={`bg-surface pl-0 pr-0 md:pr-6 py-6 transition-colors cursor-pointer ${idx > 0 ? 'border-t border-border' : ''}`}
              onClick={() => setSelectedContractId(contract.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-light mb-1">{contract.client}</h3>
                  <p className="text-cream/60 font-mono text-sm">{contract.rate}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {contract.status === 'active' ? (
                    <div className="flex items-center gap-1 text-mint">
                      <CheckIcon width={16} height={16} />
                      <span className="font-mono text-xs">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-coral">
                      <ClockIcon width={16} height={16} />
                      <span className="font-mono text-xs">Pending</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-cream/50 font-mono text-xs">Started {contract.startDate}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onTrackTime?.(contract.id)}
                    className="text-mint hover:text-mint/80 font-mono text-xs transition-colors"
                  >
                    Track
                  </button>
                  <button
                    onClick={() => onDeleteContract?.(contract.id)}
                    className="text-coral hover:text-coral/80 font-mono text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      </div>
    </div>
    </>
  )
}
