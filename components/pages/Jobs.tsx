'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { MagnifyingGlassIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/Toast'
import CustomDropdown from '@/components/CustomDropdown'

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

const getSalaryRange = (salaryStr: string): string => {
  const match = salaryStr.match(/(\d+)K-(\d+)K/)
  if (!match) return '$'

  const min = parseInt(match[1])
  const max = parseInt(match[2])
  const avg = (min + max) / 2

  if (avg >= 200) return '$$$$'
  if (avg >= 150) return '$$$'
  if (avg >= 100) return '$$'
  return '$'
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
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [endOfListShown, setEndOfListShown] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const initialFetchDone = useRef(false)

  const types = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Product', 'DevOps', 'Data Science', 'Mobile', 'AI/ML', 'Security', 'Cloud']
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA']
  const sources = ['All', 'Greenhouse', 'Y Combinator']

  const fetchJobs = useCallback(async (newOffset: number = 0) => {
    if (newOffset === 0) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const response = await fetch(`/api/jobs?offset=${newOffset}&limit=25`)
      const data: JobsResponse = await response.json()

      // DEBUG: Log API response
      console.log(`[API Response] Offset=${newOffset}, Returned ${data.jobs.length} jobs, Total=${data.total}, HasMore=${data.hasMore}`)
      const jobsByBoard = data.jobs.reduce((acc, job) => {
        acc[job.board] = (acc[job.board] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      console.log('[Jobs by board]:', jobsByBoard)
      const ycJobs = data.jobs.filter(j => j.board === 'Y Combinator')
      console.log(`[YC Jobs] Found ${ycJobs.length} YC jobs in this batch`)
      if (ycJobs.length > 0) {
        console.log('[Sample YC job]:', ycJobs[0].title, 'at', ycJobs[0].company)
      }

      if (newOffset === 0) {
        setDisplayedJobs(data.jobs)
      } else {
        setDisplayedJobs(prev => {
          // Deduplicate: only add jobs that aren't already in the list
          const existingUrls = new Set(prev.map(job => job.url))
          const newJobs = data.jobs.filter(job => !existingUrls.has(job.url))
          return [...prev, ...newJobs]
        })
      }

      setOffset(newOffset + 25)
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
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchJobs(0)
    }
  }, [])

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

    // Delay scroll listener attachment to prevent triggering on initial load
    const timeoutId = setTimeout(() => {
      main.addEventListener('scroll', handleScroll)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      main.removeEventListener('scroll', handleScroll)
    }
  }, [offset, hasMore, isLoadingMore, fetchJobs])

  // Show "End of List" toast when reaching the end
  useEffect(() => {
    if (!hasMore && displayedJobs.length > 0 && !endOfListShown) {
      addToast('End of List', 'success')
      setEndOfListShown(true)
    }
  }, [hasMore, displayedJobs.length, endOfListShown, addToast])

  const filtered = useMemo(() => displayedJobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                       job.company.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || job.type === typeFilter
    const matchLocation = locationFilter === 'All' || job.location === locationFilter
    const matchSource = sourceFilter === 'All' || job.board === sourceFilter
    return matchSearch && matchType && matchLocation && matchSource
  }), [displayedJobs, search, typeFilter, locationFilter, sourceFilter])

  return (
    <div className="w-full">
      <div
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
              <ReloadIcon width={18} height={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-cream hover:text-coral transition-colors"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon width={22} height={22} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100dvh]">
          <p className="text-cream/50 font-mono text-sm">Grabbin' jobs</p>
        </div>
      ) : (
        <div ref={mainRef} className={`px-4 md:px-8 py-4 pb-12 overflow-y-auto ${showSearch ? 'pt-56' : 'pt-24'}`}>
          {showSearch && (
          <div
            className="fixed top-24 left-0 right-0 md:left-20 z-30 bg-dark"
          >
            <div className="hidden md:grid grid-cols-4 gap-2.5 px-4 md:px-8 py-4">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
              />
              <CustomDropdown
                value={typeFilter}
                onChange={(e) => setTypeFilter(e)}
                options={types}
                displayFormat={(v) => v === 'All' ? 'All Types' : v}
              />
              <CustomDropdown
                value={locationFilter}
                onChange={(e) => setLocationFilter(e)}
                options={locations}
                displayFormat={(v) => v === 'All' ? 'All Locations' : v}
              />
              <CustomDropdown
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e)}
                options={sources}
                displayFormat={(v) => v === 'All' ? 'All Sources' : v}
              />
            </div>

            <div className="md:hidden space-y-2 px-4 md:px-8 py-4">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                style={{ backgroundColor: 'white', color: 'black', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <CustomDropdown
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e)}
                  options={types}
                  displayFormat={(v) => v === 'All' ? 'All Types' : v}
                />
                <CustomDropdown
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e)}
                  options={locations}
                  displayFormat={(v) => v === 'All' ? 'All Locations' : v}
                />
              </div>
              <CustomDropdown
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e)}
                options={sources}
                displayFormat={(v) => v === 'All' ? 'All Sources' : v}
              />
            </div>
          </div>
        )}

          <motion.div
            key={`${typeFilter}-${locationFilter}-${search}-${sourceFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-0 md:mt-0 mt-4"
          >
            {filtered.map((job) => (
              <motion.div key={`${job.id}-${job.url}`} className="relative" variants={itemVariants}>
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px bg-border"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ originX: 0 }}
                />
                <motion.a
                  variants={itemVariants}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface pl-0 pr-0 py-6 border-t border-border transition-colors cursor-pointer hover:bg-surface/80 flex flex-col"
                >
                <div className="flex items-start justify-between mb-4 gap-4 pr-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-light mb-1">{job.title}</h3>
                    <p className="text-cream/60 font-mono text-sm">{job.type} • Remote • {getSalaryRange(job.salary)}</p>
                  </div>
                  <div className="ml-auto pl-4">
                    <p className="text-xl md:text-3xl text-mint font-sans font-medium whitespace-nowrap">{job.company}</p>
                  </div>
                </div>
              </motion.a>
              </motion.div>
            ))}
          </motion.div>

        <AnimatePresence mode="wait">
          {isLoadingMore && (
            <motion.div
              key="gobblin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center py-4"
            >
              <div className="text-cream/50 font-mono text-sm">Gobblin'</div>
            </motion.div>
          )}

          {!isLoadingMore && hasMore && displayedJobs.length > 0 && (
            <motion.div
              key="load-more"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center py-4"
            >
              <button
                onClick={() => fetchJobs(offset)}
                className="px-6 py-3 border border-cream/20 text-cream hover:border-cream/50 hover:bg-surface transition-all font-mono text-sm"
              >
                Load More
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasMore && displayedJobs.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="text-cream/50 font-mono text-sm">No more jobs</div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
