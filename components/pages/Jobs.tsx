'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

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

const generateMockJobs = (count: number) => {
  const titles = [
    'Product Design', 'UI/UX Design', 'Full Stack Developer', 'Brand Identity',
    'Web Development', 'Mobile App Design', 'Graphic Design', 'Backend Engineer',
    'Frontend Developer', 'Logo Design', 'Branding Package', 'React Developer',
    'Node.js Developer', 'Python Developer', 'UI Designer', 'UX Researcher',
    'Wireframing', 'Prototype Design', 'Website Redesign', 'Landing Page',
    'eCommerce Design', 'App Development', 'API Integration', 'Database Design',
    'Cloud Architecture', 'DevOps Engineer', 'QA Tester', 'Tech Lead',
    'Data Analyst', 'Machine Learning', 'AI Development', 'Vue.js Developer',
    'Angular Developer', 'TypeScript Expert', 'CSS Specialist', 'Performance Optimization',
    'SEO Specialist', 'Content Strategy', 'Copywriting', 'Illustration',
    'Animation Design', 'Video Editing', 'Podcast Editing', 'Sound Design',
  ]

  const types = ['Product', 'Design']
  const locations = ['Remote', 'USA', 'EU', 'ASIA']

  const jobs = []
  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const minSalary = Math.floor(Math.random() * 6000) + 1500
    const maxSalary = minSalary + Math.floor(Math.random() * 4000) + 1000
    const budget = Math.floor((minSalary + maxSalary) / 2) + Math.floor(Math.random() * 2000)

    jobs.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      type,
      salary: `$${minSalary}-${maxSalary}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      budget: `$${budget}`,
    })
  }
  return jobs
}

const allJobs = generateMockJobs(500)

interface JobsProps {
  onNavigate?: (page: string, jobId?: number) => void
}

export default function Jobs({ onNavigate }: JobsProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [salaryFilter, setSalaryFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [displayedJobs, setDisplayedJobs] = useState(allJobs.slice(0, 50))
  const [showSearch, setShowSearch] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const types = ['All', 'Product', 'Design']
  const salaries = ['All', '$0-2000', '$2000-4000', '$4000-6000', '$6000+']
  const locations = ['All', 'Remote', 'USA', 'EU', 'ASIA']

  const filtered = displayedJobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || job.type === typeFilter
    const matchLocation = locationFilter === 'All' || job.location === locationFilter
    return matchSearch && matchType && matchLocation
  })

  const loadMore = useCallback(() => {
    setDisplayedJobs(prev => {
      const currentLength = prev.length
      const newJobs = allJobs.slice(0, currentLength + 50)
      return newJobs
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedJobs.length < allJobs.length) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [displayedJobs.length, loadMore])

  return (
    <div className="w-full">
      <motion.div variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8 flex items-center justify-between"
      >
        <h1 className="text-4xl font-light">Jobs</h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-cream hover:text-coral transition-colors"
          aria-label="Toggle search"
        >
          <MagnifyingGlassIcon width={20} height={20} />
        </button>
      </motion.div>

      <div className="px-4 md:px-8 py-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-dark mb-2">SALARY</label>
                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-black transition-colors focus:outline-none focus:border-black focus:ring-0"
                  style={{ backgroundColor: 'white', color: 'black', borderRadius: 0 }}
                >
                  {salaries.map(s => (
                    <option key={s} value={s}>{s}</option>
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

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-0">
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              className="bg-surface pl-0 pr-6 py-6 border-t border-border transition-colors cursor-pointer hover:bg-surface/80"
              onClick={() => onNavigate?.('job-detail', job.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-light mb-1">{job.title}</h3>
                  <p className="text-cream/60 font-mono text-sm">{job.type}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-mono text-mint text-sm font-semibold">{job.budget}</p>
                  <p className="text-cream/60 font-mono text-xs">{job.salary}</p>
                </div>
              </div>
              <p className="text-cream/50 font-mono text-xs">{job.location}</p>
            </motion.div>
          ))}
        </motion.div>

        <div ref={loaderRef} className="py-8 text-center">
          {displayedJobs.length < allJobs.length && (
            <p className="text-cream/50 font-mono text-sm">Loading more...</p>
          )}
        </div>
      </div>
    </div>
  )
}
