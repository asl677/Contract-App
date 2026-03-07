'use client'

import { useEffect } from 'react'

export default function LenisProvider() {
  useEffect(() => {
    // Apply smooth scroll behavior to html element for window scrolling
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return null
}
