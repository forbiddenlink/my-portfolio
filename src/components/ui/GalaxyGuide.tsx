'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, X, User, Bot, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useViewStore } from '@/lib/store'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function GalaxyGuide() {
    // ALL hooks must be called before any early returns to follow React's rules of hooks
    const isJourneyMode = useViewStore((state) => state.isJourneyMode)
    const view = useViewStore((state) => state.view)
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Greetings! I am your Galaxy Guide. How can I assist you in navigating Elizabeth's universe of code today?" }
    ])
    const [showSuggestions, setShowSuggestions] = useState(true)

    const suggestedPrompts = [
        "What are Liz's best AI projects?",
        "Tell me about her enterprise work",
        "What technologies does she use?",
        "Show me full-stack projects"
    ]
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    // Hide during journey mode and exploration mode - AFTER all hooks are called
    if (isJourneyMode || view === 'exploration') return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim() || isLoading) return

        const userMsg = inputValue.trim()
        setInputValue('')
        setShowSuggestions(false)
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }]
                })
            })

            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()

            setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm encountering some interference in the communication link. Please try again." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Trigger Button - positioned to avoid overlap with instructions box on desktop */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 md:bottom-52 md:right-10 z-50 group flex items-center gap-3 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-50 animate-pulse" />
                        <Sparkles className="w-6 h-6 text-indigo-300 relative z-10" />
                    </div>
                    <span className="text-white font-medium pr-1 text-sm hidden group-hover:block animate-in fade-in slide-in-from-right-2 duration-300">
                        Galaxy Guide
                    </span>
                </button>
            )}

            {/* Chat Interface */}
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 right-4 left-4 md:left-auto md:bottom-10 md:right-10 z-50 md:w-[400px] h-[70vh] md:h-[500px] flex flex-col rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                <Bot className="w-5 h-5 text-white relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-wide">GALAXY GUIDE</h3>
                                <p className="text-xs text-indigo-200/70 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-black/40 backdrop-blur-md">
                        {/* Suggested Prompts */}
                        {showSuggestions && messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {suggestedPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInputValue(prompt)
                                            setShowSuggestions(false)
                                        }}
                                        className="px-3 py-1.5 text-xs bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-200/80 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg mt-1",
                                    msg.role === 'user' ? "bg-white/10" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                                )}>
                                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                </div>
                                <div className={cn(
                                    "p-3.5 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-white/10 text-white rounded-tr-sm backdrop-blur-sm border border-white/5"
                                        : "bg-indigo-950/40 text-indigo-50 rounded-tl-sm backdrop-blur-sm border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mt-1">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-3.5 rounded-2xl bg-indigo-950/40 text-indigo-50 rounded-tl-sm backdrop-blur-sm border border-indigo-500/20 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                                    <span className="text-xs opacity-70">Processing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
                        <div className="relative flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about projects..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all font-light"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-white/20">Powered by MiniMax API</p>
                        </div>
                    </form>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    )
}
