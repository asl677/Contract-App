'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { MagnifyingGlassIcon, ReloadIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import FilterPanel from '@/components/FilterPanel'
import NavPanel from '@/components/NavPanel'

interface JobsProps {
  currentPage: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes'
  onNavigate: (page: 'dashboard' | 'contracts' | 'time' | 'settings' | 'jobs' | 'notes') => void
}

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
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
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

export default function Jobs({ currentPage, onNavigate }: JobsProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [employmentFilter, setEmploymentFilter] = useState('All')
  const [salaryFilter, setSalaryFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isMd, setIsMd] = useState(false)
  const initialFetchDone = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

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
      const limit = newOffset === 0 ? 10 : 10
      const response = await fetch(`/api/jobs?offset=${newOffset}&limit=${limit}`)
      const data: JobsResponse = await response.json()

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

      setOffset(newOffset + limit)
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


  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      fetchJobs(0)
      window.scrollTo(0, 0)
    }
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) setLastUpdated(new Date(lastUpdated))
    }, 60000)
    return () => clearInterval(interval)
  }, [lastUpdated])

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || isLoadingMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchJobs(offset)
        }
      },
      { rootMargin: '500px' }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [offset, hasMore, isLoadingMore, fetchJobs])

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
    <div className="overflow-x-hidden" style={{ maxWidth: isMd && showFilters ? 'calc(100% - 384px)' : '100%', transition: 'max-width 0.3s ease-in-out' }}>
      <motion.div
        className="fixed top-0 left-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-4 flex items-center justify-between"
        style={{ right: isMd && showFilters ? 384 : 0, transition: 'right 0.3s ease-in-out' }}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl font-light">Jobs</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
          <button
            onClick={() => setShowNav(!showNav)}
            className="text-cream hover:text-coral transition-colors md:hidden"
            aria-label="Toggle navigation"
          >
            <HamburgerMenuIcon width={22} height={22} />
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100dvh]">
          <p className="text-cream/50 font-mono text-sm pulse-text">Grabbin' jobs</p>
        </div>
      ) : displayedJobs.length === 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex items-center justify-center min-h-[100dvh] -mt-[100px]">
          <motion.div variants={itemVariants}>
            <p className="text-cream font-mono font-medium">No jobs found</p>
          </motion.div>
        </motion.div>
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

          <NavPanel
            isOpen={showNav}
            onClose={() => setShowNav(false)}
            currentPage={currentPage}
            onNavigate={onNavigate}
          />

          <div className="px-4 md:px-8 pt-20 md:pt-[100px] pb-8">
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
                  <div className="ml-auto pl-4 max-w-[140px] md:max-w-none">
                    <p className="text-xl md:text-3xl text-mint font-sans font-medium">{job.company}</p>
                  </div>
                </div>
              </motion.a>
              </motion.div>
            ))}
          </motion.div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center py-4"
          >
            <div className="text-cream/50 font-mono text-sm">No mo jobs</div>
          </motion.div>
        )}
          </div>
        </>
      )}
    </div>
  )
}
