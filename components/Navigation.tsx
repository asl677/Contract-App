'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import {
  TimerIcon,
  GearIcon,
  BookmarkIcon,
  BackpackIcon,
  FileTextIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons'

interface NavigationProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate: (page: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes') => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'jobs', label: 'Jobs', Icon: BackpackIcon },
    { id: 'dashboard', label: 'Dashboard', Icon: BookmarkIcon },
    { id: 'contracts', label: 'Contracts', Icon: FileTextIcon },
    { id: 'time', label: 'Time', Icon: TimerIcon },
    { id: 'notes', label: 'Notes', Icon: Pencil2Icon },
    { id: 'settings', label: 'Settings', Icon: GearIcon },
  ] as const

  const activeIndex = navItems.findIndex(item => item.id === currentPage)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [borderDims, setBorderDims] = useState({ top: 0, height: 48, left: 0, width: 100 })
  const [isDesktop, setIsDesktop] = useState(false)
  const [showBorder, setShowBorder] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Detect Safari browser
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsSafari(isSafariBrowser)
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
          top: activeButton.offsetTop - 15,
          height: 3,
          left: 0,
          width: activeButton.offsetLeft + activeButton.offsetWidth / 2,
        })
      }
    }
  }, [activeIndex, isDesktop])

  useEffect(() => {
    // Fade in the border after page loads
    const timer = setTimeout(() => setShowBorder(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll handler to hide/show nav
    const handleScroll = () => {
      const scrollable = document.querySelector('main')
      if (!scrollable) return

      const currentScrollY = scrollable.scrollTop
      const isScrollingDown = currentScrollY > lastScrollY.current

      if (isScrollingDown && currentScrollY > 50) {
        setNavVisible(false)
      } else {
        setNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    const scrollable = document.querySelector('main')
    if (scrollable) {
      scrollable.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollable.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [])

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 md:fixed md:left-auto md:right-auto md:bottom-auto md:top-0 md:w-20 md:h-screen bg-surface flex md:flex-col items-center justify-around md:justify-start gap-0 md:gap-4 px-0 py-[40px] md:px-3 md:py-[22px] z-50 transition-transform duration-300 hidden md:flex"
        style={{
          transform: navVisible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Animated active border - top on mobile, left on desktop */}
        <motion.div
          className="absolute bg-black z-10"
          animate={{
            top: borderDims.top,
            height: borderDims.height,
            left: borderDims.left,
            width: borderDims.width,
            opacity: showBorder ? 1 : 0,
          }}
          transition={{
            top: { duration: 0.3, ease: 'easeInOut' },
            height: { duration: 0.3, ease: 'easeInOut' },
            left: { duration: 0.3, ease: 'easeInOut' },
            width: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.4, ease: 'easeInOut' },
          }}
          initial={{ opacity: 0 }}
        />

        {navItems.map(({ id, label, Icon }, idx) =>
          isSafari ? (
            <button
              key={id}
              ref={(el) => {
                buttonRefs.current[idx] = el
              }}
              onClick={() => onNavigate(id as any)}
              className={`flex items-center justify-center transition-all duration-200 relative z-10 rounded ${
                currentPage === id
                  ? 'bg-coral text-dark'
                  : 'text-cream hover:bg-white/20'
              }`}
              title={label}
              aria-label={label}
            >
              <Icon width={24} height={24} />
            </button>
          ) : (
            <motion.button
              key={id}
              ref={(el) => {
                buttonRefs.current[idx] = el
              }}
              onClick={() => onNavigate(id as any)}
              className={`flex items-center justify-center transition-all duration-200 relative z-10 rounded ${
                currentPage === id
                  ? 'bg-coral text-dark'
                  : 'text-cream hover:bg-white/20'
              }`}
              title={label}
              aria-label={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: 'easeInOut', delay: idx * 0.05 }}
            >
              <Icon width={24} height={24} />
            </motion.button>
          )
        )}
      </nav>
    </>
  )
}
