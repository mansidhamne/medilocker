'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Calendar, Phone, MapPin, Weight, Activity, Heart, FileText, Scissors, Plus, Edit } from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import { PrescriptionModal } from '@/components/PrescriptionModal'
import AddAppointment from '@/components/AddAppointment'

interface Appointment {
  problem: string
  date: string
  mode: string
  prescription: Prescription[]
}

interface Prescription {
  medicine: string
  dosage: string
  frequency: string
  duration: string
}

const EditPatient = () => {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [patient, setPatient] = useState(null)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    dob: '',
    contact: '',
    address: '',
    weight: '',
    pulseRate: '',
    bloodPressure: '',
    complaints: '',
    surgeryHistory: ''
  })
  const [isOpen, setIsOpen] = useState(false)
  const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([])
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([])
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [editingAppointmentIndex, setEditingAppointmentIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:3000/patients/${id}`)
          const patientData = await response.json()
          const formattedDob = new Date(patientData.dob).toISOString().slice(0, 10)
          const updatedPatientData = {
            ...patientData,
            dob: formattedDob,
          }
          setPatient(updatedPatientData)
          setFormValues(updatedPatientData)
        } catch (error) {
          console.error('Error fetching patient:', error)
        }
      }
    }
    fetchPatient()
    fetchAppointmentHistory()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dobUtc = new Date(formValues.dob).toISOString()
    const updatedPatient = {
      ...formValues,
      dob: dobUtc,
    }
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      })
      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to update patient')
      }
    } catch (error) {
      console.error('Error updating patient:', error)
    }
  }

  const handleOpenPrescription = async (item: Appointment, appointmentIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments/${appointmentIndex}/prescriptions`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescription data')
      }
  
      const prescriptionData = await response.json()
      setCurrentPrescription(prescriptionData || [])
      setIsOpen(true)
    } catch (error) {
      console.error('Error fetching prescription:', error)
    }
  }

  const handleSaveAppointment = async (appointment: Appointment, index?: number) => {
    if (index !== undefined) {
      await handleEditAppointment(appointment, index)
    } else {
      await handleAddAppointment(appointment)
    }
  }

  const handleAddAppointment = async (newAppointment: Appointment) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      })
      if (response.ok) {
        fetchAppointmentHistory()
        setIsAppointmentModalOpen(false)
      } else {
        throw new Error('Failed to add appointment')
      }
    } catch (error) {
      console.error('Error adding appointment:', error)
    }
  }

  const handleEditAppointment = async (appointment: Appointment, appointmentIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments/${appointmentIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      })
      if (response.ok) {
        fetchAppointmentHistory()
        setIsAppointmentModalOpen(false)
        setEditingAppointment(null)
        setEditingAppointmentIndex(null)
      } else {
        throw new Error('Failed to edit appointment')
      }
    } catch (error) {
      console.error('Error editing appointment:', error)
    }
  }

  const openEditAppointmentModal = (appointment: Appointment, index: number) => {
    setEditingAppointment(appointment)
    setEditingAppointmentIndex(index)
    setIsAppointmentModalOpen(true)
  }

  const fetchAppointmentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments`)
      if (response.ok) {
        const history = await response.json()
        setAppointmentHistory(history)
      } else {
        throw new Error('Failed to fetch appointment history')
      }
    } catch (error) {
      console.error('Error fetching appointment history:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Patient</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            {patient ? (
              <form onSubmit={handleFormSubmit} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6">Patient Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dob">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formValues.dob}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formValues.age}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formValues.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact">
                      Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formValues.contact}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      id="address"
                      name="address"
                      value={formValues.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-blue-600 mt-8 mb-6">Medical Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weight">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formValues.weight}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pulseRate">
                      Pulse Rate (bpm)
                    </label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        id="pulseRate"
                        name="pulseRate"
                        value={formValues.pulseRate}
                        onChange={handleInputChange}
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bloodPressure">
                      Blood Pressure (mmHg)
                    </label>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        
                        type="text"
                        id="bloodPressure"
                        name="bloodPressure"
                        value={formValues.bloodPressure}
                        onChange={handleInputChange}
                        placeholder="e.g., 120/80"
                        className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="complaints">
                    Complaints
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      id="complaints"
                      name="complaints"
                      value={formValues.complaints}
                      onChange={handleInputChange}
                      rows={3}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="surgeryHistory">
                    Surgery History
                  </label>
                  <div className="relative">
                    <Scissors className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      id="surgeryHistory"
                      name="surgeryHistory"
                      value={formValues.surgeryHistory}
                      onChange={handleInputChange}
                      rows={3}
                      className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Patient
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Appointment History</h2>
                <button 
                  onClick={() => {
                    setEditingAppointment(null)
                    setEditingAppointmentIndex(null)
                    setIsAppointmentModalOpen(true)
                  }}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus size={24} />
                </button>
              </div>
              {appointmentHistory.length > 0 ? (
                <div className="space-y-4">
                  {appointmentHistory.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gray-50 p-4 rounded-lg shadow ${
                        item.mode === 'In-Person' ? "border-l-4 border-green-400" : "border-l-4 border-yellow-400"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{item.problem}</h3>
                          <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{item.mode}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openEditAppointmentModal(item, index)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenPrescription(item, index)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            View Prescription
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No appointments found.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {isAppointmentModalOpen && (
        <AddAppointment 
          onClose={() => {
            setIsAppointmentModalOpen(false)
            setEditingAppointment(null)
            setEditingAppointmentIndex(null)
          }} 
          onSave={handleSaveAppointment}
          existingAppointment={editingAppointment || undefined}
          appointmentIndex={editingAppointmentIndex !== null ? editingAppointmentIndex : undefined}
        />
      )}

      {isOpen && (
        <PrescriptionModal 
          prescription={currentPrescription} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  )
}

export default EditPatient


