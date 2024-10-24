'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import NavbarPatient from '@/components/common/NavbarPatient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  // speciality: string
}

const BookAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [problem, setProblem] = useState<string>('')
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [time, setTime] = useState<string>('')
  const [mode, setMode] = useState<'online' | 'in-person'>('online')
  const [type, setType] = useState<'follow-up' | 'check-up'>('check-up')
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
    setUser(JSON.parse(storedUser)); // Parse the user data and store it in state
    }
}, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://medi-backend-two.vercel.app/doctors')
        if (response.ok) {
          const data = await response.json()
          setDoctors(data)
        } else {
          console.error('Failed to fetch doctors')
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }

    fetchDoctors()
  }, [])

  const fetchPatientName = async () => {
    if (user) {
      try {
        const response = await fetch(`https://medi-backend-two.vercel.app/patients/find-by-firstName/Swara`)
        if (response.ok) {
          const data = await response.json()
          const patientName = `${data.firstName} ${data.lastName}`
          return patientName
        } else {
          console.error('Failed to fetch patient info')
        }
      } catch (error) {
        console.error('Error fetching patient info:', error)
      }
    }
  }

  const fetchPatient = async () => {
    if (user) {
      try {
        const response = await fetch(`https://medi-backend-two.vercel.app/patients/find-by-firstName/Swara`)
        if (response.ok) {
          const data = await response.json()
          return data
        } else {
          console.error('Failed to fetch patient info')
        }
      } catch (error) {
        console.error('Error fetching patient info:', error)
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const patient = await fetchPatient();
      const response = await fetch(`https://medi-backend-two.vercel.app/patients/${patient._id}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //patient: patient,
          problem,
          date,
          time,
          mode,
          type,
        }),
      })
      if (response.ok) {
        alert('Appointment booked successfully!')
        // Reset form or redirect
        router.push('/dashboard/patient')
      } else {
        alert('Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-0 px-4 sm:px-6 lg:px-8">
      <NavbarPatient />
      <div className="max-w-5xl mx-auto py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <Clock className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Reserve a Time Slot</h1>
            </div>
            <Link href="/dashboard/patient">
                <button
                    className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </button>
              </Link>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                  Doctor Name
                </label>
                <select
                  id="doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for visit
                </label>
                <textarea
                  id="problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your symptoms or reason for visit"
                ></textarea>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Date & Time</label>
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Mode of Consult</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="online"
                    type="radio"
                    checked={mode === 'online'}
                    onChange={() => setMode('online')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                    Online Consultation
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="in-person"
                    type="radio"
                    checked={mode === 'in-person'}
                    onChange={() => setMode('in-person')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="in-person" className="ml-3 block text-sm font-medium text-gray-700">
                    In-Person Consultation
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="follow-up"
                    type="radio"
                    checked={type === 'follow-up'}
                    onChange={() => setType('follow-up')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="follow-up" className="ml-3 block text-sm font-medium text-gray-700">
                    Follow-up
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="check-up"
                    type="radio"
                    checked={type === 'check-up'}
                    onChange={() => setType('check-up')}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="check-up" className="ml-3 block text-sm font-medium text-gray-700">
                    Check-up
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment