'use client'

import { use, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Folder, Search, User } from 'lucide-react'
import PatientDetails from '@/components/PatientDetails' // Assuming the previous component is in this file
import Navbar from '@/components/common/Navbar'

type Patient = {
  _id: string
  firstName: string
  lastName: string
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function PatientDirectory() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [patientsData, setPatientsData] = useState<Patient[]>([])

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:3000/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setPatientsData(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);
  
  const filteredPatients = patientsData.filter(patient => 
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedPatients = alphabet.reduce((acc, letter) => {
    acc[letter] = filteredPatients.filter(patient => patient.firstName.toUpperCase().startsWith(letter))
    return acc
  }, {} as Record<string, Patient[]>)

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null)
      setSelectedPatient(null)
    } else {
      setSelectedLetter(letter)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-8">
      <Navbar />
      <div className="px-12">
      <h1 className="text-3xl font-semibold my-8">Patient Directory</h1>
      <div className="mb-6 flex gap-4 w-full">
        <input
          type="text"
          placeholder="Search patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <button className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <Search className="inline-block text-lg" />
        </button>
      </div>
      <motion.div 
        className="grid gap-8"
        initial={false}
        animate={{
          gridTemplateColumns: selectedPatient ? "300px 1fr" : "1fr",
        }}
      >
        <motion.div 
          className="bg-gray-800 text-white rounded-lg shadow p-6 h-[calc(100vh-200px)] overflow-y-auto"
          animate={{
            width: selectedPatient ? "300px" : "100%",
          }}
        >
          {alphabet.map(letter => (
            <motion.div key={letter} layout>
              <button
                className="w-full text-left mb-2 px-4 py-2 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => handleLetterClick(letter)}
              >
                <Folder className="inline-block mr-4 h-4 w-4" />
                {letter}
                {selectedLetter === letter ? (
                  <ChevronDown strokeWidth={2} size={24} className="float-right" />
                ) : (
                  <ChevronRight strokeWidth={2} size={24} className="float-right" />
                )}
              </button>
              <AnimatePresence>
                {selectedLetter === letter && groupedPatients[letter].length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 space-y-2"
                  >
                    {groupedPatients[letter].map(patient => (
                      <motion.li
                        key={patient._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <User className="inline-block mr-2 h-4 w-4" />
                          {patient.firstName} {patient.lastName}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        <AnimatePresence>
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow p-6 h-[calc(100vh-200px)] overflow-y-auto"
            >
              <PatientDetails id={selectedPatient._id} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    </div>
  )
}