'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomDropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  displayFormat?: (value: string) => string
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  displayFormat = (v) => v
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    setIsSafari(isSafariBrowser)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-black text-black text-left transition-all duration-200"
      >
        <span>{displayFormat(value)}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-black z-50 overflow-visible"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            <div className="py-1">
              {options.map((option, idx) => (
                <motion.button
                  key={option}
                  onClick={() => handleSelect(option)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: isSafari ? 0 : idx * 0.02 }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors whitespace-nowrap ${
                    value === option
                      ? 'bg-black/10 text-black'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  {displayFormat(option)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
