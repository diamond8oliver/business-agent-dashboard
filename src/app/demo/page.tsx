'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DemoPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('https://web-production-902d.up.railway.app/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      if (!response.ok) throw new Error('Failed to crawl website')

      const data = await response.json()
      setBusinessId(data.business_id)

      // Load widget with business_id
      const script = document.createElement('script')
      script.src = 'https://web-production-902d.up.railway.app/widget/widget.js'
      script.setAttribute('data-api-key', '4644670e-936f-4688-87ed-b38d45e3d4e9')
      script.setAttribute('data-business-id', data.business_id)
      document.body.appendChild(script)
    } catch (err) {
      setError('Failed to deploy. Please check the URL and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              CuseAI
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        {!businessId ? (
          <div className="w-full max-w-2xl">
            {/* Logo/Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Deploy Your AI Agent
              </h1>
              <p className="text-lg text-gray-600">
                Enter your website URL to create an AI shopping assistant
              </p>
            </div>

            {/* Deploy Form */}
            <form onSubmit={handleDeploy} className="relative">
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg p-3 transition-all hover:shadow-xl">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-store.com"
                  className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none text-lg"
                  disabled={loading}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold rounded-xl transition-all active:scale-95 min-w-[100px]"
                >
                  {loading ? 'Deploying...' : 'Deploy'}
                </button>
              </div>

              {/* Loading Bar */}
              {loading && (
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-orange-600 animate-pulse" style={{ width: '60%', transition: 'width 2s ease-in-out' }}></div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </form>

            {/* Info Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Powered</h3>
                <p className="text-sm text-gray-600">Smart product recommendations</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Setup</h3>
                <p className="text-sm text-gray-600">Live in under 60 seconds</p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-sm text-gray-600">Always available for customers</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-xl mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Agent Deployed!
              </h2>
              <p className="text-gray-600">
                Your AI assistant is now live. Try it out using the chat bubble!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}