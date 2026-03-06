'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const mockJobs = [
  { id: 1, title: 'Product Design', type: 'Product', salary: '$3000-5000', location: 'Remote', budget: '$4200' },
  { id: 2, title: 'UI/UX Design', type: 'Design', salary: '$2000-4000', location: 'Remote', budget: '$3200' },
  { id: 3, title: 'Full Stack Developer', type: 'Product', salary: '$5000-8000', location: 'Remote', budget: '$6500' },
  { id: 4, title: 'Brand Identity', type: 'Design', salary: '$1500-3000', location: 'USA', budget: '$2200' },
  { id: 5, title: 'Web Development', type: 'Product', salary: '$3000-6000', location: 'Remote', budget: '$4800' },
]

interface JobsProps {}

export default function Jobs({}: JobsProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [salaryFilter, setSalaryFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')

  const types = ['All', 'Product', 'Design']
  const salaries = ['All', '$0-2000', '$2000-4000', '$4000-6000', '$6000+']
  const locations = ['All', 'Remote', 'USA', 'EU']

  const filtered = mockJobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || job.type === typeFilter
    const matchLocation = locationFilter === 'All' || job.location === locationFilter
    return matchSearch && matchType && matchLocation
  })

  return (
    <div className="w-full">
      <motion.h1 variants={itemVariants} initial="hidden" animate="visible"
        className="sticky top-0 bg-dark z-40 px-4 md:px-8 py-8 text-4xl font-light"
      >
        Jobs
      </motion.h1>

      <div className="px-4 md:px-8 py-4">
        <motion.div variants={itemVariants} initial="hidden" animate="visible"
          className="bg-surface pl-0 pr-0 py-0 mb-4"
        >
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-cream placeholder-cream/40 outline-none font-mono text-sm border-b border-border pb-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-4">
            <div>
              <label className="block text-cream/60 font-mono text-xs mb-2">TYPE</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-border text-cream font-mono text-sm outline-none"
              >
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-cream/60 font-mono text-xs mb-2">SALARY</label>
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-border text-cream font-mono text-sm outline-none"
              >
                {salaries.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-cream/60 font-mono text-xs mb-2">LOCATION</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b border-border text-cream font-mono text-sm outline-none"
              >
                {locations.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-4">
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              className="bg-surface py-4 px-0 border-t border-border hover:border-t-coral/50 transition-colors"
            >
              <div className="px-4">
                <h3 className="text-xl font-light mb-2">{job.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-cream/50 font-mono text-xs mb-1">TYPE</p>
                    <p className="font-mono text-mint">{job.type}</p>
                  </div>
                  <div>
                    <p className="text-cream/50 font-mono text-xs mb-1">BUDGET</p>
                    <p className="font-mono text-xl text-mint font-semibold">{job.budget}</p>
                  </div>
                  <div>
                    <p className="text-cream/50 font-mono text-xs mb-1">SALARY RANGE</p>
                    <p className="font-mono text-mint">{job.salary}</p>
                  </div>
                  <div>
                    <p className="text-cream/50 font-mono text-xs mb-1">LOCATION</p>
                    <p className="font-mono text-mint">{job.location}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-coral hover:text-coral/80 font-mono text-sm transition-colors">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
