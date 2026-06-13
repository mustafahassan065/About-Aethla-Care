'use client'

import { useState } from 'react'
import apiClient from '@/lib/api'
import { PageHeader, StatusBadge, Avatar } from '@/components/ui/index'
import toast from 'react-hot-toast'

const serviceOptions = [
  { value: 'elderly',    label: 'Elderly Care' },
  { value: 'disability', label: 'Disability Support' },
  { value: 'newborn',    label: 'Newborn Baby Care' },
  { value: 'maternity',  label: 'Maternity Care' },
  { value: 'wellness',   label: 'Home Wellness' },
  { value: 'telehealth', label: 'Telehealth Support' },
  { value: 'navigation', label: 'Patient Navigation' },
]

const languageOptions = [
  { value: 'Arabic',    label: 'Arabic' },
  { value: 'English',   label: 'English' },
  { value: 'Tagalog',   label: 'Tagalog' },
  { value: 'Hindi',     label: 'Hindi' },
  { value: 'Urdu',      label: 'Urdu' },
  { value: 'Malayalam', label: 'Malayalam' },
]

interface MatchResult {
  caregiver: any
  matchScore: number
}

export default function MatchingPage() {
  const [form, setForm] = useState({
    careType: '',
    languages: [] as string[],
    genderPreference: 'any',
    location: '',
    experience: '',
  })
  const [results, setResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const toggleLanguage = (lang: string) => {
    setForm(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang],
    }))
  }

  const handleMatch = async () => {
    if (!form.careType) { toast.error('Please select a care type'); return }
    setLoading(true)
    setSearched(false)
    try {
      const res = await apiClient.post('/caregivers/match', {
        careType: form.careType,
        languages: form.languages.length > 0 ? form.languages : undefined,
        genderPreference: form.genderPreference !== 'any' ? form.genderPreference : undefined,
        experience: form.experience ? parseInt(form.experience) : undefined,
      })
      setResults(res.data)
      setSearched(true)
      if (res.data.length === 0) {
        toast('No matches found. Try adjusting your criteria.', { icon: 'ℹ️' })
      }
    } catch {
      toast.error('Matching failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#2DA88A'
    if (score >= 75) return '#1B6B8A'
    return '#C9A84C'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 75) return 'Good Match'
    return 'Possible Match'
  }

  return (
    <div>
      <PageHeader
        title="Caregiver Matching"
        subtitle="Find the most suitable caregiver for a client based on care type, language, and preferences"
      />

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Criteria Form */}
        <div className="space-y-5">
          <div className="card p-6">
            <h3 className="text-heading-md font-poppins mb-5">Matching Criteria</h3>

            <div className="space-y-4">
              {/* Care Type */}
              <div>
                <label className="form-label">Care Type Required <span className="text-red-500">*</span></label>
                <select
                  value={form.careType}
                  onChange={e => set('careType', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select care type...</option>
                  {serviceOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="form-label">Language Preference</label>
                <p className="text-caption text-neutral-400 mb-2">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map(l => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => toggleLanguage(l.value)}
                      className={`px-3 py-1.5 rounded-lg text-caption font-semibold transition-all border ${
                        form.languages.includes(l.value)
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="form-label">Caregiver Gender</label>
                <select
                  value={form.genderPreference}
                  onChange={e => set('genderPreference', e.target.value)}
                  className="form-input"
                >
                  <option value="any">No Preference</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              {/* Minimum Experience */}
              <div>
                <label className="form-label">Minimum Experience (years)</label>
                <select
                  value={form.experience}
                  onChange={e => set('experience', e.target.value)}
                  className="form-input"
                >
                  <option value="">Any experience level</option>
                  <option value="1">1+ years</option>
                  <option value="2">2+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={loading}
              className="btn-primary btn-lg w-full mt-5"
            >
              {loading ? 'Finding Matches...' : 'Find Matching Caregivers'}
            </button>
          </div>

          {/* How Matching Works */}
          <div className="card p-5">
            <h4 className="text-heading-sm font-poppins mb-3">How Matching Works</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { factor: 'Care Type',    weight: 'Primary factor' },
                { factor: 'Language',     weight: 'High priority' },
                { factor: 'Gender',       weight: 'When specified' },
                { factor: 'Experience',   weight: 'Minimum threshold' },
                { factor: 'Availability', weight: 'Active status only' },
                { factor: 'Rating',       weight: 'Sorts results' },
              ].map(f => (
                <div key={f.factor} className="flex justify-between text-body-sm">
                  <span className="text-neutral-700 font-medium">{f.factor}</span>
                  <span className="text-neutral-400">{f.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {!searched && !loading && (
            <div className="card p-16 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-light)' }}>
                <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-heading-lg font-poppins text-neutral-700 mb-2">Enter Matching Criteria</h3>
              <p className="text-body-sm text-neutral-400 max-w-xs">Select the care type and any preferences, then click Find to see matched caregivers ranked by compatibility.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="card p-16 text-center">
              <h3 className="text-heading-lg font-poppins text-neutral-600 mb-2">No Matches Found</h3>
              <p className="text-body-sm text-neutral-400">Try removing some filters or adding more caregivers to the system.</p>
            </div>
          )}

          {searched && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-body-sm text-neutral-500">
                  <strong className="text-neutral-800">{results.length}</strong> caregivers matched
                </p>
                <p className="text-caption text-neutral-400">Sorted by compatibility score</p>
              </div>

              {results.map((match, i) => {
                const cg = match.caregiver
                const user = cg.userId
                const score = match.matchScore

                return (
                  <div key={cg._id} className="card p-5">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold text-white flex-shrink-0"
                        style={{ background: i === 0 ? '#2DA88A' : i === 1 ? '#1B6B8A' : '#94A3B8' }}>
                        {i + 1}
                      </div>

                      {/* Caregiver Info */}
                      <Avatar name={`${user?.firstName || 'U'} ${user?.lastName || ''}`} size="lg" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-heading-md font-poppins text-neutral-800">
                              {user?.firstName} {user?.lastName}
                            </h4>
                            <p className="text-body-sm text-neutral-500 mt-0.5">
                              {cg.specializations?.join(', ')} &middot; {cg.experience || 0} years exp.
                            </p>
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-extrabold font-poppins" style={{ color: getScoreColor(score) }}>
                              {score}%
                            </div>
                            <p className="text-caption" style={{ color: getScoreColor(score) }}>
                              {getScoreLabel(score)}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div>
                            <p className="text-caption text-neutral-400 mb-1">Languages</p>
                            <div className="flex flex-wrap gap-1">
                              {cg.languages?.map((l: string) => (
                                <span key={l} className="badge text-xs">{l}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-caption text-neutral-400 mb-1">Rating</p>
                            <p className="text-body-sm font-semibold text-neutral-700">
                              {cg.rating?.toFixed(1) || 'N/A'} / 5.0
                            </p>
                          </div>
                          <div>
                            <p className="text-caption text-neutral-400 mb-1">Hourly Rate</p>
                            <p className="text-body-sm font-semibold text-neutral-700">
                              QAR {cg.hourlyRate || 0}/hr
                            </p>
                          </div>
                          <div>
                            <p className="text-caption text-neutral-400 mb-1">Background</p>
                            <StatusBadge status={cg.backgroundCheckStatus} />
                          </div>
                        </div>

                        {/* Score bar */}
                        <div className="mt-3">
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${score}%`, background: getScoreColor(score) }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <a href={`/admin/staff/${cg._id}`} className="btn-primary btn-sm">
                            View Profile
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(cg._id)
                              toast.success('Caregiver ID copied')
                            }}
                            className="btn-outline btn-sm"
                          >
                            Copy ID
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}