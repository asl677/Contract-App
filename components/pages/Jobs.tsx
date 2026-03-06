'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon, ReloadIcon } from '@radix-ui/react-icons'

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

interface Job {
  id: number
  title: string
  company: string
  type: string
  salary: string
  location: string
  url: string
  board: string
}

export default function Jobs() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const types = ['All', 'Product', 'Design']
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA']

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs')
      const jobs = await response.json()
      setDisplayedJobs(jobs.slice(0, 50))
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) setLastUpdated(new Date(lastUpdated))
    }, 60000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  const filtered = displayedJobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                       job.company.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || job.type === typeFilter
    const matchLocation = locationFilter === 'All' || job.location === locationFilter
    return matchSearch && matchType && matchLocation
  })

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Jobs</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <p className="text-cream/50 font-mono text-xs">
                Updated {getRelativeTime(lastUpdated)}
              </p>
            )}
            <button
              onClick={fetchJobs}
              className="text-cream hover:text-coral transition-colors"
              aria-label="Refresh jobs"
              disabled={isLoading}
            >
              <ReloadIcon width={20} height={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-cream hover:text-coral transition-colors"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon width={20} height={20} />
          </button>
        </div>
      </motion.div>

      <div className="px-4 md:px-8 py-4 pt-24">
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-transparent mb-2 space-y-4"
          >
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
              style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">TYPE</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                  style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
                >
                  {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">LOCATION</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                  style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
                >
                  {locations.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-surface pl-0 pr-6 py-6 border-t border-border animate-pulse" />
            ))}
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-0">
            {filtered.map((job, idx) => (
              <motion.a
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.08 }}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface pl-0 pr-6 py-6 border-t border-border transition-colors cursor-pointer hover:bg-surface/80 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-light mb-1">{job.title}</h3>
                    <p className="text-cream/60 font-mono text-sm">{job.type} • {job.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-3xl md:text-6xl text-mint font-sans font-medium">{job.salary}</p>
                    <p className="text-cream/60 font-mono text-xs">{job.location}</p>
                  </div>
                </div>
                <p className="text-cream/50 font-mono text-xs">via {job.board}</p>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
