'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Send, User, Bell } from 'lucide-react'
import NavbarPatient from '@/components/common/NavbarPatient'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
}

const MediMate: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulating fetching chat history
    setChatHistory(['What diet is suggested for an upset stomach'])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      try {
        const response = await fetch('http://localhost:3000/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputMessage }),
        })

        const data = await response.json()

        const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response || "I'm sorry, I don't have enough information to answer that question.",
            sender: 'bot',
          }
          setMessages((prevMessages) => [...prevMessages, botResponse])
      } catch (error) {
        console.error('Error fetching bot response:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, something went wrong. Please try again later.",
          sender: 'bot',
        }
        setMessages((prevMessages) => [...prevMessages, errorMessage])
      }
    }
  }


  const suggestionButtons = [
    "What diet would you suggest to an overweight person?",
    "Who is the most famous orthopedic surgeon in Mumbai?",
    "What diet would you suggest to an overweight person?",
  ]

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Left Sidebar */}
      <NavbarPatient />
      <div className="flex min-h-screen bg-white">
      <div className="w-64 bg-blue-600 text-white p-4">
        <div className="flex items-center justify-center mb-8 gap-2">
            <img src="./medimate-logo.png" alt="MediMate" className="h-12 w-12" />
          <h1 className="text-2xl font-bold">MediMate</h1>
        </div>
        <h2 className="text-xl mb-4 text-center">Chat History</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Today</h3>
          <ul>
            {chatHistory.map((item, index) => (
              <li key={index} className="mb-2 text-sm">
                &gt; {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col px-12 pt-8 pb-4 border-2 border-t-blue-100">
        <div className="flex-1 overflow-y-auto p-4 justify-between">
            <div>
          <h2 className="text-3xl font-bold text-blue-600 mb-6">
            Hello Swara Iyer, how can I help you today?
          </h2>
          <div className="flex space-x-4 mt-8 mb-12 justify-between">
            {suggestionButtons.map((text, index) => (
              <button
                key={index}
                className="w-[300px] bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors"
                onClick={() => setInputMessage(text)}
              >
                {text}
              </button>
            ))}
          </div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          </div>
        <form onSubmit={handleSendMessage} className="rounded-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message MediMate!"
              className="flex-1 p-2 rounded-l-md border-2 focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 border-2 border-blue-600 rounded-r-md hover:bg-blue-700 transition-colors"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </form>
        </div>
        </div>
      </div>
    </div>
  )
}

export default MediMate