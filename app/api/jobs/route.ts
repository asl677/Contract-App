import { NextResponse } from 'next/server'

// Companies and their job boards for fetching real positions
// Only sources that actually have job listings
const companySources = [
  { name: 'Figma', board: 'greenhouse', slug: 'figma' },
  { name: 'Airbnb', board: 'greenhouse', slug: 'airbnb' },
  { name: 'Dropbox', board: 'greenhouse', slug: 'dropbox' },
  { name: 'Asana', board: 'greenhouse', slug: 'asana' },
  { name: 'Stripe', board: 'greenhouse', slug: 'stripe' },
  { name: 'Notion', board: 'greenhouse', slug: 'notion' },
  { name: 'GitLab', board: 'greenhouse', slug: 'gitlab' },
  { name: 'Vercel', board: 'greenhouse', slug: 'vercel' },
  { name: 'Linear', board: 'greenhouse', slug: 'linear' },
  { name: 'Retool', board: 'greenhouse', slug: 'retool' },
  { name: 'Zapier', board: 'greenhouse', slug: 'zapier' },
  { name: 'Loom', board: 'greenhouse', slug: 'loom' },
  { name: 'Intercom', board: 'greenhouse', slug: 'intercom' },
  { name: 'Datadog', board: 'greenhouse', slug: 'datadog' },
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
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    // Fetch job story IDs from HackerNews API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error('Failed to fetch from HN')
    }

    const jobIds: number[] = await response.json()
    const jobsToFetch = jobIds.slice(0, 100) // Fetch first 100 job IDs to get more YC results

    // Fetch individual job details in parallel
    const jobDetails = await Promise.all(
      jobsToFetch.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        })
          .then(r => r.json())
          .catch(() => null)
      )
    )

    // Filter and map Y Combinator company jobs (look for ycombinator.com URLs or YC indicators in title)
    const ycJobs = jobDetails
      .filter((job): job is any => {
        if (!job || !job.title) return false
        const titleLower = job.title.toLowerCase()
        // Match: ycombinator.com URLs, "(YC ...)" in title, "yc " anywhere, or "y combinator"
        return (
          job.url?.includes('ycombinator.com') ||
          titleLower.includes('(yc ') ||
          titleLower.includes('yc ') ||
          titleLower.includes('y combinator')
        )
      })
      .slice(0, 50) // Get up to 50 real YC jobs
      .map((job) => {
        // Extract company name from URL or title
        let companyName = 'Y Combinator'
        const urlMatch = job.url?.match(/ycombinator\.com\/companies\/([^/]+)/)
        if (urlMatch) {
          companyName = urlMatch[1].charAt(0).toUpperCase() + urlMatch[1].slice(1).replace(/-/g, ' ')
        }

        return {
          title: job.title || 'Job Opening',
          company: companyName,
          location: 'Remote',
          url: job.url || `https://news.ycombinator.com/item?id=${job.id}`
        }
      })

    if (ycJobs.length === 0) {
      throw new Error('No YC jobs found in HN job feed')
    }

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

    console.log('Fetched Y Combinator jobs from HN:', result.length)
    return result
  } catch (error) {
    console.error('Failed to fetch Y Combinator jobs from HN:', error)

    // Fallback to sample data if API fails (with varied contract types and locations)
    const fallbackJobs = [
      { title: 'Senior Full Stack Engineer at YC Startup', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/1' },
      { title: 'Product Manager at YC Company', company: 'Y Combinator', location: 'San Francisco, CA', url: 'https://news.ycombinator.com/jobs/2' },
      { title: 'Backend Engineer at YC Startup', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/3' },
      { title: 'Frontend Engineer at YC Company', company: 'Y Combinator', location: 'New York, NY', url: 'https://news.ycombinator.com/jobs/4' },
      { title: 'DevOps Engineer at YC Startup', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/5' },
      { title: 'Data Scientist at YC Company', company: 'Y Combinator', location: 'San Francisco, CA', url: 'https://news.ycombinator.com/jobs/6' },
      { title: 'Design Lead at YC Startup', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/7' },
      { title: 'Sales Engineer at YC Company', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/8' },
      { title: 'Solutions Architect at YC Startup', company: 'Y Combinator', location: 'Austin, TX', url: 'https://news.ycombinator.com/jobs/9' },
      { title: 'ML Engineer at YC Company', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/10' },
      { title: 'Platform Engineer at YC Startup', company: 'Y Combinator', location: 'Remote', url: 'https://news.ycombinator.com/jobs/11' },
      { title: 'Security Engineer at YC Company', company: 'Y Combinator', location: 'San Francisco, CA', url: 'https://news.ycombinator.com/jobs/12' },
    ]

    const fallbackResult = fallbackJobs.map((job, idx) => ({
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

    console.log('Fallback Y Combinator jobs count:', fallbackResult.length)
    return fallbackResult
  }
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

    // Debug: Check Y Combinator jobs BEFORE shuffle
    const ycJobsBeforeShuffle = allJobs.filter(j => j.board === 'Y Combinator')
    console.log('Y Combinator jobs before shuffle:', ycJobsBeforeShuffle.length)
    if (ycJobsBeforeShuffle.length > 0) {
      console.log('Sample YC job:', ycJobsBeforeShuffle[0])
    }

    // Shuffle jobs for variety
    allJobs = allJobs.sort(() => Math.random() - 0.5)

    // Check Y Combinator jobs AFTER shuffle but BEFORE dedup
    const ycJobsAfterShuffle = allJobs.filter(j => j.board === 'Y Combinator')
    console.log('Y Combinator jobs after shuffle:', ycJobsAfterShuffle.length)

    // Remove duplicates by URL
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.url, job])).values())
    console.log('Total unique jobs after dedup:', uniqueJobs.length)

    // Check Y Combinator jobs AFTER dedup
    const ycJobsAfterDedup = uniqueJobs.filter(j => j.board === 'Y Combinator')
    console.log('Y Combinator jobs after dedup:', ycJobsAfterDedup.length)

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
