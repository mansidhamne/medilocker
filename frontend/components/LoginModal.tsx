'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserMd, FaUser, FaTimes } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { GoogleLogin } from '@react-oauth/google'
import GoogleLoginButton from './GoogleLoginButton'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  loginType: 'doctor' | 'patient'
}

export default function LoginModal({ isOpen, onClose, loginType }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:3000/auth/${loginType}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify({
        ...data[loginType],
        role: loginType,
      }))

      router.push(`/dashboard/${loginType}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {loginType === 'doctor' ? 'Doctor Login' : 'Patient Login'}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">Or sign in with</span>
            </div>
            {/* <button
              onClick={() => {
                // window.open(`http://localhost:3000/auth/${loginType}/google`, '_self')
                window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/${loginType}/google`,
                    'Google Login',
                    // `width=${width},height=${height},left=${left},top=${top}`
                  );
              }}
              className="mt-4 w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue with Google
            </button> */}
            <GoogleLoginButton userType={loginType} />
            <p className="mt-4 text-xs text-center text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-blue-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-blue-600">
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}