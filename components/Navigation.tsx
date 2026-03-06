'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import {
  LayersIcon,
  FileTextIcon,
  TimerIcon,
  GearIcon,
  BackpackIcon,
} from '@radix-ui/react-icons'

interface NavigationProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs'
  onNavigate: (page: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs') => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'jobs', label: 'Jobs', Icon: BackpackIcon },
    { id: 'dashboard', label: 'Dashboard', Icon: LayersIcon },
    { id: 'contracts', label: 'Contracts', Icon: FileTextIcon },
    { id: 'time', label: 'Time', Icon: TimerIcon },
    { id: 'settings', label: 'Settings', Icon: GearIcon },
  ] as const

  const activeIndex = navItems.findIndex(item => item.id === currentPage)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [borderDims, setBorderDims] = useState({ top: 0, height: 48, left: 0, width: 100 })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex]
    if (activeButton) {
      if (isDesktop) {
        setBorderDims({
          top: activeButton.offsetTop,
          height: activeButton.offsetHeight,
          left: 0,
          width: 4,
        })
      } else {
        setBorderDims({
          top: activeButton.offsetTop - 3,
          height: 3,
          left: activeButton.offsetLeft + activeButton.offsetWidth / 2 - 8,
          width: 16,
        })
      }
    }
  }, [activeIndex, isDesktop])

  return (
    <>
      <div className="fixed bottom-0 md:hidden left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-50" />
      <nav className="fixed bottom-0 left-0 right-0 md:fixed md:left-auto md:right-auto md:bottom-auto md:top-0 md:w-20 md:h-screen bg-surface flex md:flex-col items-center justify-around md:justify-start gap-0 md:gap-4 px-0 py-8 md:px-3 md:py-8 z-50">
        {/* Animated active border - top on mobile, left on desktop */}
        <motion.div
          className="absolute bg-black z-10"
          animate={{
            top: borderDims.top,
            height: borderDims.height,
            left: borderDims.left,
            width: borderDims.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />

        {navItems.map(({ id, label, Icon }, idx) => (
          <button
            key={id}
            ref={(el) => {
              buttonRefs.current[idx] = el
            }}
            onClick={() => onNavigate(id as any)}
            className={`flex flex-col items-center gap-1 p-3 transition-colors relative z-10 ${
              currentPage === id
                ? 'bg-coral text-dark'
                : 'text-cream hover:bg-border'
            }`}
            title={label}
            aria-label={label}
          >
            <Icon width={24} height={24} />
          </button>
        ))}
      </nav>
    </>
  )
}
