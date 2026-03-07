'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
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

const breathingVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2.4,
      repeat: Infinity,
    },
  },
}

interface Job {
  id: number
  title: string
  company: string
  type: string
  salary: string
  location: string
  duration: string
  url: string
  board: string
}

interface JobsResponse {
  jobs: Job[]
  total: number
  hasMore: boolean
}

export default function Jobs() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

  const types = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Product', 'DevOps', 'Data Science', 'Mobile', 'AI/ML', 'Security', 'Cloud']
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA']

  const fetchJobs = useCallback(async (newOffset: number = 0) => {
    if (newOffset === 0) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/jobs?offset=${newOffset}&limit=20`)
      const data: JobsResponse = await response.json()

      if (newOffset === 0) {
        setDisplayedJobs(data.jobs)
      } else {
        setDisplayedJobs(prev => [...prev, ...data.jobs])
      }

      setOffset(newOffset + 20)
      setHasMore(data.hasMore)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      if (newOffset === 0) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }
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
    fetchJobs(0)
  }, [fetchJobs])

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) setLastUpdated(new Date(lastUpdated))
    }, 60000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = main
      // Load more when user is 80% down the page
      if (scrollHeight - scrollTop - clientHeight < 500 && hasMore && !isLoadingMore) {
        fetchJobs(offset)
      }
    }

    main.addEventListener('scroll', handleScroll)
    return () => main.removeEventListener('scroll', handleScroll)
  }, [offset, hasMore, isLoadingMore, fetchJobs])

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
              <p className="text-cream/50 font-mono text-xs uppercase">
                {getRelativeTime(lastUpdated)}
              </p>
            )}
            <button
              onClick={() => fetchJobs(0)}
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

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100dvh]">
          <motion.p variants={breathingVariants} animate="animate" className="text-cream/50 font-mono text-sm">Gettin'</motion.p>
        </div>
      ) : (
        <div ref={mainRef} className="px-4 md:px-8 py-4 pt-24 pb-12 overflow-y-auto">
          {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-transparent mb-2 pb-10 space-y-4"
          >
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
              style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">TYPE</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                  style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
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
                  style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
                >
                  {locations.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-0">
            {filtered.map((job) => (
              <motion.a
                key={job.id}
                variants={itemVariants}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface pl-0 pr-6 py-6 transition-colors cursor-pointer hover:bg-surface/80 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-light mb-1">{job.title}</h3>
                    <p className="text-cream/60 font-mono text-sm">{job.type} • {job.duration} • {job.location.split(',')[0]}</p>
                  </div>
                  <div className="ml-auto pl-4">
                    <p className="text-xl md:text-3xl text-mint font-sans font-medium whitespace-nowrap">{job.company}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

        {isLoadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="text-cream/50 font-mono text-sm">Loading more jobs...</div>
          </motion.div>
        )}

        {!hasMore && displayedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="text-cream/50 font-mono text-sm">No more jobs</div>
          </motion.div>
        )}
      </div>
      )}
    </div>
  )
}
