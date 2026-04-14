import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, X, Sparkles, Mic, MicOff } from 'lucide-react'
import { chatWithAiApi } from '@/services/ai.api'

const suggestedPrompts = [
  'What is this topic about?',
  'Explain in simple words',
  'Give a real-world example',
  'Summarize this lesson'
]

const TypingDots = () => (
  <div className="flex items-center gap-1">
    <span className="h-2 w-2 rounded-full bg-[#0ea5a4] animate-bounce" />
    <span className="h-2 w-2 rounded-full bg-[#0ea5a4] animate-bounce [animation-delay:150ms]" />
    <span className="h-2 w-2 rounded-full bg-[#0ea5a4] animate-bounce [animation-delay:300ms]" />
  </div>
)

const formatTime = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const AIChatbot = ({
  courseTitle,
  sectionTitle,
  lessonTitle,
  courseId,
  lessonId,
  timestamp
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const contextLabel = useMemo(() => {
    const parts = [courseTitle, sectionTitle, lessonTitle].filter(Boolean)
    return parts.join(' • ')
  }, [courseTitle, sectionTitle, lessonTitle])

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content: 'Hi! Ask me any doubt about this lesson and I will explain it simply.'
    }
  ])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechSupported(false)
      return
    }

    setSpeechSupported(true)
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
  }, [])

  const sendMessage = async (text) => {
    const value = String(text || '').trim()
    if (!value || isTyping) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: value
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError('')

    try {
      const res = await chatWithAiApi({
        message: value,
        courseTitle,
        sectionTitle,
        lessonTitle,
        courseId,
        lessonId,
        timestamp
      })

      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: res?.response || 'Sorry, I could not generate a response.'
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setError('AI is unavailable right now. Please try again in a moment.')
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: 'ai',
          content: 'I ran into an issue responding. Try rephrasing your question.'
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleExplainLikeTen = () => {
    const prompt = lessonTitle
      ? `Explain the lesson "${lessonTitle}" like I'm 10.`
      : 'Explain this concept like I am 10.'
    sendMessage(prompt)
  }

  const toggleRecording = () => {
    if (!speechSupported) return
    const recognition = recognitionRef.current
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
      setIsRecording(false)
      return
    }

    setIsRecording(true)
    recognition.start()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[320px] sm:w-[380px] md:w-[420px] h-[520px] rounded-3xl border border-white/40 shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/40 bg-gradient-to-r from-[#0ea5a4]/10 via-white/40 to-[#f59e0b]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#51607b]">AI Tutor</p>
                  <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                    Lesson Assistant <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                  </h3>
                  {contextLabel ? (
                    <p className="text-xs text-[#51607b] mt-1 line-clamp-1">{contextLabel}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-full bg-white/70 border border-white/60 text-[#51607b] flex items-center justify-center hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {typeof timestamp === 'number' ? (
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#0ea5a4] bg-white/70 border border-white/60 rounded-full px-3 py-1">
                  Current time: {formatTime(timestamp)}
                </div>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#0ea5a4] to-[#0f766e] text-white'
                        : 'bg-white/90 border border-white/60 text-[#0f172a]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-white/90 border border-white/60 text-[#0f172a]">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="text-xs font-semibold text-[#0ea5a4] bg-white/70 border border-white/60 rounded-full px-3 py-1 hover:bg-white"
                  >
                    {prompt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleExplainLikeTen}
                  className="text-xs font-semibold text-[#B56B2A] bg-[#fef3c7] border border-[#f59e0b]/40 rounded-full px-3 py-1 hover:bg-[#fde68a]"
                >
                  Explain Like I am 10
                </button>
              </div>

              {error ? (
                <div className="text-xs text-red-500 mb-2">{error}</div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white/90 border border-white/70 text-sm"
                  />
                  <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={!speechSupported}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#51607b] disabled:opacity-40"
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0ea5a4] to-[#f59e0b] text-white flex items-center justify-center shadow-md disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0ea5a4] to-[#f59e0b] text-white shadow-xl flex items-center justify-center"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  )
}

export default AIChatbot

