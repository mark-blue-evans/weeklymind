'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar,
  Brain,
  ChevronDown,
  Download,
  Sparkles,
  Heart
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

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊']
const anxietyLabels = ['Calm', 'Mild', 'Moderate', 'High', 'Overwhelmed']
const energyLabels = ['Drained', 'Low', 'Moderate', 'Good', 'Energized']

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
  const [currentMood, setCurrentMood] = useState(2) // 0-4 index
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
  
  const getMoodEmoji = (mood: number) => moodEmojis[mood]
  
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#fafbfc] to-[#f5f7f9]">
      {/* Header */}
      <header className="pt-14 pb-8 px-8 max-w-2xl mx-auto">
        <h1 className="text-[52px] font-light tracking-tight text-[#1a1a1a] mb-1">
          WeeklyMind
        </h1>
        <p className="text-[18px] font-light text-[#8e8e93]">
          Your private wellness space
        </p>
      </header>
      
      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-8 mb-12">
        <div className="flex gap-0.5 bg-[#e8e8ea] p-0.5 rounded-full w-fit">
          <button
            onClick={() => switchTab('weekly')}
            className={`px-8 py-2.5 rounded-full text-[15px] font-medium transition-all duration-500 ${
              activeTab === 'weekly' 
                ? 'bg-white text-[#1a1a1a] shadow-sm' 
                : 'text-[#8e8e93] hover:text-[#1a1a1a]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => switchTab('mental')}
            className={`px-8 py-2.5 rounded-full text-[15px] font-medium transition-all duration-500 ${
              activeTab === 'mental' 
                ? 'bg-white text-[#1a1a1a] shadow-sm' 
                : 'text-[#8e8e93] hover:text-[#1a1a1a]'
            }`}
          >
            Wellness
          </button>
        </div>
      </div>
      
      {/* Weekly Tab */}
      {activeTab === 'weekly' && (
        <main className="max-w-2xl mx-auto px-8 pb-24 animate-fadeIn">
          {/* Intro */}
          <div className="mb-8">
            <h2 className="text-[28px] font-light text-[#1a1a1a] mb-2">
              Weekly Check-in
            </h2>
            <p className="text-[16px] font-light text-[#8e8e93] leading-relaxed max-w-lg">
              Take a moment to reflect on your week. Three simple questions to help you pause and notice what mattered.
            </p>
          </div>
          
          {/* Form */}
          <div className="mb-10">
            <div className="space-y-6">
              {/* Highlight */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  What was your highlight?
                </label>
                <textarea
                  placeholder="Something good that happened..."
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Challenge */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  What was challenging?
                </label>
                <textarea
                  placeholder="Something that was hard..."
                  value={currentChallenge}
                  onChange={(e) => setCurrentChallenge(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Gratitude */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  What are you grateful for?
                </label>
                <textarea
                  placeholder="Something positive to focus on..."
                  value={currentGratitude}
                  onChange={(e) => setCurrentGratitude(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Mood */}
              <div className="pt-4">
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-4 text-center">
                  How was your week?
                </label>
                <div className="flex items-center justify-center gap-4">
                  {moodEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentMood(i)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-[28px] transition-all duration-500 ${
                        currentMood === i
                          ? 'bg-[#f2f2f7] scale-110'
                          : 'hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={saveWeeklyEntry}
                disabled={!currentHighlight && !currentChallenge && !currentGratitude}
                className="w-full py-4 bg-[#1a1a1a] text-white text-[16px] font-medium rounded-[16px] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-4"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showWeeklySuccess && (
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-[16px] p-4 mb-8 flex items-center gap-3 animate-fadeIn">
              <span className="text-[20px]">✓</span>
              <p className="text-[15px] font-medium text-[#2e7d32]">Entry saved. See you next week.</p>
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
                  className="w-full px-4 py-3 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredWeekly.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[20px] p-6 cursor-pointer hover:shadow-sm transition-all duration-500"
                    onClick={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] font-medium text-[#1a1a1a]">{entry.weekNumber}</span>
                        <span className="text-[13px] text-[#8e8e93]">{formatDate(entry.date)}</span>
                      </div>
                      <span className="text-[24px]">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    
                    {entry.highlight && (
                      <p className="text-[15px] text-[#1a1a1a] line-clamp-2">
                        <span className="font-medium">Highlight:</span> {entry.highlight}
                      </p>
                    )}
                    
                    {expandedEntryId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-3 animate-fadeIn">
                        {entry.highlight && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">Highlight</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.highlight}</p>
                          </div>
                        )}
                        {entry.challenge && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">Challenging</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.challenge}</p>
                          </div>
                        )}
                        {entry.gratitude && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">Grateful</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.gratitude}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[13px] text-[#8e8e93]">Mood: {getMoodEmoji(entry.mood)}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'weekly')
                            }}
                            className="text-[13px] text-[#8e8e93] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!expandedEntryId && (entry.challenge || entry.gratitude) && (
                      <div className="mt-3 text-[13px] text-[#8e8e93] flex items-center gap-1">
                        <ChevronDown className="w-4 h-4" />
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
        <main className="max-w-2xl mx-auto px-8 pb-24 animate-fadeIn">
          {/* Intro */}
          <div className="mb-8">
            <h2 className="text-[28px] font-light text-[#1a1a1a] mb-2">
              Mental Wellness
            </h2>
            <p className="text-[16px] font-light text-[#8e8e93] leading-relaxed max-w-lg">
              A quiet space to process your thoughts and feelings. Everything stays private.
            </p>
          </div>
          
          {/* Form */}
          <div className="mb-10">
            <div className="space-y-6">
              {/* Mood */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-4 text-center">
                  How are you feeling?
                </label>
                <div className="flex items-center justify-center gap-4">
                  {moodEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setMentalMood(i)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-[28px] transition-all duration-500 ${
                        mentalMood === i
                          ? 'bg-[#f2f2f7] scale-110'
                          : 'hover:bg-[#f5f5f7]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Thoughts */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  What&apos;s on your mind?
                </label>
                <textarea
                  placeholder="Thoughts, worries, or whatever's there..."
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Triggers */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  Any triggers or stressors?
                </label>
                <textarea
                  placeholder="What might be affecting how you feel?"
                  value={currentTriggers}
                  onChange={(e) => setCurrentTriggers(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              {/* Coping */}
              <div>
                <label className="block text-[14px] font-medium text-[#1a1a1a] mb-3">
                  What helps?
                </label>
                <textarea
                  placeholder="Things that make you feel better..."
                  value={currentCoping}
                  onChange={(e) => setCurrentCoping(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 bg-white border border-[#e5e5e7] rounded-[16px] text-[16px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <button
                onClick={saveMentalEntry}
                disabled={!currentThoughts && !currentTriggers && !currentCoping}
                className="w-full py-4 bg-[#1a1a1a] text-white text-[16px] font-medium rounded-[16px] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-4"
              >
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success Message */}
          {showMentalSuccess && (
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-[16px] p-4 mb-8 flex items-center gap-3 animate-fadeIn">
              <span className="text-[20px]">✓</span>
              <p className="text-[15px] font-medium text-[#2e7d32]">Entry saved. Thank you for checking in.</p>
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
                  className="w-full px-4 py-3 pl-10 bg-white border border-[#e5e5e7] rounded-[12px] text-[15px] text-[#1a1a1a] placeholder-[#b0b0b5] focus:border-[#007aff] focus:outline-none transition-colors"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#b0b0b5] rounded-full" />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredMental.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white rounded-[20px] p-6 cursor-pointer hover:shadow-sm transition-all duration-500"
                    onClick={() => setExpandedMentalId(expandedMentalId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] text-[#8e8e93]">{formatDate(entry.date)}</span>
                      <span className="text-[24px]">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    
                    {entry.thoughts && (
                      <p className="text-[15px] text-[#1a1a1a] line-clamp-2">
                        {entry.thoughts}
                      </p>
                    )}
                    
                    {expandedMentalId === entry.id && (
                      <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-3 animate-fadeIn">
                        {entry.thoughts && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">On My Mind</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.thoughts}</p>
                          </div>
                        )}
                        {entry.triggers && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">Triggers</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.triggers}</p>
                          </div>
                        )}
                        {entry.coping && (
                          <div>
                            <p className="text-[12px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1">What Helps</p>
                            <p className="text-[15px] text-[#1a1a1a]">{entry.coping}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[13px] text-[#8e8e93]">Mood: {getMoodEmoji(entry.mood)}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteEntry(entry.id, 'mental')
                            }}
                            className="text-[13px] text-[#8e8e93] hover:text-[#ff3b30] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!expandedMentalId && (entry.triggers || entry.coping) && (
                      <div className="mt-3 text-[13px] text-[#8e8e93] flex items-center gap-1">
                        <ChevronDown className="w-4 h-4" />
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
      <footer className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#b0b0b5]">
            WeeklyMind © 2026 • 100% private
          </p>
          <button 
            onClick={exportData}
            className="text-[13px] text-[#8e8e93] hover:text-[#1a1a1a] flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#e8e8ea] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </footer>
    </div>
  )
}
