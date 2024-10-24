'use client'

import React, { useState, useEffect } from 'react'
import { Bell, User, Video, Phone, Calendar, Clock, X } from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import Link from 'next/link';

interface Consultation {
  _id: string
  patient: string
  date: string
  time: string
//   status: 'upcoming' | 'completed' | 'cancelled'
}

export default function DoctorConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('https://medi-backend-two.vercel.app/appointment/online')
        const data = await response.json()
        console.log('Consultations:', data)
        setConsultations(data)
      } catch (error) {
        console.error('Error fetching consultations:', error)
      }
    }

    fetchConsultations()
  }, [])

  const getConsultationStatus = (date: string, time: string) => {
    const appointmentDateTime = new Date(`${date}T${time}`)
    const currentDateTime = new Date()

    if (appointmentDateTime > currentDateTime) {
      return 'upcoming'
    } else if (appointmentDateTime <= currentDateTime) {
      return 'completed'
    }
    return 'cancelled'
  }

  const filteredConsultations = consultations.filter((consultation) => {
    const aptStatus = getConsultationStatus(consultation.date, consultation.time)
    return (activeTab === 'upcoming' && aptStatus === 'upcoming') ||
           (activeTab === 'completed' && (aptStatus === 'completed' || aptStatus === 'cancelled'))
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 bg-blue-600 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Video className="mr-2" />
              Video Chats
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Today</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Phone className="mr-2" />
                    <span>Picked up 16:50</span>
                  </li>
                  <li className="flex items-center text-red-300">
                    <X className="mr-2" />
                    <span>Missed call at 16:48</span>
                  </li>
                  <li className="flex items-center text-red-300">
                    <X className="mr-2" />
                    <span>Missed call at 15:37</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">Online Consultations</h1>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
              </div>

              <div className="space-y-4">
                {filteredConsultations.map((consultation) => {
                  const status = getConsultationStatus(consultation.date, consultation.time)

                  return (
                    <div key={consultation._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{consultation.patient}</h3>
                        <p className="text-sm text-gray-600 flex items-center mb-1.5">
                          <Calendar className="mr-2" size={16} />
                          {new Date(consultation.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Clock className="mr-2" size={16} />
                          {consultation.time}
                          {/* {consultation._id} */}
                        </p>
                      </div>
                      {status === 'upcoming' && (
                        <Link href={`/room/${consultation._id}`} target="_blank">
                          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                            Join Meeting
                          </button>
                        </Link>
                      )}
                      {status === 'completed' && (
                        <span className="text-green-600 font-medium">Completed</span>
                      )}
                      {status === 'cancelled' && (
                        <span className="text-red-600 font-medium">Cancelled</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}