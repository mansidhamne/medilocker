'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Calendar, User, Video, Pill, Clock } from 'lucide-react'

interface Prescription {
  medicine: string
  dosage: string
  frequency: string
  duration: string
}

interface Appointment {
  patientId: string
  problem: string
  date: string
  time: string
  mode: string
  type: string
  notes: string
  prescription: Prescription[]
}

interface AddAppointmentProps {
  onClose: () => void
  onSave: (appointment: Appointment, appointmentIndex?: number) => void
  existingAppointment?: Appointment
  appointmentIndex?: number
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ onClose, onSave, existingAppointment, appointmentIndex }) => {
  const [appointmentData, setAppointmentData] = useState<Appointment>({
    patientId: '',
    problem: '',
    date: '',
    time: '',
    mode: '',
    type: '',
    notes: '',
    prescription: [
      {
        medicine: '',
        dosage: '',
        frequency: '',
        duration: ''
      }
    ]
  })
  const [patients, setPatients] = useState<{ _id: string, firstName: string, lastName: string }[]>([])

  // Fetch patients from the backend when the modal opens
  useEffect(() => {
    async function fetchPatients() {
      const response = await fetch('https://medi-backend-two.vercel.app/patients')
      const data = await response.json()
      console.log(data);
      setPatients(data)
    }
    fetchPatients()

    if (existingAppointment) {
      setAppointmentData(existingAppointment)
    }
  }, [existingAppointment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    })
  }

  const handlePrescriptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPrescription = appointmentData.prescription.map((prescription, i) =>
      i === index ? { ...prescription, [e.target.name]: e.target.value } : prescription
    )
    setAppointmentData({
      ...appointmentData,
      prescription: updatedPrescription
    })
  }

  const handleAddPrescription = () => {
    setAppointmentData({
      ...appointmentData,
      prescription: [...appointmentData.prescription, { medicine: '', dosage: '', frequency: '', duration: '' }]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(appointmentData, appointmentIndex)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 px-6 py-3 mt-40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {existingAppointment ? 'Edit Appointment' : 'Add Appointment'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                value={appointmentData.patientId}
                onChange={handleChange}
                required
                className="text-black pl-4 w-full py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">
                Complaint
              </label>
              <input
                type="text"
                id="problem"
                name="problem"
                value={appointmentData.problem}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter patient's complaint"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={appointmentData.time}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
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
                  value={appointmentData.mode}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label htmlFor="mode" className="text-sm font-medium text-gray-700 mb-1">
                  Type of Appointment
                </label>
                <select
                  id="type"
                  name="type"
                  value={appointmentData.type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                >
                  <option value="in-person">Check Up</option>
                  <option value="online">Follow Up</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="Notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={appointmentData.notes}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter patient's complaint"
              />
            </div>

            {/* Prescription fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescription
              </label>

              {appointmentData.prescription.map((prescription, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`medicine-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Medicine
                    </label>
                    <input
                      type="text"
                      id={`medicine-${index}`}
                      name="medicine"
                      value={prescription.medicine}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter medicine name"
                    />
                  </div>
                  <div>
                    <label htmlFor={`dosage-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      id={`dosage-${index}`}
                      name="dosage"
                      value={prescription.dosage}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter dosage"
                    />
                  </div>
                  <div>
                    <label htmlFor={`frequency-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      id={`frequency-${index}`}
                      name="frequency"
                      value={prescription.frequency}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter frequency"
                    />
                  </div>
                  <div>
                    <label htmlFor={`duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      id={`duration-${index}`}
                      name="duration"
                      value={prescription.duration}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter duration"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPrescription}
                className="flex items-center text-blue-500 hover:underline"
              >
                <Plus className="mr-1" /> Add another medicine
              </button>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Save Appointment
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddAppointment
