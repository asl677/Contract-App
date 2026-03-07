'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { MagnifyingGlassIcon, ReloadIcon } from '@radix-ui/react-icons'
import { useToast } from '@/components/Toast'
import FilterPanel from '@/components/FilterPanel'

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

const getEmploymentType = (duration: string): string => {
  const lowerDuration = duration.toLowerCase()
  if (lowerDuration === 'full-time') return 'Full-time'
  if (lowerDuration.includes('part-time') ||
      lowerDuration.includes('contract') ||
      lowerDuration.includes('temp') ||
      lowerDuration.includes('intern') ||
      lowerDuration.includes('vendor') ||
      lowerDuration.includes('short term') ||
      lowerDuration.includes('6 month') ||
      lowerDuration.includes('3 month')) return 'Fractional'
  return 'Fractional' // Default to Fractional for ambiguous cases
}

export default function Jobs() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [employmentFilter, setEmploymentFilter] = useState('All')
  const [salaryFilter, setSalaryFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [endOfListShown, setEndOfListShown] = useState(false)
  const [isMd, setIsMd] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const initialFetchDone = useRef(false)

  useEffect(() => {
    const checkMd = () => setIsMd(window.innerWidth >= 768)
    checkMd()
    window.addEventListener('resize', checkMd)
    return () => window.removeEventListener('resize', checkMd)
  }, [])

  const types = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Product', 'DevOps', 'Data Science', 'Mobile', 'AI/ML', 'Security', 'Cloud']
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Los Angeles, CA', 'Chicago, IL', 'Boston, MA']
  const employmentTypes = ['All', 'Full-time', 'Fractional']
  const salaries = ['All', '$', '$$', '$$$', '$$$$']

  // Dynamically derive sources from actual jobs
  const uniqueSources = useMemo(() => {
    const sources = new Set(displayedJobs.map(job => job.board))
    return ['All', ...Array.from(sources).sort()]
  }, [displayedJobs])

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
      window.scrollTo(0, 0)
    }
  }, [])

  // Ensure scroll container is properly initialized
  useEffect(() => {
    if (displayedJobs.length > 0 && mainRef.current) {
      // Force layout recalculation to ensure scrollability
      mainRef.current.scrollTop = 0
    }
  }, [displayedJobs.length])

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
    const matchEmployment = employmentFilter === 'All' || getEmploymentType(job.duration) === employmentFilter
    const matchSalary = salaryFilter === 'All' || getSalaryRange(job.salary) === salaryFilter
    return matchSearch && matchType && matchLocation && matchSource && matchEmployment && matchSalary
  }), [displayedJobs, search, typeFilter, locationFilter, sourceFilter, employmentFilter, salaryFilter])

  return (
    <div className="w-full" style={{ marginRight: isMd && showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}>
      <motion.div
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-[22px] flex items-center justify-between"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
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
            onClick={() => setShowFilters(!showFilters)}
            className="text-cream hover:text-coral transition-colors"
            aria-label="Toggle filters"
          >
            <MagnifyingGlassIcon width={22} height={22} />
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100dvh]">
          <p className="text-cream/50 font-mono text-sm pulse-text">Grabbin' jobs</p>
        </div>
      ) : (
        <>
          <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            sourceFilter={sourceFilter}
            onSourceChange={setSourceFilter}
            employmentFilter={employmentFilter}
            onEmploymentChange={setEmploymentFilter}
            salaryFilter={salaryFilter}
            onSalaryChange={setSalaryFilter}
            types={types}
            locations={locations}
            sources={uniqueSources}
            employmentTypes={employmentTypes}
            salaries={salaries}
          />

          <motion.div
            ref={mainRef}
            className="px-4 md:px-8 py-4 pb-0 overflow-y-auto pt-[80px] min-h-screen"
            style={{ scrollBehavior: 'smooth', marginRight: isMd && showFilters ? 384 : 0, transition: 'margin-right 0.3s ease-in-out' }}
          >

          <motion.div
            key={`${typeFilter}-${locationFilter}-${search}-${sourceFilter}-${employmentFilter}-${salaryFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-0 md:mt-0 mt-4"
          >
            {filtered.map((job) => (
              <motion.div key={`${job.id}-${job.url}`} className="relative" variants={itemVariants} layout>
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px bg-border"
                  variants={itemVariants}
                />
                <motion.a
                  variants={itemVariants}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface pl-0 pr-0 py-6 border-t border-border transition-colors cursor-pointer hover:bg-surface/80 flex flex-col"
                  layout
                >
                <div className="flex items-start justify-between gap-4">
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
        </AnimatePresence>

        {filtered.length === 0 && displayedJobs.length > 0 && (
          <div className="flex justify-center items-center min-h-[60vh] mt-16">
            <div className="text-cream/50 font-mono text-lg text-center">Shit, I found nothin'</div>
          </div>
        )}

        {!hasMore && displayedJobs.length > 0 && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center py-4"
          >
            <div className="text-cream/50 font-mono text-sm">No mo jobs</div>
          </motion.div>
        )}
          </motion.div>
        </>
      )}
    </div>
  )
}
