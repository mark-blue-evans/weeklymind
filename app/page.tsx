'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Brain,
  ChevronRight,
  CheckCircle2,
  Download,
  Lock,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronDown
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

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Reset state when switching tabs
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setSearchQuery('')
  }
  
  // Weekly state
  const [weeklyEntries, setWeeklyEntries] = useState<WeeklyEntry[]>([])
  const [currentHighlight, setCurrentHighlight] = useState('')
  const [currentChallenge, setCurrentChallenge] = useState('')
  const [currentGratitude, setCurrentGratitude] = useState('')
  const [currentMood, setCurrentMood] = useState(3)
  const [showWeeklySuccess, setShowWeeklySuccess] = useState(false)
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  
  // Mental wellness state
  const [mentalEntries, setMentalEntries] = useState<MentalEntry[]>([])
  const [mentalMood, setMentalMood] = useState(3)
  const [anxietyLevel, setAnxietyLevel] = useState(3)
  const [energyLevel, setEnergyLevel] = useState(3)
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
    setCurrentMood(3)
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
    setMentalMood(3)
    setAnxietyLevel(3)
    setEnergyLevel(3)
    setCurrentThoughts('')
    setCurrentTriggers('')
    setCurrentCoping('')
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
  
  const getMoodEmoji = (mood: number) => {
    if (mood >= 5) return '😊'
    if (mood >= 4) return '🙂'
    if (mood >= 3) return '😐'
    if (mood >= 2) return '😔'
    return '😢'
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

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header - Apple Style */}
      <header className="pt-16 pb-8 px-6 max-w-2xl mx-auto">
        <h1 className="text-[48px] font-semibold tracking-tight text-[#1d1d1f] mb-2">
          WeeklyMind
        </h1>
        <p className="text-[21px] font-normal text-[#86868b]">
          Private mental wellness check-ins
        </p>
      </header>
      
      {/* Tabs - Minimal Apple Style */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <div className="flex gap-1 bg-[#e8e8ed] p-1 rounded-[18px] w-fit">
          <button
            onClick={() => switchTab('weekly')}
            className={`px-6 py-2.5 rounded-[14px] text-[15px] font-medium transition-all duration-300 ${
              activeTab === 'weekly' 
                ? 'bg-white text-[#1d1d1f] shadow-sm' 
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => switchTab('mental')}
            className={`px-6 py-2.5 rounded-[14px] text-[15px] font-medium transition-all duration-300 ${
              activeTab === 'mental' 
                ? 'bg-white text-[#1d1d1f] shadow-sm' 
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Wellness
          </button>
        </div>
      </div>
      
      {/* Weekly Tab */}
      {activeTab === 'weekly' && (
        <main className="max-w-2xl mx-auto px-6 pb-20 animate-fadeIn">
          {/* Intro Card */}
          <div className="bg-white rounded-[18px] p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#f5f5f7] rounded-[16px] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-[#86868b]" />
              </div>
              <div className="flex-1">
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">
                  Weekly Check-in
                </h2>
                <p className="text-[17px] font-normal text-[#86868b] leading-relaxed">
                  Reflect on your week. Three simple questions — no pressure, no judgment.
                </p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-white rounded-[18px] p-8 mb-6">
            <div className="space-y-8">
              {/* Question 1 */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  What was your highlight?
                </label>
                <textarea
                  placeholder="Something good that happened..."
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              {/* Question 2 */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  What was challenging?
                </label>
                <textarea
                  placeholder="Something that was hard..."
                  value={currentChallenge}
                  onChange={(e) => setCurrentChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              {/* Question 3 */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  What are you grateful for?
                </label>
                <textarea
                  placeholder="Something positive to focus on..."
                  value={currentGratitude}
                  onChange={(e) => setCurrentGratitude(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              {/* Mood */}
              <div className="pt-4">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-4 text-center">
                  How was your week overall?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setCurrentMood(mood)}
                      className={`w-16 h-16 rounded-[16px] flex items-center justify-center text-[28px] transition-all duration-300 ${
                        currentMood === mood
                          ? 'bg-[#f5f5f7] ring-2 ring-[#0071e3] scale-105'
                          : 'bg-transparent hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={saveWeeklyEntry}
                disabled={!currentHighlight && !currentChallenge && !currentGratitude}
                className="w-full py-4 bg-[#0071e3] text-white text-[17px] font-medium rounded-[18px] hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showWeeklySuccess && (
            <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-[12px] p-4 mb-6 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#28a745]" />
              <p className="text-[15px] font-medium text-[#155724]">Entry saved! See you next week.</p>
            </div>
          )}
          
          {/* History */}
          {weeklyEntries.length > 0 && (
            <div className="mb-6">
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search your entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[15px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#86868b] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredWeekly.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`bg-white rounded-[16px] p-6 cursor-pointer transition-all duration-300 ${
                      expandedEntryId === entry.id ? 'ring-2 ring-[#0071e3]' : 'hover:ring-2 hover:ring-[#e8e8ed]'
                    }`}
                    onClick={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px] font-medium text-[#1d1d1f]">{entry.weekNumber}</span>
                        <span className="text-[14px] text-[#86868b]">{formatDate(entry.date)}</span>
                      </div>
                      <span className="text-[24px]">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    
                    {entry.highlight && (
                      <p className="text-[15px] text-[#1d1d1f] line-clamp-2">
                        <span className="font-medium">Highlight:</span> {entry.highlight}
                      </p>
                    )}
                    
                    {expandedEntryId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f5f5f7] space-y-3 animate-fadeIn">
                        {entry.highlight && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">HIGHLIGHT</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.highlight}</p>
                          </div>
                        )}
                        {entry.challenge && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">CHALLENGING</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.challenge}</p>
                          </div>
                        )}
                        {entry.gratitude && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">GRATEFUL</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.gratitude}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[13px] text-[#86868b]">Mood: {getMoodEmoji(entry.mood)} ({entry.mood}/5)</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'weekly')
                            }}
                            className="text-[13px] text-[#86868b] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!expandedEntryId && (entry.challenge || entry.gratitude) && (
                      <div className="mt-2 text-[13px] text-[#86868b] flex items-center gap-1">
                        <ChevronDown className="w-4 h-4" />
                        Show more
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
        <main className="max-w-2xl mx-auto px-6 pb-20 animate-fadeIn">
          {/* Intro Card */}
          <div className="bg-white rounded-[18px] p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#f5f5f7] rounded-[16px] flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-[#86868b]" />
              </div>
              <div className="flex-1">
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-2">
                  Mental Wellness
                </h2>
                <p className="text-[17px] font-normal text-[#86868b] leading-relaxed">
                  A space to process your thoughts and feelings. Completely private.
                </p>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="bg-white rounded-[18px] p-8 mb-6">
            <div className="space-y-8">
              {/* Mood */}
              <div>
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-4 text-center">
                  Overall mood
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMentalMood(mood)}
                      className={`w-16 h-16 rounded-[16px] flex items-center justify-center text-[28px] transition-all duration-300 ${
                        mentalMood === mood
                          ? 'bg-[#f5f5f7] ring-2 ring-[#0071e3] scale-105'
                          : 'bg-transparent hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Thoughts */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  What&apos;s on your mind?
                </label>
                <textarea
                  placeholder="Thoughts, worries, or just whatever's there..."
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              {/* Triggers */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  Any triggers or stressors?
                </label>
                <textarea
                  placeholder="What might be affecting how you feel?"
                  value={currentTriggers}
                  onChange={(e) => setCurrentTriggers(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              {/* Coping */}
              <div className="group">
                <label className="block text-[15px] font-medium text-[#1d1d1f] mb-3 transition-colors group-focus-within:text-[#0071e3]">
                  What helps?
                </label>
                <textarea
                  placeholder="Things that make you feel better..."
                  value={currentCoping}
                  onChange={(e) => setCurrentCoping(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[17px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all resize-none"
                />
              </div>
              
              <button
                onClick={saveMentalEntry}
                disabled={!currentThoughts && !currentTriggers && !currentCoping}
                className="w-full py-4 bg-[#0071e3] text-white text-[17px] font-medium rounded-[18px] hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-4"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showMentalSuccess && (
            <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-[12px] p-4 mb-6 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#28a745]" />
              <p className="text-[15px] font-medium text-[#155724]">Entry saved. Thank you for checking in.</p>
            </div>
          )}
          
          {/* History */}
          {mentalEntries.length > 0 && (
            <div className="mb-6">
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search your entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-[#f5f5f7] border border-transparent rounded-[12px] text-[15px] text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#86868b] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredMental.map((entry) => (
                  <div 
                    key={entry.id}
                    className={`bg-white rounded-[16px] p-6 cursor-pointer transition-all duration-300 ${
                      expandedMentalId === entry.id ? 'ring-2 ring-[#0071e3]' : 'hover:ring-2 hover:ring-[#e8e8ed]'
                    }`}
                    onClick={() => setExpandedMentalId(expandedMentalId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[14px] text-[#86868b]">{formatDate(entry.date)}</span>
                      <span className="text-[24px]">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    
                    {entry.thoughts && (
                      <p className="text-[15px] text-[#1d1d1f] line-clamp-2">
                        {entry.thoughts}
                      </p>
                    )}
                    
                    {expandedMentalId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f5f5f7] space-y-3 animate-fadeIn">
                        {entry.thoughts && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">ON MY MIND</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.thoughts}</p>
                          </div>
                        )}
                        {entry.triggers && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">TRIGGERS</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.triggers}</p>
                          </div>
                        )}
                        {entry.coping && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wide mb-1">WHAT HELPS</p>
                            <p className="text-[15px] text-[#1d1d1f]">{entry.coping}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[13px] text-[#86868b]">Mood: {getMoodEmoji(entry.mood)}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'mental')
                            }}
                            className="text-[13px] text-[#86868b] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!expandedMentalId && (entry.triggers || entry.coping) && (
                      <div className="mt-2 text-[13px] text-[#86868b] flex items-center gap-1">
                        <ChevronDown className="w-4 h-4" />
                        Show more
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
      <footer className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#86868b]">
            WeeklyMind © 2026 • 100% private, no tracking
          </p>
          <button 
            onClick={exportData}
            className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] flex items-center gap-2 px-4 py-2 rounded-[12px] hover:bg-[#e8e8ed] transition-all"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </footer>
    </div>
  )
}
