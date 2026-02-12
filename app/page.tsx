'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Brain,
  ChevronDown,
  Download,
  Heart,
  Circle,
  CircleDot
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

// Custom mood icons - Apple SF Symbols style
const MoodIcon = ({ level }: { level: number }) => {
  // 0=low, 1=low-mid, 2=mid, 3=mid-high, 4=high
  const colors = ['#9ca3af', '#9ca3af', '#6b7280', '#6b7280', '#1a1a1a']
  const sizes = [20, 22, 24, 26, 28]
  
  if (level <= 1) {
    return (
      <Circle 
        size={sizes[level]} 
        strokeWidth={2} 
        className="transition-all duration-500"
        style={{ color: colors[level], opacity: 0.5 + level * 0.15 }}
      />
    )
  }
  if (level === 2) {
    return (
      <Circle 
        size={24} 
        strokeWidth={2} 
        className="transition-all duration-500"
        style={{ color: '#6b7280' }}
      />
    )
  }
  return (
    <CircleDot 
      size={sizes[level]} 
      strokeWidth={2}
      className="transition-all duration-500"
      style={{ color: colors[level] }}
    />
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setSearchQuery('')
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
    setShowWeeklySuccess(true)
    setTimeout(() => setShowWeeklySuccess(false), 4000)
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
    setShowMentalSuccess(true)
    setTimeout(() => setShowMentalSuccess(false), 4000)
  }
  
  const deleteEntry = (id: string, type: 'weekly' | 'mental') => {
    if (type === 'weekly') {
      setWeeklyEntries(weeklyEntries.filter(e => e.id !== id))
    } else {
      setMentalEntries(mentalEntries.filter(e => e.id !== id))
    }
  }
  
  const exportData = () => {
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

  const filteredWeekly = weeklyEntries.filter(e => 
    !searchQuery || 
    e.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.gratitude.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMental = mentalEntries.filter(e => 
    !searchQuery || 
    e.thoughts.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const moodLabels = ['Tough', 'Difficult', 'Okay', 'Good', 'Great']

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafafa] via-[#fafafa] to-[#f5f5f5]">
      {/* Header */}
      <header className="pt-16 pb-8 px-8 max-w-xl mx-auto">
        <h1 className="text-[48px] font-light tracking-tight text-[#1d1d1d] mb-1">
          WeeklyMind
        </h1>
        <p className="text-[16px] font-light text-[#86868b]">
          Your private wellness space
        </p>
      </header>
      
      {/* Tabs */}
      <div className="max-w-xl mx-auto px-8 mb-12">
        <div className="flex gap-0.5 bg-[#e8e8ed] p-0.5 rounded-full w-fit">
          <button
            onClick={() => switchTab('weekly')}
            className={`px-7 py-2 rounded-full text-[14px] font-medium transition-all duration-500 ${
              activeTab === 'weekly' 
                ? 'bg-white text-[#1d1d1d] shadow-sm' 
                : 'text-[#86868b] hover:text-[#1d1d1d]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => switchTab('mental')}
            className={`px-7 py-2 rounded-full text-[14px] font-medium transition-all duration-500 ${
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
        <main className="max-w-xl mx-auto px-8 pb-24 animate-fadeIn">
          {/* Intro */}
          <div className="mb-10">
            <h2 className="text-[24px] font-light text-[#1d1d1d] mb-2">
              Weekly Check-in
            </h2>
            <p className="text-[15px] font-light text-[#86868b] leading-relaxed max-w-md">
              Take a moment to reflect on your week. Three simple questions to help you pause and notice what mattered.
            </p>
          </div>
          
          {/* Form */}
          <div className="mb-10">
            <div className="space-y-5">
              {/* Highlight */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  What was your highlight?
                </label>
                <textarea
                  placeholder="Something good that happened..."
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Challenge */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  What was challenging?
                </label>
                <textarea
                  placeholder="Something that was hard..."
                  value={currentChallenge}
                  onChange={(e) => setCurrentChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Gratitude */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  What are you grateful for?
                </label>
                <textarea
                  placeholder="Something positive to focus on..."
                  value={currentGratitude}
                  onChange={(e) => setCurrentGratitude(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Mood */}
              <div className="pt-3">
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-4 text-center">
                  How was your week?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentMood(i)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        currentMood === i
                          ? 'bg-[#1d1d1d]'
                          : 'hover:bg-[#f0f0f0]'
                      }`}
                    >
                      <MoodIcon level={i} />
                    </button>
                  ))}
                </div>
                <p className="text-[12px] text-[#86868b] text-center mt-3">
                  {moodLabels[currentMood]}
                </p>
              </div>
              
              <button
                onClick={saveWeeklyEntry}
                disabled={!currentHighlight && !currentChallenge && !currentGratitude}
                className="w-full py-3.5 bg-[#1d1d1d] text-white text-[15px] font-medium rounded-[14px] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showWeeklySuccess && (
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-[14px] px-4 py-3 mb-8 flex items-center gap-3 animate-fadeIn">
              <span className="text-[16px]">✓</span>
              <p className="text-[14px] font-medium text-[#2e7d32]">Entry saved. See you next week.</p>
            </div>
          )}
          
          {/* History */}
          {weeklyEntries.length > 0 && (
            <div className="mb-8">
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[14px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredWeekly.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[18px] p-5 cursor-pointer hover:shadow-sm transition-all duration-500"
                    onClick={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#1d1d1d]">{entry.weekNumber}</span>
                        <span className="text-[12px] text-[#86868b]">{formatDate(entry.date)}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f5f5f5]">
                        <MoodIcon level={entry.mood} />
                      </div>
                    </div>
                    
                    {entry.highlight && (
                      <p className="text-[14px] text-[#1d1d1d] line-clamp-2">
                        <span className="font-medium">Highlight:</span> {entry.highlight}
                      </p>
                    )}
                    
                    {expandedEntryId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-3 animate-fadeIn">
                        {entry.highlight && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Highlight</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.highlight}</p>
                          </div>
                        )}
                        {entry.challenge && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Challenging</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.challenge}</p>
                          </div>
                        )}
                        {entry.gratitude && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Grateful</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.gratitude}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[12px] text-[#86868b]">Mood: {moodLabels[entry.mood]}</span>
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
                    
                    {!expandedEntryId && (entry.challenge || entry.gratitude) && (
                      <div className="mt-2 text-[12px] text-[#86868b] flex items-center gap-1">
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>See more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
      
      {/* Mental Wellness Tab */}
      {activeTab === 'mental' && (
        <main className="max-w-xl mx-auto px-8 pb-24 animate-fadeIn">
          {/* Intro */}
          <div className="mb-10">
            <h2 className="text-[24px] font-light text-[#1d1d1d] mb-2">
              Mental Wellness
            </h2>
            <p className="text-[15px] font-light text-[#86868b] leading-relaxed max-w-md">
              A quiet space to process your thoughts and feelings. Everything stays private.
            </p>
          </div>
          
          {/* Form */}
          <div className="mb-10">
            <div className="space-y-5">
              {/* Mood */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-4 text-center">
                  How are you feeling?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      onClick={() => setMentalMood(i)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        mentalMood === i
                          ? 'bg-[#1d1d1d]'
                          : 'hover:bg-[#f0f0f0]'
                      }`}
                    >
                      <MoodIcon level={i} />
                    </button>
                  ))}
                </div>
                <p className="text-[12px] text-[#86868b] text-center mt-3">
                  {moodLabels[mentalMood]}
                </p>
              </div>
              
              {/* Thoughts */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  What&apos;s on your mind?
                </label>
                <textarea
                  placeholder="Thoughts, worries, or whatever's there..."
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Triggers */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  Any triggers or stressors?
                </label>
                <textarea
                  placeholder="What might be affecting how you feel?"
                  value={currentTriggers}
                  onChange={(e) => setCurrentTriggers(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Coping */}
              <div>
                <label className="block text-[13px] font-medium text-[#1d1d1d] mb-2.5">
                  What helps?
                </label>
                <textarea
                  placeholder="Things that make you feel better..."
                  value={currentCoping}
                  onChange={(e) => setCurrentCoping(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-white border border-[#e5e5e7] rounded-[14px] text-[15px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <button
                onClick={saveMentalEntry}
                disabled={!currentThoughts && !currentTriggers && !currentCoping}
                className="w-full py-3.5 bg-[#1d1d1d] text-white text-[15px] font-medium rounded-[14px] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showMentalSuccess && (
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-[14px] px-4 py-3 mb-8 flex items-center gap-3 animate-fadeIn">
              <span className="text-[16px]">✓</span>
              <p className="text-[14px] font-medium text-[#2e7d32]">Entry saved. Thank you for checking in.</p>
            </div>
          )}
          
          {/* History */}
          {mentalEntries.length > 0 && (
            <div className="mb-8">
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[14px] text-[#1d1d1d] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredMental.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[18px] p-5 cursor-pointer hover:shadow-sm transition-all duration-500"
                    onClick={() => setExpandedMentalId(expandedMentalId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-[#86868b]">{formatDate(entry.date)}</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#f5f5f5]">
                        <MoodIcon level={entry.mood} />
                      </div>
                    </div>
                    
                    {entry.thoughts && (
                      <p className="text-[14px] text-[#1d1d1d] line-clamp-2">
                        {entry.thoughts}
                      </p>
                    )}
                    
                    {expandedMentalId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-3 animate-fadeIn">
                        {entry.thoughts && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">On My Mind</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.thoughts}</p>
                          </div>
                        )}
                        {entry.triggers && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">Triggers</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.triggers}</p>
                          </div>
                        )}
                        {entry.coping && (
                          <div>
                            <p className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">What Helps</p>
                            <p className="text-[14px] text-[#1d1d1d]">{entry.coping}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[12px] text-[#86868b]">Mood: {moodLabels[entry.mood]}</span>
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
                    
                    {!expandedMentalId && (entry.triggers || entry.coping) && (
                      <div className="mt-2 text-[12px] text-[#86868b] flex items-center gap-1">
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>See more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}
      
      {/* Footer */}
      <footer className="max-w-xl mx-auto px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#b0b0b5]">
            WeeklyMind © 2026 • 100% private
          </p>
          <button 
            onClick={exportData}
            className="text-[12px] text-[#86868b] hover:text-[#1d1d1d] flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#e8e8ed] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </footer>
    </div>
  )
}
