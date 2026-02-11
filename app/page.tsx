'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Heart, 
  Brain, 
  ChevronRight, 
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Clock,
  TrendingUp,
  Download,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Search
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
  
  // Reset state when switching tabs
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
  const [currentMood, setCurrentMood] = useState(3)
  const [showWeeklySuccess, setShowWeeklySuccess] = useState(false)
  
  // Mental wellness state
  const [mentalEntries, setMentalEntries] = useState<MentalEntry[]>([])
  const [mentalMood, setMentalMood] = useState(3)
  const [anxietyLevel, setAnxietyLevel] = useState(3)
  const [energyLevel, setEnergyLevel] = useState(3)
  const [currentThoughts, setCurrentThoughts] = useState('')
  const [currentTriggers, setCurrentTriggers] = useState('')
  const [currentCoping, setCurrentCoping] = useState('')
  const [showMentalSuccess, setShowMentalSuccess] = useState(false)
  const [showPrivateWarning, setShowPrivateWarning] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [weeklyPage, setWeeklyPage] = useState(1)
  const [mentalPage, setMentalPage] = useState(1)
  const ENTRIES_PER_PAGE = 10
  
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
  
  return (
    <main className="min-h-screen pb-12">
      {/* Private Warning */}
      {showPrivateWarning && (
        <div className="bg-mind-100 border-b border-mind-200 px-4 py-3 animate-slideIn">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-mind-800">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Your data stays on this device. Nothing is tracked or stored anywhere else.</span>
            </div>
            <button 
              onClick={() => setShowPrivateWarning(false)}
              className="text-mind-600 hover:text-mind-800"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="max-w-2xl mx-auto px-4 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">WeeklyMind</h1>
        <p className="text-slate-500">Private mental wellness check-ins</p>
      </header>
      
      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => switchTab('weekly')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'weekly' 
                ? 'bg-white text-mind-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly Recap
            </div>
          </button>
          <button
            onClick={() => switchTab('mental')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'mental' 
                ? 'bg-white text-purple-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-4 h-4" />
              Mental Wellness
            </div>
          </button>
        </div>
      </div>
      
      {/* Weekly Tab */}
      {activeTab === 'weekly' && (
        <div className="max-w-2xl mx-auto px-4 space-y-6 animate-fadeIn">
          {/* Intro */}
          <div className="bg-gradient-to-r from-mind-50 to-green-50 rounded-2xl p-6 border border-mind-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mind-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-mind-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 mb-1">Weekly Check-in</h2>
                <p className="text-sm text-slate-600">
                  Reflect on your week. Three simple questions — no pressure, no judgment.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          {weeklyEntries.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-mind-500" />
                  Your Journey
                </h3>
                <span className="text-sm text-slate-400">{weeklyEntries.length} entries</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-mind-600">{weeklyEntries.length}</p>
                  <p className="text-xs text-slate-500">Weeks Tracked</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-slate-600">
                    {Math.round(weeklyEntries.reduce((acc, e) => acc + e.mood, 0) / weeklyEntries.length * 10) / 10}
                  </p>
                  <p className="text-xs text-slate-500">Avg Mood</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">
                    {weeklyEntries.filter(e => e.gratitude).length}
                  </p>
                  <p className="text-xs text-slate-500">Gratitude Notes</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-5">This Week</h3>
            
            <div className="space-y-6">
              {/* Question 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What was your highlight?
                </label>
                <textarea
                  placeholder="Something good that happened..."
                  value={currentHighlight}
                  onChange={(e) => setCurrentHighlight(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-mind-400 focus:bg-white resize-none"
                />
              </div>
              
              {/* Question 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What was challenging?
                </label>
                <textarea
                  placeholder="Something that was hard..."
                  value={currentChallenge}
                  onChange={(e) => setCurrentChallenge(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-mind-400 focus:bg-white resize-none"
                />
              </div>
              
              {/* Question 3 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What are you grateful for?
                </label>
                <textarea
                  placeholder="Something positive to focus on..."
                  value={currentGratitude}
                  onChange={(e) => setCurrentGratitude(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-mind-400 focus:bg-white resize-none"
                />
              </div>
              
              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  How was your week overall?
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setCurrentMood(mood)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        currentMood === mood
                          ? 'bg-mind-100 ring-2 ring-mind-400 scale-110'
                          : 'bg-slate-50 hover:bg-slate-100'
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
                className="w-full py-3 bg-mind-500 text-white rounded-xl font-medium hover:bg-mind-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success */}
          {showWeeklySuccess && (
            <div className="bg-mind-100 border border-mind-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-mind-600" />
              <p className="text-mind-700 font-medium">Entry saved! See you next week.</p>
            </div>
          )}
          
          {/* History */}
          {weeklyEntries.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Past Weeks</h3>
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your entries..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setWeeklyPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-mind-400 focus:bg-white"
                />
              </div>
              
              {/* Filtered and paginated entries */}
              {(() => {
                const filtered = weeklyEntries.filter(e => 
                  !searchQuery || 
                  e.highlight.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.gratitude.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.challenge.toLowerCase().includes(searchQuery.toLowerCase())
                )
                const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE)
                const paginated = filtered.slice((weeklyPage - 1) * ENTRIES_PER_PAGE, weeklyPage * ENTRIES_PER_PAGE)
                
                if (filtered.length === 0) {
                  return <p className="text-center text-slate-400 py-4">No entries found</p>
                }
                
                return (
                  <>
                    <div className="space-y-4">
                      {paginated.map((entry) => (
                        <div key={entry.id} className="p-4 bg-slate-50 rounded-xl relative group">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <span className="text-xs font-medium text-mind-600 bg-mind-100 px-2 py-1 rounded-lg">
                              {entry.weekNumber} • {formatDate(entry.date)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                              <button 
                                onClick={() => deleteEntry(entry.id, 'weekly')}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {entry.highlight && (
                            <p className="text-sm text-slate-700 mb-1">
                              <span className="font-medium text-mind-700">Highlight:</span> {entry.highlight}
                            </p>
                          )}
                          {entry.gratitude && (
                            <p className="text-sm text-slate-600">
                              <span className="font-medium text-green-700">Grateful:</span> {entry.gratitude}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                          onClick={() => setWeeklyPage(p => Math.max(1, p - 1))}
                          disabled={weeklyPage === 1}
                          className="px-3 py-1 bg-slate-100 rounded-lg disabled:opacity-50 text-sm"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-slate-500">
                          Page {weeklyPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setWeeklyPage(p => Math.min(totalPages, p + 1))}
                          disabled={weeklyPage === totalPages}
                          className="px-3 py-1 bg-slate-100 rounded-lg disabled:opacity-50 text-sm"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </div>
      )}
      
      {/* Mental Wellness Tab */}
      {activeTab === 'mental' && (
        <div className="max-w-2xl mx-auto px-4 space-y-6 animate-fadeIn">
          {/* Intro */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800 mb-1">Mental Wellness Check</h2>
                <p className="text-sm text-slate-600">
                  A space to process your thoughts and feelings. Completely private.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          {mentalEntries.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Your Patterns
                </h3>
                <span className="text-sm text-slate-400">{mentalEntries.length} entries</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(mentalEntries.reduce((acc, e) => acc + e.mood, 0) / mentalEntries.length * 10) / 10}
                  </p>
                  <p className="text-xs text-slate-500">Avg Mood</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.round(mentalEntries.reduce((acc, e) => acc + e.anxiety, 0) / mentalEntries.length * 10) / 10}
                  </p>
                  <p className="text-xs text-slate-500">Avg Anxiety</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(mentalEntries.reduce((acc, e) => acc + e.energy, 0) / mentalEntries.length * 10) / 10}
                  </p>
                  <p className="text-xs text-slate-500">Avg Energy</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Add Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-5">How are you feeling?</h3>
            
            <div className="space-y-6">
              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Overall mood
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMentalMood(mood)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        mentalMood === mood
                          ? 'bg-purple-100 ring-2 ring-purple-400 scale-110'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Anxiety */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Anxiety level
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setAnxietyLevel(level)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-medium transition-all ${
                        anxietyLevel === level
                          ? level >= 4 
                            ? 'bg-red-100 ring-2 ring-red-400 text-red-700'
                            : level >= 3
                              ? 'bg-amber-100 ring-2 ring-amber-400 text-amber-700'
                              : 'bg-green-100 ring-2 ring-green-400 text-green-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
                  <span>Calm</span>
                  <span>Overwhelmed</span>
                </div>
              </div>
              
              {/* Energy */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Energy level
                </label>
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergyLevel(level)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-medium transition-all ${
                        energyLevel === level
                          ? level >= 4
                            ? 'bg-blue-100 ring-2 ring-blue-400 text-blue-700'
                            : level >= 3
                              ? 'bg-sky-100 ring-2 ring-sky-400 text-sky-700'
                              : 'bg-slate-100 ring-2 ring-slate-400 text-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>
              
              {/* Thoughts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What&apos;s on your mind?
                </label>
                <textarea
                  placeholder="Thoughts, worries, or just whatever's there..."
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-400 focus:bg-white resize-none"
                />
              </div>
              
              {/* Triggers */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Any triggers or stressors?
                </label>
                <textarea
                  placeholder="What might be affecting how you feel?"
                  value={currentTriggers}
                  onChange={(e) => setCurrentTriggers(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-400 focus:bg-white resize-none"
                />
              </div>
              
              {/* Coping */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What helps?
                </label>
                <textarea
                  placeholder="Things that make you feel better..."
                  value={currentCoping}
                  onChange={(e) => setCurrentCoping(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-400 focus:bg-white resize-none"
                />
              </div>
              
              <button
                onClick={saveMentalEntry}
                disabled={!currentThoughts && !currentTriggers && !currentCoping}
                className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Save Entry
              </button>
            </div>
          </div>
          
          {/* Success */}
          {showMentalSuccess && (
            <div className="bg-purple-100 border border-purple-300 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
              <p className="text-purple-700 font-medium">Entry saved. Thank you for checking in.</p>
            </div>
          )}
          
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search your entries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setMentalPage(1)
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-400 focus:bg-white"
            />
          </div>
          
          {/* History */}
          {mentalEntries.length > 0 && (() => {
            const filtered = mentalEntries.filter(e => 
              !searchQuery || 
              e.thoughts.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.triggers.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.coping.toLowerCase().includes(searchQuery.toLowerCase())
            )
            const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE)
            const paginated = filtered.slice((mentalPage - 1) * ENTRIES_PER_PAGE, mentalPage * ENTRIES_PER_PAGE)
            
            if (filtered.length === 0) {
              return <p className="text-center text-slate-400 py-4">No entries found</p>
            }
            
            return (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Your Entries</h3>
                  <span className="text-sm text-slate-400">{filtered.length} entries</span>
                </div>
                <div className="space-y-4">
                  {paginated.map((entry) => (
                    <div key={entry.id} className="p-4 bg-slate-50 rounded-xl relative group">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                          <button 
                            onClick={() => deleteEntry(entry.id, 'mental')}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-4 mb-2 text-xs">
                        <span className={entry.anxiety >= 4 ? 'text-red-600' : entry.anxiety >= 3 ? 'text-amber-600' : 'text-green-600'}>
                          Anxiety: {entry.anxiety}/5
                        </span>
                        <span className={entry.energy >= 4 ? 'text-blue-600' : entry.energy >= 3 ? 'text-sky-600' : 'text-slate-500'}>
                          Energy: {entry.energy}/5
                        </span>
                      </div>
                      {entry.thoughts && (
                        <p className="text-sm text-slate-700 mb-1">{entry.thoughts}</p>
                      )}
                      {entry.coping && (
                        <p className="text-sm text-purple-600">
                          <span className="font-medium">Helps:</span> {entry.coping}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setMentalPage(p => Math.max(1, p - 1))}
                      disabled={mentalPage === 1}
                      className="px-3 py-1 bg-slate-100 rounded-lg disabled:opacity-50 text-sm"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-500">
                      Page {mentalPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setMentalPage(p => Math.min(totalPages, p + 1))}
                      disabled={mentalPage === totalPages}
                      className="px-3 py-1 bg-slate-100 rounded-lg disabled:opacity-50 text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}
      
      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            WeeklyMind © 2026 • 100% private, no tracking
          </p>
          <button 
            onClick={exportData}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
          >
            <Download className="w-3 h-3" />
            Export My Data
          </button>
        </div>
      </footer>
    </main>
  )
}
