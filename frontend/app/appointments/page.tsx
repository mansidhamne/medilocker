'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Bell, Calendar, ChevronLeft, ChevronRight, Clock, Edit, Plus, Search, Video, Hospital, UserPlus, UserRoundCheck } from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import AddAppointment from '@/components/AddAppointment'

type Appointment = {
  _id: string
  patient: string
  problem: string
  date: string
  time: string
  type: string
  mode: string
  notes: string
}


export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([])
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    problem: '',
    date: '',
    time: '',
    mode: '',
    type: '',
    prescription: '',
    notes: '',
  })

  const handleAddAppointment = async () => {
    try {
      const response = await fetch('http://localhost:3000/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      })

      if (response.ok) {
        const addedAppointment = await response.json()
        setAppointmentsData([...appointmentsData, addedAppointment])
        setIsAddModalOpen(false)
      }
    } catch (error) {
      console.error('Failed to add appointment:', error)
    }
  }

  const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3000/appointment', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setAppointmentsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointmentsData([]); // fallback to empty array on error
      }
    };

    useEffect(() => {
      fetchAppointments();
    }, []);


  const filteredAppointments = appointmentsData.filter(appointment => {
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

  const handleAddNotes = async (id: string, notes: string) => {
    if (!id || !notes) {
      console.error('Invalid ID or notes');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/appointment/${id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
  
      if (response.ok) {
        const updatedAppointment = await response.json();
        console.log(`Notes added to appointment ${id}:`, updatedAppointment);
        setEditingNotes(null);

        await fetchAppointments();
      } else {
        console.error('Failed to add notes:', await response.text());
      }
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  const renderMode = (mode: string) => { 
    switch (mode) {
      case 'online': return <p>Online</p>
      case 'in-person': return <p>In-Person</p>
      default: return mode
    }
  }

  const renderType = (type: string) => {
    switch (type) {
      case 'check-up': return <p>Check Up</p>
      case 'follow-up': return <p>Follow Up</p>
      default: return type
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Add Appointment
            </button>
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
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.patient}</h3>
                        <div className={`flex items-center gap-4`}>
                          <div className="inline-flex gap-2 text-blue-600 bg-blue-200 rounded-full px-2 py-1 mt-2 text-sm font-semibold">
                              {appointment.mode === 'In-Person' ? (
                                <Hospital size={18}/>
                              ) : (
                                <Video size={18} />
                              )} {renderMode(appointment.mode)}
                          </div>
                          <div className="inline-flex gap-2 text-yellow-700 bg-yellow-200 rounded-full px-2 py-1 mt-2 text-sm font-semibold">
                              {appointment.type === 'Check Up' ? (
                                <UserPlus size={18}/>
                              ) : (
                                <UserRoundCheck size={18} />
                              )} {renderType(appointment.type)}
                            </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm text-gray-600">{appointment.type}</h4>
                    </div>
                    <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Complain:</h4>
                        <p className="text-sm text-gray-600">{appointment.problem}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">Notes:</h4>
                      {editingNotes === appointment._id ? (
                        <div>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            defaultValue={appointment.notes || ''}
                            rows={3}
                            onChange={(e) => setNoteText(e.target.value)}
                            //value={noteText}
                          />
                          <div className="mt-1 flex justify-end space-x-2">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                              onClick={() => handleAddNotes(appointment._id, noteText)} // You'd get the actual notes from the textarea
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
                            onClick={() => setEditingNotes(appointment._id)}
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

          {isAddModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl mb-4">Schedule Appointment</h2>
              <form>
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Swara Iyer"
                    className="border p-2 w-full mb-2"
                    value={newAppointment.patient}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      className="border p-2 w-full mb-2"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      className="border p-2 w-full mb-2"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mode" className="text-sm font-medium text-gray-700 mb-1">
                      Mode of Consultation
                    </label>
                    <select
                      id="mode"
                      name="mode"
                      value={newAppointment.mode}
                      onChange={(e) => setNewAppointment({ ...newAppointment, mode: e.target.value })}
                      required
                      className="w-full p-2 border mb-2"
                    >
                      <option value="in-person">In-Person</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="type" className="text-sm font-medium text-gray-700 mb-1">
                      Type of Appointment
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newAppointment.type}
                      onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                      required
                      className="w-full p-2 border mb-2"
                    >
                      <option value="check-up">Check Up</option>
                      <option value="follow-up">Follow Up</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                    Complaint
                  </label>
                  <input
                    type="text"
                    id="problem"
                    name="problem"
                    value={newAppointment.problem}
                    onChange={(e) => setNewAppointment({ ...newAppointment, problem: e.target.value })}
                    required
                    className="w-full p-2 border mb-2"
                    placeholder="Enter patient's complaint"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    placeholder="Notes"
                    className="border p-2 w-full mb-2"
                    value={newAppointment.notes || ''}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button type="button" onClick={handleAddAppointment} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


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
                const hasAppointment = appointmentsData.some(apt => apt.date === date.toISOString().split('T')[0])
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
              <h3 className="text-lg font-semibold mb-4">Today&apos;s Schedule</h3>
              <div className="space-y-4">
                {appointmentsData
                  .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                  .map(apt => (
                    <div key={apt._id} className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{apt.patient}</p>
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