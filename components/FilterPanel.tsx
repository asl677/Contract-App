'use client'

import { motion, AnimatePresence } from 'framer-motion'
import CustomDropdown from './CustomDropdown'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  search: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  locationFilter: string
  onLocationChange: (value: string) => void
  sourceFilter: string
  onSourceChange: (value: string) => void
  employmentFilter: string
  onEmploymentChange: (value: string) => void
  salaryFilter: string
  onSalaryChange: (value: string) => void
  types: string[]
  locations: string[]
  sources: string[]
  employmentTypes: string[]
  salaries: string[]
}

export default function FilterPanel({
  isOpen,
  onClose,
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  locationFilter,
  onLocationChange,
  sourceFilter,
  onSourceChange,
  employmentFilter,
  onEmploymentChange,
  salaryFilter,
  onSalaryChange,
  types,
  locations,
  sources,
  employmentTypes,
  salaries,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 md:bg-transparent z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 md:inset-auto md:top-0 md:right-0 md:w-96 md:h-screen bg-white md:bg-dark z-50 overflow-y-auto md:border-l md:border-black"
            style={{ right: '-10px' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white md:bg-dark px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-light text-dark md:text-cream">Filters</h2>
              <button
                onClick={onClose}
                className="text-dark/50 md:text-cream/50 hover:text-dark md:hover:text-cream transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-black bg-white text-black placeholder-black/40 focus:outline-none focus:border-black"
                style={{ borderRadius: 0 }}
              />

              {/* Type */}
              <CustomDropdown
                value={typeFilter}
                onChange={onTypeChange}
                options={types}
                displayFormat={(v) => v === 'All' ? 'All Types' : v}
              />

              {/* Location */}
              <CustomDropdown
                value={locationFilter}
                onChange={onLocationChange}
                options={locations}
                displayFormat={(v) => v === 'All' ? 'All Locations' : v}
              />

              {/* Source */}
              <CustomDropdown
                value={sourceFilter}
                onChange={onSourceChange}
                options={sources}
                displayFormat={(v) => v === 'All' ? 'All Sources' : v}
              />

              {/* Employment Type */}
              <CustomDropdown
                value={employmentFilter}
                onChange={onEmploymentChange}
                options={employmentTypes}
                displayFormat={(v) => v === 'All' ? 'All Types' : v}
              />

              {/* Salary */}
              <CustomDropdown
                value={salaryFilter}
                onChange={onSalaryChange}
                options={salaries}
                displayFormat={(v) => v === 'All' ? 'All Ranges' : v}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
