'use client'

import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUserMd } from "react-icons/fa"

type Appointment = {
  id: string
  time: string
  patient: string
  mode: string
  date: string
}

type AppointmentsByDate = {
  [key: string]: Appointment[]
}

const FunctionalCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointmentsData, setAppointmentsData] = useState<AppointmentsByDate>({});

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3000/appointment', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      // Transform data into appointmentsByDate format
      const appointmentsByDate: AppointmentsByDate = {};
      data.forEach((apt: Appointment) => {
        const date = apt.date; // Assuming your API returns date in ISO format
        if (!appointmentsByDate[date]) {
          appointmentsByDate[date] = [];
        }
        appointmentsByDate[date].push(apt);
      });
      setAppointmentsData(appointmentsByDate);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointmentsData({}); // Fallback to empty object on error
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);


  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const renderMode = (mode: string) => { 
    switch (mode) {
      case 'online': return <p>Online</p>
      case 'in-person': return <p>In-Person</p>
      default: return mode
    }
  }

  const selectedDateAppointments = appointmentsData[formatDate(selectedDate)] || []

  return (
    <div className="w-full lg:w-84 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Calendar
          </h2>
          <div className="flex items-center">
            <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-200">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <span className="mx-2 font-medium">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-200">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
            const isSelected = date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear()
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`h-8 w-8 flex items-center justify-center rounded-full
                  ${isToday(date) ? 'bg-blue-500 text-white' : 
                    isSelected ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}
                  ${appointmentsData[formatDate(date)] ? ' text-green-500' : ''}
                `}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
          <FaUserMd className="mr-2 text-green-500" /> 
          {selectedDateAppointments.length > 0 ? `Appointments for ${selectedDate.toLocaleDateString()}` : "No Appointments"}
        </h2>
        <hr className='mb-6'/>
        {selectedDateAppointments.length > 0 ? (
          <ul className="space-y-4">
            {selectedDateAppointments.map((apt) => (
              <li key={apt.id} className="flex items-center space-x-3 text-sm">
                <span className="text-blue-500 font-medium">{apt.time}</span>
                <span className="flex-1">{apt.patient}</span>
                <span className="text-gray-500">{renderMode(apt.mode)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No appointments scheduled for this date.</p>
        )}
      </div>
    </div>
  )
}

export default FunctionalCalendar