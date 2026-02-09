'use client'

import React from 'react'
import Link from 'next/link'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="w-full h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <div
              className="rounded-2xl p-12"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <h1 className="text-4xl font-bold mb-4 text-white">
                3D Experience Unavailable
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Your browser or device doesn't support WebGL, which is required for the 3D galaxy experience.
                Don't worry — you can still view all my work in the traditional view.
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/15 backdrop-blur-xl border border-white/30 text-white font-semibold hover:bg-white/25 hover:border-white/40 transition-all duration-300 rounded-xl shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                <span>View Projects</span>
                <span className="text-2xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
