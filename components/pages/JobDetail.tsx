'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { ArrowLeftIcon, CheckIcon } from '@radix-ui/react-icons'

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

interface JobDetailProps {
  jobId: number
  onNavigate?: (page: string) => void
}

// Mock job data - same as Jobs.tsx
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

export default function JobDetail({ jobId, onNavigate }: JobDetailProps) {
  const job = useMemo(() => allJobs.find(j => j.id === jobId), [jobId])

  if (!job) {
    return (
      <div className="w-full px-4 md:px-8 py-8">
        <button
          onClick={() => onNavigate?.('jobs')}
          className="flex items-center gap-2 text-cream hover:text-coral transition-colors mb-8"
        >
          <ArrowLeftIcon width={20} height={20} />
          Back to Jobs
        </button>
        <p className="text-cream/50">Job not found</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 md:left-20 bg-dark z-40 px-4 md:px-8 py-8 flex items-center gap-4"
      >
        <button
          onClick={() => onNavigate?.('jobs')}
          className="text-cream hover:text-coral transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <h1 className="text-4xl font-light">{job.title}</h1>
      </motion.div>

      <div className="px-4 md:px-8 py-8 pt-24">
        <motion.div variants={itemVariants} initial="hidden" animate="visible"
          className="max-w-2xl space-y-8"
        >
          <div className="space-y-4">
            <div>
              <p className="text-cream/60 font-mono text-sm mb-2">JOB TYPE</p>
              <p className="text-lg">{job.type}</p>
            </div>
            <div>
              <p className="text-cream/60 font-mono text-sm mb-2">LOCATION</p>
              <p className="text-lg">{job.location}</p>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-light mb-4">Budget & Compensation</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-cream/60 font-mono text-sm mb-2">BUDGET</p>
                <p className="text-3xl font-semibold text-mint">{job.budget}</p>
              </div>
              <div>
                <p className="text-cream/60 font-mono text-sm mb-2">SALARY RANGE</p>
                <p className="text-2xl text-mint">{job.salary}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-light mb-4">Job Description</h2>
            <p className="text-cream/80 leading-relaxed mb-4">
              This is a {job.type.toLowerCase()} position based in {job.location}. The role requires expertise in delivering high-quality work with attention to detail.
            </p>
            <p className="text-cream/80 leading-relaxed mb-4">
              Budget for this project is {job.budget} with a salary range of {job.salary}. We're looking for a professional who can deliver exceptional results.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <button
              onClick={() => console.log('Apply clicked for job:', job.id)}
              className="bg-coral text-dark px-8 py-4 font-mono font-medium hover:bg-coral/90 transition-colors flex items-center gap-2"
            >
              <CheckIcon width={20} height={20} />
              Apply Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
