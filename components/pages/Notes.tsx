'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

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

interface Note {
  id: string
  text: string
  isBold: boolean
  indent: number
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [fontWeight, setFontWeight] = useState<'regular' | 'bold'>('regular')
  const canvasRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [cursorLeft, setCursorLeft] = useState(0)

  // Load notes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const handleInput = (text: string) => {
    // Simple note storage - just one note
    if (notes.length === 0 && text) {
      const newNote: Note = {
        id: Date.now().toString(),
        text,
        isBold: fontWeight === 'bold',
        indent: 0,
      }
      setNotes([newNote])
    } else if (notes.length > 0) {
      const updatedNotes = [...notes]
      updatedNotes[0].text = text
      updatedNotes[0].isBold = fontWeight === 'bold'
      setNotes(updatedNotes)
    }
  }

  // Update cursor position based on text content
  useEffect(() => {
    if (canvasRef.current && measureRef.current) {
      const text = canvasRef.current.innerText.replace(/^• /, '')
      measureRef.current.innerText = text
      const width = measureRef.current.offsetWidth
      setCursorLeft(width)
    }
  }, [notes])

  // Create a cursor animation
  useEffect(() => {
    const blink = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0'
      }
    }, 530)
    return () => clearInterval(blink)
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen bg-dark text-cream px-4 md:px-8 py-8 pb-24 md:pb-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-none mb-2">
          Notes
        </h1>
      </motion.div>


      {/* Canvas Area */}
      <motion.div variants={itemVariants} className="flex-1 relative">
        <div className="w-full h-full bg-dark relative overflow-auto">
          {/* Active Input Line */}
          <div className="relative">
            {/* Hidden text measurement */}
            <div
              ref={measureRef}
              className="invisible inline-block"
              style={{
                color: '#000000',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 'inherit',
              }}
            />

            {/* Editable Input */}
            <div
              ref={canvasRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const text = e.currentTarget.innerText
                handleInput(text)
              }}
              className="outline-none leading-relaxed min-h-6 break-words"
              style={{
                color: '#000000',
                caretColor: 'transparent',
                userSelect: 'text',
                WebkitUserSelect: 'text',
                cursor: 'text',
              }}
            />

            {/* Custom Black Cursor */}
            <div
              ref={cursorRef}
              className="absolute top-0 w-0.5 h-6 bg-black pointer-events-none"
              style={{
                animation: 'blink 1s infinite',
                left: `${cursorLeft}px`,
              }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes blink {
            0%, 49% {
              opacity: 1;
            }
            50%, 100% {
              opacity: 0;
            }
          }
        `}</style>
      </motion.div>

    </motion.div>
  )
}
