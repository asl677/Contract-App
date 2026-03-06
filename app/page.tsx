'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Dashboard from '@/components/pages/Dashboard'
import Contracts from '@/components/pages/Contracts'
import TimeTracking from '@/components/pages/TimeTracking'
import Settings from '@/components/pages/Settings'
import Navigation from '@/components/Navigation'
import CreateContractPanel from '@/components/CreateContractPanel'

const pages = ['dashboard', 'contracts', 'time', 'settings'] as const
type PageType = typeof pages[number]

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [showCreateContract, setShowCreateContract] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null)
  const [totalTime, setTotalTime] = useState('0h 0m')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef(0)
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  const [newContract, setNewContract] = useState({ client: '', rate: '', startDate: getTodayDate() })
  const [contracts, setContracts] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

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
    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (!isLeftSwipe && !isRightSwipe) return

    const currentIndex = pages.indexOf(currentPage)
    if (isLeftSwipe && currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1])
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1])
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.changedTouches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEnd.current = e.changedTouches[0].clientX
    handleSwipe()
  }

  useEffect(() => {
    const calculateTotalTime = () => {
      let totalSeconds = 0
      entries.forEach((entry: any) => {
        const match = entry.duration.match(/(\d+)h\s*(\d+)m\s*(\d+)s/)
        if (match) {
          const h = parseInt(match[1]) || 0
          const m = parseInt(match[2]) || 0
          const s = parseInt(match[3]) || 0
          totalSeconds += h * 3600 + m * 60 + s
        }
      })
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      setTotalTime(`${hours}h ${minutes}m ${seconds}s`)
    }
    calculateTotalTime()
  }, [entries])

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
        client: newContract.client,
        rate: newContract.rate,
        startDate: newContract.startDate,
        status: 'active'
      }
      const updated = [...contracts, newContractData]
      setContracts(updated)
      localStorage.setItem('contracts', JSON.stringify(updated))
      setNewContract({ client: '', rate: '', startDate: getTodayDate() })
      setShowCreateContract(false)
    }
  }

  const handleDeleteContract = (id: number) => {
    const updated = contracts.filter((c) => c.id !== id)
    setContracts(updated)
    localStorage.setItem('contracts', JSON.stringify(updated))
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
        <motion.div
          key={`loader-${currentPage}`}
          className="fixed top-0 left-0 right-0 h-1 bg-black z-50"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, originX: 0 }}
          transition={{ duration: 0.3,  }}
        />
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, , delay: 0.3 }}
        >
          {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} totalTimeThisWeek={totalTime} contracts={contracts} />}
          {currentPage === 'contracts' && <Contracts onNavigate={(p) => {
            if (p === 'contracts') setShowCreateContract(true)
            else setCurrentPage(p as PageType)
          }} contracts={contracts} onDeleteContract={handleDeleteContract} onTrackTime={handleTrackTime} />}
          {currentPage === 'time' && <TimeTracking onNavigate={setCurrentPage} contracts={contracts} selectedContractId={selectedContractId} onSelectContract={setSelectedContractId} isRunning={isTimerRunning} time={timerSeconds} onStart={handleStartTimer} onStop={handleStopTimer} onSaveEntry={handleSaveTimeEntry} entries={entries} />}
          {currentPage === 'settings' && <Settings onNavigate={setCurrentPage} onClearEntries={() => { setTotalTime('0h 0m'); setTimerSeconds(0); timerRef.current = 0 }} />}
        </motion.div>
      </main>

        <CreateContractPanel
          isOpen={showCreateContract}
          onClose={() => {
            setShowCreateContract(false)
            setNewContract({ client: '', rate: '', startDate: getTodayDate() })
          }}
          newContract={newContract}
          onContractChange={setNewContract}
          onSave={handleCreateContract}
        />
      </div>
    </div>
  )
}
