'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StopIcon } from '@radix-ui/react-icons'
import Dashboard from '@/components/pages/Dashboard'
import Contracts from '@/components/pages/Contracts'
import TimeTracking from '@/components/pages/TimeTracking'
import Settings from '@/components/pages/Settings'
import Jobs from '@/components/pages/Jobs'
import Notes from '@/components/pages/Notes'
import Navigation from '@/components/Navigation'
import CreateContractPanel from '@/components/CreateContractPanel'
import { ToastProvider, useToast } from '@/components/Toast'

const pages = ['dashboard', 'contracts', 'jobs', 'time', 'notes', 'settings'] as const
type PageType = typeof pages[number]

function HomeContent() {
  const { addToast } = useToast()
  const [currentPage, setCurrentPage] = useState<PageType>('jobs')
  const [showCreateContract, setShowCreateContract] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef(0)
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  const [newContract, setNewContract] = useState({ freelancer: '', client: '', rate: '', startDate: getTodayDate(), endDate: getTodayDate() })
  const [contracts, setContracts] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const touchStart = useRef({ x: 0, y: 0 })
  const touchEnd = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('contracts')
    if (saved) {
      setContracts(JSON.parse(saved))
    }
    const savedEntries = localStorage.getItem('timeEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const handleSwipe = () => {
    if (!touchStart.current || !touchEnd.current) return
    const horizontalDistance = touchStart.current.x - touchEnd.current.x
    const verticalDistance = Math.abs(touchStart.current.y - touchEnd.current.y)

    // Only register as swipe if horizontal movement is greater than vertical (not a scroll)
    if (Math.abs(horizontalDistance) <= 50 || verticalDistance > Math.abs(horizontalDistance)) return

    const isLeftSwipe = horizontalDistance > 50
    const isRightSwipe = horizontalDistance < -50

    const currentIndex = pages.indexOf(currentPage)
    if (isLeftSwipe && currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1])
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1])
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEnd.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }
    handleSwipe()
  }


  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    main.addEventListener('touchstart', handleTouchStart as EventListener)
    main.addEventListener('touchend', handleTouchEnd as EventListener)
    return () => {
      main.removeEventListener('touchstart', handleTouchStart as EventListener)
      main.removeEventListener('touchend', handleTouchEnd as EventListener)
    }
  }, [currentPage])

  useEffect(() => {
    setShowCreateContract(false)
  }, [currentPage])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((t) => {
          const newTime = t + 1
          timerRef.current = newTime
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const handleCreateContract = () => {
    if (newContract.client && newContract.rate) {
      const newContractData = {
        id: Date.now(),
        freelancer: newContract.freelancer,
        client: newContract.client,
        rate: newContract.rate,
        startDate: newContract.startDate,
        endDate: newContract.endDate,
        status: 'active'
      }
      const updated = [...contracts, newContractData]
      setContracts(updated)
      localStorage.setItem('contracts', JSON.stringify(updated))
      setNewContract({ freelancer: '', client: '', rate: '', startDate: getTodayDate(), endDate: getTodayDate() })
      setShowCreateContract(false)
      addToast(`Contract created: ${newContract.client}`, 'success')
    }
  }

  const handleDeleteContract = (id: number) => {
    const contract = contracts.find(c => c.id === id)
    const updated = contracts.filter((c) => c.id !== id)
    setContracts(updated)
    localStorage.setItem('contracts', JSON.stringify(updated))
    if (contract) {
      addToast(`Contract deleted: ${contract.client}`, 'success')
    }
  }

  const handleTrackTime = (contractId: number) => {
    setSelectedContractId(contractId)
    setCurrentPage('time')
  }

  const handleSaveTimeEntry = (entry: any) => {
    setEntries([entry, ...entries])
    localStorage.setItem('timeEntries', JSON.stringify([entry, ...entries]))
    setTimerSeconds(0)
    timerRef.current = 0
    setIsTimerRunning(false)
  }

  const handleStartTimer = () => {
    setIsTimerRunning(true)
  }

  const handleStopTimer = () => {
    setIsTimerRunning(false)
  }


  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-dark text-cream">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative md:pl-20">
        <AnimatePresence>
          {isTimerRunning && (
            <motion.div
              className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white border border-black px-4 py-3 text-dark text-sm font-medium font-mono uppercase flex items-center gap-3">
                {formatTimerDisplay(timerSeconds)}
                <button
                  onClick={handleStopTimer}
                  className="text-dark hover:text-dark/60 transition-colors ml-2"
                  aria-label="Stop timer"
                >
                  <StopIcon width={18} height={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} contracts={contracts} entries={entries} />}
          {currentPage === 'contracts' && <Contracts onNavigate={(p) => {
            if (p === 'contracts') setShowCreateContract(true)
            else setCurrentPage(p as PageType)
          }} contracts={contracts} entries={entries} onDeleteContract={handleDeleteContract} onTrackTime={handleTrackTime} />}
          {currentPage === 'jobs' && <Jobs />}
          {currentPage === 'time' && <TimeTracking contracts={contracts} selectedContractId={selectedContractId} onSelectContract={setSelectedContractId} isRunning={isTimerRunning} time={timerSeconds} onStart={handleStartTimer} onStop={handleStopTimer} onSaveEntry={handleSaveTimeEntry} entries={entries} />}
          {currentPage === 'notes' && <Notes />}
          {currentPage === 'settings' && <Settings />}
        </motion.div>
      </main>

        <CreateContractPanel
          isOpen={showCreateContract}
          onClose={() => {
            setShowCreateContract(false)
            setNewContract({ freelancer: '', client: '', rate: '', startDate: getTodayDate(), endDate: getTodayDate() })
          }}
          newContract={newContract}
          onContractChange={setNewContract}
          onSave={handleCreateContract}
        />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  )
}
