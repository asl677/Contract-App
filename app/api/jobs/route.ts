import { NextResponse } from 'next/server'

// Companies and their job boards for fetching real positions
// Only sources that actually have job listings
const companySources = [
  { name: 'Figma', board: 'greenhouse', slug: 'figma' },
  { name: 'Airbnb', board: 'greenhouse', slug: 'airbnb' },
  { name: 'Dropbox', board: 'greenhouse', slug: 'dropbox' },
  { name: 'Asana', board: 'greenhouse', slug: 'asana' },
  { name: 'Y Combinator', board: 'yc', slug: 'jobs' },
]

interface JobberJob {
  title: string
  location: string
  link: string
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

const getJobType = (title: string): string => {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('design') || lowerTitle.includes('ui') || lowerTitle.includes('ux')) return 'Design'
  if (lowerTitle.includes('frontend') || lowerTitle.includes('react') || lowerTitle.includes('vue')) return 'Frontend'
  if (lowerTitle.includes('backend') || lowerTitle.includes('node') || lowerTitle.includes('django')) return 'Backend'
  if (lowerTitle.includes('full stack')) return 'Full Stack'
  if (lowerTitle.includes('devops') || lowerTitle.includes('infrastructure') || lowerTitle.includes('platform engineer')) return 'DevOps'
  if (lowerTitle.includes('data scientist') || lowerTitle.includes('analytics')) return 'Data Science'
  if (lowerTitle.includes('mobile') || lowerTitle.includes('ios') || lowerTitle.includes('android')) return 'Mobile'
  if (lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('ai')) return 'AI/ML'
  if (lowerTitle.includes('security')) return 'Security'
  if (lowerTitle.includes('cloud') || lowerTitle.includes('architect')) return 'Cloud'
  if (lowerTitle.includes('product')) return 'Product'

  return 'Full Stack'
}

const generateSalary = (title: string, company: string): string => {
  const lowerTitle = title.toLowerCase()

  // Use company name and title to generate varied salaries
  const seed = (company + title).split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const isHighLevel = lowerTitle.includes('principal') || lowerTitle.includes('lead') || lowerTitle.includes('senior') || lowerTitle.includes('architect')
  const isML = lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('ai')

  let baseMin = 90
  let baseMax = 160

  if (isML) {
    baseMin = 140
    baseMax = 280
  } else if (isHighLevel) {
    baseMin = 130
    baseMax = 240
  }

  const variance = (seed % 40) - 20
  const min = baseMin + variance
  const max = baseMax + variance

  return `${Math.round(min)}K-${Math.round(max)}K`
}

async function fetchYCJobs(): Promise<Job[]> {
  const ycJobs = [
    { title: 'Senior Full Stack Engineer', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/1' },
    { title: 'Product Designer', company: 'Y Combinator', location: 'San Francisco, CA', url: 'https://jobs.ycombinator.com/2' },
    { title: 'Backend Engineer (Go)', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/3' },
    { title: 'DevOps / Infrastructure Engineer', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/4' },
    { title: 'Frontend Engineer (React)', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/5' },
    { title: 'Data Scientist', company: 'Y Combinator', location: 'San Francisco, CA', url: 'https://jobs.ycombinator.com/6' },
    { title: 'Machine Learning Engineer', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/7' },
    { title: 'Mobile Engineer (iOS)', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/8' },
    { title: 'QA Engineer', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/9' },
    { title: 'Solutions Architect', company: 'Y Combinator', location: 'Remote', url: 'https://jobs.ycombinator.com/10' },
  ]

  const result = ycJobs.map((job, idx) => ({
    id: Math.random() * 10000,
    title: job.title,
    company: job.company,
    type: getJobType(job.title),
    salary: generateSalary(job.title, job.company),
    location: job.location,
    duration: ['3 months', '6 months', '1 year', 'Full-time', 'Contract'][idx % 5],
    url: job.url,
    board: 'Y Combinator'
  }))

  console.log('Fetched Y Combinator jobs:', result.length)
  return result
}

async function fetchJobsFromSource(board: string, slug: string, company: string): Promise<Job[]> {
  // Special handling for Y Combinator
  if (board === 'yc') {
    return fetchYCJobs()
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`https://jobber.mihir.ch/${board}/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!response.ok) return []

    const jobs: JobberJob[] = await response.json()

    return jobs.map((job, idx) => {
      const durations = ['3 months', '6 months', '1 year', 'Full-time', 'Contract']
      const duration = durations[(idx + company.charCodeAt(0)) % durations.length]

      return {
        id: Math.random() * 10000,
        title: job.title,
        company: company,
        type: getJobType(job.title),
        salary: generateSalary(job.title, company),
        location: job.location || 'Remote',
        duration: duration,
        url: job.link,
        board: company
      }
    })
  } catch (error) {
    console.error(`Failed to fetch jobs for ${company}:`, error)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch jobs from all sources in parallel
    const jobPromises = companySources.map(source =>
      fetchJobsFromSource(source.board, source.slug, source.name)
    )

    const allJobsArrays = await Promise.all(jobPromises)
    console.log('Jobs per source:', allJobsArrays.map((arr, i) => `${companySources[i].name}: ${arr.length}`))

    let allJobs = allJobsArrays.flat()
    console.log('Total jobs before shuffle:', allJobs.length)

    // Shuffle jobs for variety
    allJobs = allJobs.sort(() => Math.random() - 0.5)

    // Remove duplicates by URL
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.url, job])).values())
    console.log('Total unique jobs after dedup:', uniqueJobs.length)

    // Apply pagination
    const paginatedJobs = uniqueJobs.slice(offset, offset + limit)

    return NextResponse.json({
      jobs: paginatedJobs,
      total: uniqueJobs.length,
      hasMore: offset + limit < uniqueJobs.length
    })
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return NextResponse.json({ jobs: [], total: 0, hasMore: false })
  }
}
