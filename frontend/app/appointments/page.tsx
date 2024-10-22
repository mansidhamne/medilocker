'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, Edit, Search, User } from 'lucide-react'
import Navbar from '@/components/common/Navbar'

type Appointment = {
  id: string
  patientName: string
  date: string
  time: string
  type: string
  notes: string
}

const appointments: Appointment[] = [
  { id: '1', patientName: 'Alice Johnson', date: '2024-08-16', time: '10:00 AM', type: 'Check-up', notes: '' },
  { id: '2', patientName: 'Bob Smith', date: '2024-08-16', time: '11:30 AM', type: 'Follow-up', notes: '' },
  { id: '3', patientName: 'Charlie Brown', date: '2024-08-17', time: '09:00 AM', type: 'New Patient', notes: '' },
  { id: '4', patientName: 'Diana Prince', date: '2024-08-15', time: '02:00 PM', type: 'Check-up', notes: 'Patient reported improvements' },
  { id: '5', patientName: 'Ethan Hunt', date: '2024-08-14', time: '03:30 PM', type: 'Follow-up', notes: 'Prescribed new medication' },
  { id: '6', patientName: 'Ethan Hunt', date: '2024-11-02', time: '03:30 PM', type: 'Follow-up', notes: 'Prescribed new medication' },
]

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date)
    return activeTab === 'upcoming' 
      ? appointmentDate >= new Date() 
      : appointmentDate < new Date()
  })

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
  }

  const handleAddNotes = (id: string, notes: string) => {
    // In a real application, you would update the appointment in your database here
    console.log(`Adding notes to appointment ${id}: ${notes}`)
    setEditingNotes(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                    activeTab === 'previous' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setActiveTab('previous')}
                >
                  Previous
                </button>
              </div>

              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Notes:</h4>
                      {editingNotes === appointment.id ? (
                        <div>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            defaultValue={appointment.notes}
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                              onClick={() => handleAddNotes(appointment.id, 'New notes')} // You'd get the actual notes from the textarea
                            >
                              Save
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                              onClick={() => setEditingNotes(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-600">{appointment.notes || 'No notes added'}</p>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setEditingNotes(appointment.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-200">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-200">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - selectedDate.getDay() + 1)
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
                const hasAppointment = appointments.some(apt => apt.date === date.toISOString().split('T')[0])
                return (
                  <div
                    key={i}
                    className={`text-center p-2 rounded-full ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${hasAppointment ? 'bg-blue-100' : ''}`}
                  >
                    {date.getDate()}
                    {hasAppointment && <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1" />}
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                {appointments
                  .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                  .map(apt => (
                    <div key={apt.id} className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}