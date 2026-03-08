'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HamburgerMenuIcon, PlusIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'
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
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  const month = date.toLocaleString('en-US', { month: 'long' })
  const day = date.getDate()
  const year = date.getFullYear()
  const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10) !== 10 ? day % 10 : 0]
  return `${month} ${day}${suffix} ${year}`
}

interface ContractsProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate: (page: any) => void
  contracts?: any[]
  entries?: any[]
  onTrackTime?: (contractId: number) => void
}

export default function Contracts({ currentPage, onNavigate, contracts: passedContracts = [], entries = [], onTrackTime }: ContractsProps) {
  const { addToast } = useToast()
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  const [expandedContractId, setExpandedContractId] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [isMd, setIsMd] = useState(false)
  const [newContract, setNewContract] = useState({ freelancer: '', client: '', rate: '$200/hr', startDate: getTodayDate(), endDate: getTodayDate() })
  const [contracts, setContracts] = useState(passedContracts)
  const isPanelOpen = showCreateForm

  // Load contracts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('contracts')
    if (saved) {
      setContracts(JSON.parse(saved))
    }
  }, [])

  // Save contracts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contracts', JSON.stringify(contracts))
  }, [contracts])

  useEffect(() => {
    const checkMd = () => setIsMd(window.innerWidth >= 768)
    checkMd()
    window.addEventListener('resize', checkMd)
    return () => window.removeEventListener('resize', checkMd)
  }, [])

  const handleSaveContract = () => {
    if (!newContract.client || !newContract.freelancer || !newContract.rate) {
      addToast('Please fill in all fields', 'error')
      return
    }

    const contract = {
      id: Date.now(),
      freelancer: newContract.freelancer,
      client: newContract.client,
      rate: newContract.rate,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      status: 'active'
    }

    setContracts([...contracts, contract])
    addToast('Contract created', 'success')
    setShowCreateForm(false)
    setNewContract({ freelancer: '', client: '', rate: '$200/hr', startDate: getTodayDate(), endDate: getTodayDate() })
  }

  const handleDeleteContract = (contractId: number) => {
    setContracts(contracts.filter(c => c.id !== contractId))
    addToast('Contract deleted', 'success')
  }

  const handleDownloadCSV = (contractId: number) => {
    const contract = contracts.find(c => c.id === contractId)
    if (!contract) return

    // Calculate totals for this contract
    const contractEntries = entries.filter(entry => entry.contract === contract.client)
    const totalSeconds = contractEntries.reduce((sum, entry) => {
      const match = entry.duration.match(/(\d+)h\s*(\d+)m\s*(\d+)s/)
      if (match) {
        const h = parseInt(match[1]) || 0
        const m = parseInt(match[2]) || 0
        const s = parseInt(match[3]) || 0
        return sum + h * 3600 + m * 60 + s
      }
      return sum
    }, 0)

    const totalHours = Math.floor(totalSeconds / 3600)
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
    const totalSecs = totalSeconds % 60
    const totalEarnings = contractEntries.reduce((sum, entry) => {
      const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
      return sum + amount
    }, 0)

    // Create CSV content
    const headers = ['Date', 'Duration', 'Rate', 'Earnings']
    const rows = contractEntries.map(entry => [
      new Date().toISOString().split('T')[0],
      entry.duration,
      contract.rate,
      entry.earnings || '$0.00'
    ])

    rows.push(['', `${totalHours}h ${totalMinutes}m ${totalSecs}s`, 'Total', `$${totalEarnings.toFixed(2)}`])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${contract.client.replace(/\s+/g, '_')}_hours.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast('CSV downloaded', 'success')
  }

  return (
    <>
      <CreateContractPanel
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false)
          setNewContract({ freelancer: '', client: '', rate: '$200/hr', startDate: getTodayDate(), endDate: getTodayDate() })
        }}
        newContract={newContract}
        onContractChange={setNewContract}
        onSave={handleSaveContract}
      />
    <div className="w-full" style={{ marginRight: isMd && isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key="contracts-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-4 flex items-center justify-between"
          style={{ marginRight: isMd && isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s' }}
        >
        <h1 className="text-4xl font-light">Contracts</h1>
        <div className="flex items-center gap-4">
          {contracts.length > 0 && (
            <button onClick={() => setShowCreateForm(true)} className="bg-coral text-dark p-3 flex items-center justify-center hover:bg-coral/90">
              <PlusIcon width={20} height={20} />
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
      </AnimatePresence>

      <NavPanel
        isOpen={showNav}
        onClose={() => setShowNav(false)}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <motion.div
        animate={{ opacity: !isMd && showNav ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: !isMd && showNav ? 'none' : 'auto', marginRight: isMd && isPanelOpen ? 384 : 0, transition: 'margin-right 0.3s, opacity 0.2s' }}
      >
        <div className="px-4 md:px-8 pt-24">

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
          <AnimatePresence mode="wait">
            {contracts.map((contract) => {
              const isExpanded = expandedContractId === contract.id
              const contractEntries = entries.filter(entry => entry.contract === contract.client)
              const totalSeconds = contractEntries.reduce((sum, entry) => {
                const match = entry.duration.match(/(\d+)h\s*(\d+)m\s*(\d+)s/)
                if (match) {
                  const h = parseInt(match[1]) || 0
                  const m = parseInt(match[2]) || 0
                  const s = parseInt(match[3]) || 0
                  return sum + h * 3600 + m * 60 + s
                }
                return sum
              }, 0)
              const totalHours = Math.floor(totalSeconds / 3600)
              const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
              const totalSecs = totalSeconds % 60
              const totalEarnings = contractEntries.reduce((sum, entry) => {
                const amount = parseFloat(entry.earnings?.replace('$', '') || '0')
                return sum + amount
              }, 0)

              return (
                <motion.div
                  key={contract.id}
                  className="relative overflow-hidden border-t border-border py-3"
                  variants={itemVariants}
                  layout
                  exit={{ height: 0, transition: { duration: 0.4 } }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    onClick={() => setExpandedContractId(isExpanded ? null : contract.id)}
                    className="cursor-pointer"
                  >
                    <p className="font-light text-lg">{contract.client}</p>
                    <p className="text-cream/60 font-mono text-sm">{contract.rate}</p>
                    <p className="text-cream/40 font-mono text-xs mt-1">{formatDate(contract.startDate)} to {formatDate(contract.endDate)}</p>
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-6 mb-4 py-4 pt-4">
                          <div className="space-y-3">
                            <div>
                              <p className="text-cream/50 font-mono text-xs mb-1">Freelancer</p>
                              <p className="text-cream font-light text-sm">{contract.freelancer}</p>
                            </div>
                            <div>
                              <p className="text-cream/50 font-mono text-xs mb-1">Status</p>
                              <p className="text-cream font-light text-sm capitalize">{contract.status}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-cream/50 font-mono text-xs mb-1">Hours Tracked</p>
                              <p className="text-cream font-light text-sm">{totalHours}h {totalMinutes}m {totalSecs}s</p>
                            </div>
                            <div>
                              <p className="text-cream/50 font-mono text-xs mb-1">Entries</p>
                              <p className="text-cream font-light text-sm">{contractEntries.length}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-cream/50 font-mono text-xs mb-1">Total Earnings</p>
                              <p className="text-cream font-light text-sm">${totalEarnings.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:flex-row gap-4 text-sm pb-4">
                          <button onClick={() => handleDownloadCSV(contract.id)} className="text-cream/70 hover:text-cream transition-colors">Download CSV</button>
                          <button onClick={() => { const invoiceUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invoice/${contract.id}`; navigator.clipboard.writeText(invoiceUrl); addToast('Invoice link copied', 'success'); }} className="text-cream/70 hover:text-cream transition-colors">Copy Invoice Link</button>
                          <button onClick={() => addToast('Invoice sent', 'success')} className="text-cream/70 hover:text-cream transition-colors">Email Invoice</button>
                          <button onClick={(e) => { e.stopPropagation(); onTrackTime?.(contract.id); }} className="text-mint hover:text-mint/80 transition-colors">Track</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteContract(contract.id); }} className="text-coral hover:text-coral/80 transition-colors">Delete</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
        </div>
      </motion.div>
    </div>
    </>
  )
}
