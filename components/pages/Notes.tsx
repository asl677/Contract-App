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
  const [cursorPosition, setCursorPosition] = useState(0)

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

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Create new line with current font weight and indentation
      const newNote: Note = {
        id: Date.now().toString(),
        text: '',
        isBold: fontWeight === 'bold',
        indent: 0,
      }
      setNotes([...notes, newNote])
    } else if (e.key === 'Backspace') {
      // Allow backspace to delete content within current note
      if (canvasRef.current?.innerText === '') {
        e.preventDefault()
        // Delete empty note and go back to previous
        if (notes.length > 1) {
          setNotes(notes.slice(0, -1))
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Increase indentation
      const newNotes = [...notes]
      if (newNotes.length > 0) {
        newNotes[newNotes.length - 1].indent = Math.min(newNotes[newNotes.length - 1].indent + 1, 5)
        setNotes(newNotes)
      }
    } else if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault()
      // Decrease indentation
      const newNotes = [...notes]
      if (newNotes.length > 0) {
        newNotes[newNotes.length - 1].indent = Math.max(newNotes[newNotes.length - 1].indent - 1, 0)
        setNotes(newNotes)
      }
    }
  }

  const handleInput = (text: string) => {
    const newNotes = [...notes]
    if (newNotes.length === 0) {
      const newNote: Note = {
        id: Date.now().toString(),
        text,
        isBold: fontWeight === 'bold',
        indent: 0,
      }
      setNotes([newNote])
    } else {
      newNotes[newNotes.length - 1].text = text
      newNotes[newNotes.length - 1].isBold = fontWeight === 'bold'
      setNotes(newNotes)
    }
  }

  // Create a cursor animation
  useEffect(() => {
    if (canvasRef.current) {
      const blink = setInterval(() => {
        if (cursorRef.current) {
          cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0'
        }
      }, 530)
      return () => clearInterval(blink)
    }
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

      {/* Font Weight Selection */}
      <motion.div variants={itemVariants} className="flex gap-3 mb-8">
        <button
          onClick={() => setFontWeight('regular')}
          className={`px-4 py-2 border transition-all ${
            fontWeight === 'regular'
              ? 'bg-coral text-dark border-coral'
              : 'border-cream/30 text-cream hover:border-cream/50'
          }`}
          style={{ borderRadius: 0 }}
        >
          <span className="font-normal text-sm">Regular</span>
        </button>
        <button
          onClick={() => setFontWeight('bold')}
          className={`px-4 py-2 border transition-all ${
            fontWeight === 'bold'
              ? 'bg-coral text-dark border-coral'
              : 'border-cream/30 text-cream hover:border-cream/50'
          }`}
          style={{ borderRadius: 0 }}
        >
          <span className="font-bold text-sm">Bold</span>
        </button>
      </motion.div>

      {/* Canvas Area */}
      <motion.div variants={itemVariants} className="flex-1 relative">
        <div className="w-full h-full bg-dark border border-cream/20 p-8 relative overflow-auto">
          {/* Notes Container */}
          <div className="space-y-1">
            {notes.length === 0 ? (
              <div className="text-cream/40 italic">Start typing...</div>
            ) : (
              notes.map((note, idx) => (
                <div key={note.id} className={`flex items-start gap-3 pl-${note.indent * 6}`} style={{ paddingLeft: `${note.indent * 24}px` }}>
                  {/* Bullet */}
                  <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-cream/60" />
                  {/* Text */}
                  <div
                    className={`flex-1 leading-relaxed break-words ${
                      note.isBold ? 'font-bold' : 'font-normal'
                    }`}
                    style={{ color: '#ede0c8' }}
                  >
                    {note.text}
                  </div>
                </div>
              ))
            )}

            {/* Active Input Line */}
            <div className="flex items-start gap-3 relative" style={{ paddingLeft: `${(notes[notes.length - 1]?.indent || 0) * 24}px` }}>
              {/* Bullet */}
              <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-cream/60" />

              {/* Editable Input with Cursor */}
              <div className="flex-1 relative">
                <div
                  ref={canvasRef}
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleKeyDown}
                  onInput={(e) => handleInput(e.currentTarget.innerText)}
                  className={`outline-none leading-relaxed min-h-6 break-words ${
                    fontWeight === 'bold' ? 'font-bold' : 'font-normal'
                  }`}
                  style={{
                    color: '#ede0c8',
                    caretColor: 'transparent', // Hide default caret
                  }}
                />

                {/* Custom Black Cursor */}
                <div
                  ref={cursorRef}
                  className="absolute left-0 top-0 w-0.5 h-6 bg-black pointer-events-none"
                  style={{
                    animation: 'blink 1s infinite',
                  }}
                />
              </div>
            </div>
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

      {/* Footer Info */}
      <motion.div variants={itemVariants} className="mt-8 text-cream/50 text-sm">
        <p>Tab to indent • Shift+Tab to unindent • Enter for new bullet</p>
      </motion.div>
    </motion.div>
  )
}
