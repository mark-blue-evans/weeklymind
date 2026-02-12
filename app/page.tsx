'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Brain,
  ChevronDown,
  Download,
  FileDown,
  Share2,
  Circle,
  CircleDot,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react'

type Tab = 'weekly' | 'mental'

interface WeeklyEntry {
  id: string
  date: string
  weekNumber: string
  highlight: string
  challenge: string
  gratitude: string
  mood: number
}

interface MentalEntry {
  id: string
  date: string
  mood: number
  anxiety: number
  energy: number
  thoughts: string
  triggers: string
  coping: string
}

const ENTRIES_PER_PAGE = 5

// Custom mood icons - Apple SF Symbols style
const MoodDot = ({ level }: { level: number }) => {
  const colors = ['#b0b0b5', '#b0b0b5', '#86868b', '#86868b', '#1d1d1d']
  const sizes = [18, 20, 22, 24, 26]
  
  if (level <= 1) {
    return (
      <Circle 
        size={sizes[level]} 
        strokeWidth={1.5} 
        className="transition-all duration-300"
        style={{ color: colors[level] }}
      />
    )
  }
  if (level === 2) {
    return (
      <Circle 
        size={24} 
        strokeWidth={1.5} 
        className="transition-all duration-300"
        style={{ color: '#86868b' }}
      />
    )
  }
  return (
    <CircleDot 
      size={sizes[level]} 
      strokeWidth={1.5}
      className="transition-all duration-300"
      style={{ color: colors[level] }}
    />
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  const [weeklyPage, setWeeklyPage] = useState(1)
  const [mentalPage, setMentalPage] = useState(1)
  
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setSearchQuery('')
    setWeeklyPage(1)
    setMentalPage(1)
  }
  
  // Weekly state
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyEntry[]>([])
  const [currentHighlight, setCurrentHighlight] = useState('')
  const [currentChallenge, setCurrentChallenge] = useState('')
  const [currentGratitude, setCurrentGratitude] = useState('')
  const [currentMood, setCurrentMood] = useState(2)
  const [showWeeklySuccess, setShowWeeklySuccess] = useState(false)
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  
  // Mental wellness state
  const [mentalEntries, setMentalEntries] = useState<MentalEntry[]>([])
  const [mentalMood, setMentalMood] = useState(2)
  const [anxietyLevel, setAnxietyLevel] = useState(2)
  const [energyLevel, setEnergyLevel] = useState(2)
  const [currentThoughts, setCurrentThoughts] = useState('')
  const [currentTriggers, setCurrentTriggers] = useState('')
  const [currentCoping, setCurrentCoping] = useState('')
  const [showMentalSuccess, setShowMentalSuccess] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [shareCount, setShareCount] = useState(0)
  const [shareToast, setShareToast] = useState(false)
  const [expandedMentalId, setExpandedMentalId] = useState<string | null>(null)
  
  // Load from localStorage
  useEffect(() => {
    const savedWeekly = localStorage.getItem('weeklymind_weekly')
    if (savedWeekly) {
      setWeeklyEntries(JSON.parse(savedWeekly))
    }
    
    const savedMental = localStorage.getItem('weeklymind_mental')
    if (savedMental) {
      setMentalEntries(JSON.parse(savedMental))
    }
  }, [])
  
  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('weeklymind_weekly', JSON.stringify(weeklyEntries))
    localStorage.setItem('weeklymind_mental', JSON.stringify(mentalEntries))
  }, [weeklyEntries, mentalEntries])
  
  // Load share count
  useEffect(() => {
    const savedShareCount = localStorage.getItem('weeklymind_share_count')
    if (savedShareCount) {
      setShareCount(parseInt(savedShareCount))
    }
  }, [])
  
  // Save share count
  useEffect(() => {
    localStorage.setItem('weeklymind_share_count', shareCount.toString())
  }, [shareCount])
  
  const getWeekNumber = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const diff = now.getTime() - start.getTime()
    const oneWeek = 604800000
    return Math.floor(diff / oneWeek) + 1
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  }
  
  const saveWeeklyEntry = () => {
    if (!currentHighlight && !currentChallenge && !currentGratitude) return
    
    const entry: WeeklyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weekNumber: `Week ${getWeekNumber()}`,
      highlight: currentHighlight,
      challenge: currentChallenge,
      gratitude: currentGratitude,
      mood: currentMood,
    }
    
    setWeeklyEntries([entry, ...weeklyEntries])
    setCurrentHighlight('')
    setCurrentChallenge('')
    setCurrentGratitude('')
    setCurrentMood(2)
    setWeeklyPage(1)
    setShowWeeklySuccess(true)
    setTimeout(() => setShowWeeklySuccess(false), 3000)
  }
  
  const saveMentalEntry = () => {
    if (!currentThoughts && !currentTriggers && !currentCoping) return
    
    const entry: MentalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: mentalMood,
      anxiety: anxietyLevel,
      energy: energyLevel,
      thoughts: currentThoughts,
      triggers: currentTriggers,
      coping: currentCoping,
    }
    
    setMentalEntries([entry, ...mentalEntries])
    setMentalMood(2)
    setAnxietyLevel(2)
    setEnergyLevel(2)
    setCurrentThoughts('')
    setCurrentTriggers('')
    setCurrentCoping('')
    setMentalPage(1)
    setShowMentalSuccess(true)
    setTimeout(() => setShowMentalSuccess(false), 3000)
  }
  
  const deleteEntry = (id: string, type: 'weekly' | 'mental') => {
    if (type === 'weekly') {
      setWeeklyEntries(weeklyEntries.filter(e => e.id !== id))
    } else {
      setMentalEntries(mentalEntries.filter(e => e.id !== id))
    }
  }
  
  const exportData = (format: 'json' | 'pdf' = 'json') => {
    if (format === 'pdf' && typeof window !== 'undefined') {
      // Simple text-based PDF export
      let content = 'WEEKLYMIND - Your Wellness Journey\n'
      content += 'Exported: ' + new Date().toLocaleDateString() + '\n\n'
      
      content += '=== WEEKLY CHECK-INS ===\n\n'
      weeklyEntries.slice(0, 10).forEach((entry) => {
        content += `Week: ${entry.weekNumber}\n`
        content += `Date: ${entry.date.split('T')[0]}\n`
        content += `Highlight: ${entry.highlight || '-'}\n`
        content += `Challenge: ${entry.challenge || '-'}\n`
        content += `Gratitude: ${entry.gratitude || '-'}\n`
        content += `Mood: ${entry.mood >= 3 ? 'Positive' : entry.mood >= 2 ? 'Neutral' : 'Difficult'}\n`
        content += '\n'
      })
      
      content += '\n=== MENTAL WELLNESS CHECK-INS ===\n\n'
      mentalEntries.slice(0, 10).forEach((entry) => {
        content += `Date: ${entry.date.split('T')[0]}\n`
        content += `Mood: ${entry.mood >= 3 ? 'Good' : entry.mood >= 2 ? 'Okay' : 'Tough'}\n`
        content += `Anxiety: ${entry.anxiety >= 3 ? 'High' : entry.anxiety >= 2 ? 'Moderate' : 'Low'}\n`
        content += `Energy: ${entry.energy >= 3 ? 'High' : entry.energy >= 2 ? 'Moderate' : 'Low'}\n`
        content += '\n'
      })
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'weeklymind-export.txt'
      link.click()
      return
    }
    
    // Default JSON export
    const data = {
      weekly: weeklyEntries,
      mental: mentalEntries,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'weeklymind-data.json'
    link.click()
  }

  // Share functionality
  const shareWeeklyMind = async () => {
    const shareText = 'WeeklyMind - Simple, private mental wellness check-in. 3 questions weekly. 100% private.'
    const shareUrl = 'https://weeklymind.vercel.app'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WeeklyMind',
          text: shareText,
          url: shareUrl
        })
        incrementShareCount()
      } catch (err) {
        // User cancelled or error
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText('https://weeklymind.vercel.app')
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2000)
    incrementShareCount()
  }

  const incrementShareCount = () => {
    setShareCount(prev => prev + 1)
  }

  const filteredWeekly = weeklyEntries.filter(e => 
    !searchQuery || 
    e.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.gratitude.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMental = mentalEntries.filter(e => 
    !searchQuery || 
    e.thoughts.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const weeklyTotalPages = Math.ceil(filteredWeekly.length / ENTRIES_PER_PAGE)
  const mentalTotalPages = Math.ceil(filteredMental.length / ENTRIES_PER_PAGE)

  const paginatedWeekly = filteredWeekly.slice(
    (weeklyPage - 1) * ENTRIES_PER_PAGE,
    weeklyPage * ENTRIES_PER_PAGE
  )

  const paginatedMental = filteredMental.slice(
    (mentalPage - 1) * ENTRIES_PER_PAGE,
    mentalPage * ENTRIES_PER_PAGE
  )

  const moodLabels = ['Tough', 'Difficult', 'Okay', 'Good', 'Great']

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header - Apple style */}
      <header className="pt-14 pb-6 px-6 max-w-lg mx-auto">
        <h1 className="text-[44px] font-semibold tracking-tight text-[#1d1d1d]">
          WeeklyMind
        </h1>
      </header>
      
      {/* Subtitle */}
      <div className="px-6 max-w-lg mx-auto mb-10">
        <p className="text-[17px] font-normal text-[#86868b]">
          Your private wellness space
        </p>
      </div>
      
      {/* Tabs - iOS Segmented Control */}
      <div className="px-6 max-w-lg mx-auto mb-12">
        <div className="flex gap-0 bg-[#e8e8ed] p-0.5 rounded-[10px] w-fit">
          <button
            onClick={() => switchTab('weekly')}
            className={`px-6 py-1.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === 'weekly' 
                ? 'bg-white text-[#1d1d1d] shadow-sm' 
                : 'text-[#86868b] hover:text-[#1d1d1d]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => switchTab('mental')}
            className={`px-6 py-1.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === 'mental' 
                ? 'bg-white text-[#1d1d1d] shadow-sm' 
                : 'text-[#86868b] hover:text-[#1d1d1d]'
            }`}
          >
            Wellness
          </button>
        </div>
      </div>
      
      {/* Weekly Tab */}
      {activeTab === 'weekly' && (
        <main className="max-w-lg mx-auto px-6 pb-24 animate-fadeIn">
          {/* Section header */}
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold text-[#1d1d1d]">
              Weekly Check-in
            </h2>
          </div>
          
          {/* Form - Apple style inputs */}
          <div className="mb-8">
            <div className="space-y-4">
              {/* Highlight */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  What was your highlight?
                </label>
                <textarea
                  placeholder="Something good that happened..."
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Challenge */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  What was challenging?
                </label>
                <textarea
                  placeholder="Something that was hard..."
                  value={currentChallenge}
                  onChange={(e) => setCurrentChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Gratitude */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  What are you grateful for?
                </label>
                <textarea
                  placeholder="Something positive to focus on..."
                  value={currentGratitude}
                  onChange={(e) => setCurrentGratitude(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Mood picker */}
              <div className="py-2">
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-3 text-center">
                  How was your week?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentMood(i)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ${
                        currentMood === i
                          ? 'bg-[#1d1d1d]'
                          : 'hover:bg-[#f0f0f0]'
                      }`}
                    >
                      <MoodDot level={i} />
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-[#86868b] text-center mt-3">
                  {moodLabels[currentMood]}
                </p>
              </div>
              
              {/* Save button */}
              <button
                onClick={saveWeeklyEntry}
                disabled={!currentHighlight && !currentChallenge && !currentGratitude}
                className="w-full py-3 bg-[#1d1d1d] text-white text-[15px] font-medium rounded-[12px] hover:bg-[#333] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success toast - minimal */}
          {showWeeklySuccess && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1d1d1d] text-white px-5 py-3 rounded-[12px] flex items-center gap-2 shadow-lg animate-successPop">
              <Check size={16} />
              <span className="text-[14px] font-medium">Entry saved</span>
            </div>
          )}
          
          {/* Share toast */}
          {shareToast && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1d1d1d] text-white px-5 py-3 rounded-[12px] flex items-center gap-2 shadow-lg animate-successPop">
              <Share2 size={16} />
              <span className="text-[14px] font-medium">Link copied! Share WeeklyMind.</span>
            </div>
          )}
          
          {/* History with pagination */}
          {filteredWeekly.length > 0 && (
            <div className="mt-10">
              {/* Header with count */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1d]">
                  Past Entries
                </h3>
                <span className="text-[13px] text-[#86868b]">
                  {filteredWeekly.length} total
                </span>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setWeeklyPage(1)
                  }}
                  className="w-full px-4 py-2.5 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[14px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              {/* Entries list */}
              <div className="space-y-3">
                {paginatedWeekly.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[16px] p-4 cursor-pointer hover:bg-[#fafafa] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" animate-fadeInUp
                    onClick={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#1d1d1d]">{entry.weekNumber}</span>
                        <span className="text-[12px] text-[#86868b]">{formatDate(entry.date)}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f5f5f5]">
                        <MoodDot level={entry.mood} />
                      </div>
                    </div>
                    
                    {entry.highlight && expandedEntryId !== entry.id && (
                      <p className="text-[14px] text-[#1d1d1d] line-clamp-2">
                        <span className="font-medium">Highlight:</span> {entry.highlight}
                      </p>
                    )}
                    
                    {/* Expanded view */}
                    {expandedEntryId === entry.id && (
                      <div className="mt-3 pt-3 border-t border-[#f0f0f0] space-y-2">
                        {entry.highlight && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">Highlight</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.highlight}</p>
                          </div>
                        )}
                        {entry.challenge && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">Challenging</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.challenge}</p>
                          </div>
                        )}
                        {entry.gratitude && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">Grateful</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.gratitude}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[12px] text-[#86868b]">{moodLabels[entry.mood]}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'weekly')
                            }}
                            className="text-[12px] text-[#86868b] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {weeklyTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setWeeklyPage(Math.max(1, weeklyPage - 1))}
                    disabled={weeklyPage === 1}
                    className="p-2 rounded-full hover:bg-[#f0f0f0] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} className="text-[#86868b]" />
                  </button>
                  <span className="text-[13px] text-[#86868b]">
                    {weeklyPage} of {weeklyTotalPages}
                  </span>
                  <button
                    onClick={() => setWeeklyPage(Math.min(weeklyTotalPages, weeklyPage + 1))}
                    disabled={weeklyPage === weeklyTotalPages}
                    className="p-2 rounded-full hover:bg-[#f0f0f0] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} className="text-[#86868b]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}
      
      {/* Mental Wellness Tab */}
      {activeTab === 'mental' && (
        <main className="max-w-lg mx-auto px-6 pb-24 animate-fadeIn">
          <div className="mb-6">
            <h2 className="text-[22px] font-semibold text-[#1d1d1d]">
              Mental Wellness
            </h2>
          </div>
          
          <div className="mb-8">
            <div className="space-y-4">
              {/* Mood */}
              <div className="py-2">
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-3 text-center">
                  How are you feeling?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={() => setMentalMood(i)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ${
                        mentalMood === i
                          ? 'bg-[#1d1d1d]'
                          : 'hover:bg-[#f0f0f0]'
                      }`}
                    >
                      <MoodDot level={i} />
                    </button>
                  ))}
                </div>
                <p className="text-[13px] text-[#86868b] text-center mt-3">
                  {moodLabels[mentalMood]}
                </p>
              </div>
              
              {/* Thoughts */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  What&apos;s on your mind?
                </label>
                <textarea
                  placeholder="Thoughts, worries, or whatever's there..."
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Triggers */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  Any triggers or stressors?
                </label>
                <textarea
                  placeholder="What might be affecting how you feel?"
                  value={currentTriggers}
                  onChange={(e) => setCurrentTriggers(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Coping */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2">
                  What helps?
                </label>
                <textarea
                  placeholder="Things that make you feel better..."
                  value={currentCoping}
                  onChange={(e) => setCurrentCoping(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <button
                onClick={saveMentalEntry}
                disabled={!currentThoughts && !currentTriggers && !currentCoping}
                className="w-full py-3 bg-[#1d1d1d] text-white text-[15px] font-medium rounded-[12px] hover:bg-[#333] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success toast */}
          {showMentalSuccess && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1d1d1d] text-white px-5 py-3 rounded-[12px] flex items-center gap-2 shadow-lg animate-successPop">
              <Check size={16} />
              <span className="text-[14px] font-medium">Entry saved</span>
            </div>
          )}
          
          {/* History with pagination */}
          {filteredMental.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-semibold text-[#1d1d1d]">
                  Past Entries
                </h3>
                <span className="text-[13px] text-[#86868b]">
                  {filteredMental.length} total
                </span>
              </div>
              
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setMentalPage(1)
                  }}
                  className="w-full px-4 py-2.5 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[14px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                {paginatedMental.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[16px] p-4 cursor-pointer hover:bg-[#fafafa] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300" animate-fadeInUp
                    onClick={() => setExpandedMentalId(expandedMentalId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-[#86868b]">{formatDate(entry.date)}</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f5f5f5]">
                        <MoodDot level={entry.mood} />
                      </div>
                    </div>
                    
                    {entry.thoughts && (
                      <p className="text-[14px] text-[#1d1d1d] line-clamp-2">
                        {entry.thoughts}
                      </p>
                    )}
                    
                    {expandedMentalId === entry.id && (
                      <div className="mt-3 pt-3 border-t border-[#f0f0f0] space-y-2">
                        {entry.thoughts && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">On My Mind</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.thoughts}</p>
                          </div>
                        )}
                        {entry.triggers && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">Triggers</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.triggers}</p>
                          </div>
                        )}
                        {entry.coping && (
                          <div>
                            <p className="text-[11px] font-medium text-[#86868b] uppercase">What Helps</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.coping}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[12px] text-[#86868b]">{moodLabels[entry.mood]}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'mental')
                            }}
                            className="text-[12px] text-[#86868b] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {mentalTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setMentalPage(Math.max(1, mentalPage - 1))}
                    disabled={mentalPage === 1}
                    className="p-2 rounded-full hover:bg-[#f0f0f0] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} className="text-[#86868b]" />
                  </button>
                  <span className="text-[13px] text-[#86868b]">
                    {mentalPage} of {mentalTotalPages}
                  </span>
                  <button
                    onClick={() => setMentalPage(Math.min(mentalTotalPages, mentalPage + 1))}
                    disabled={mentalPage === mentalTotalPages}
                    className="p-2 rounded-full hover:bg-[#f0f0f0] hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} className="text-[#86868b]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      )}
      
      {/* Footer */}
      <footer className="max-w-lg mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#b0b0b5]">
            WeeklyMind © 2026
          </p>
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button 
              onClick={shareWeeklyMind}
              className="text-[12px] text-[#86868b] hover:text-[#1d1d1d] flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#e8e8ed] transition-all"
            >
              <Share2 size={14} />
              {shareCount > 0 ? `Shared ${shareCount}x` : 'Share'}
            </button>
            
            {/* Export Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="text-[12px] text-[#86868b] hover:text-[#1d1d1d] flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#e8e8ed] transition-all"
              >
                <Download size={14} />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute bottom-full right-0 mb-1 bg-white rounded-lg shadow-lg border border-[#e5e5e7] py-1 min-w-[120px] animate-scaleIn z-50">
                  <button 
                    onClick={() => { exportData('json'); setShowExportMenu(false); }}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-2"
                  >
                    <FileDown size={14} />
                    JSON (Data)
                  </button>
                  <button 
                    onClick={() => { exportData('pdf'); setShowExportMenu(false); }}
                    className="w-full px-4 py-2 text-left text-[13px] hover:bg-[#f5f5f5] transition-colors flex items-center gap-2"
                  >
                    <FileDown size={14} />
                    Text (Summary)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
// Force redeploy
