'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pill } from 'lucide-react'

interface PrescriptionModalProps {
  prescription: Prescription[]
  onClose: () => void
}

interface Prescription {
  medicine: string
  dosage: string
  frequency: string
  duration: string
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 h-screen"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-white rounded-lg w-full max-w-2xl p-8 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Pill className="mr-2 text-blue-500" />
              Prescription Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {prescription && prescription.length > 0 ? (
            <div className="space-y-6">
              {prescription.map((item: Prescription, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 shadow"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Medicine</p>
                      <p className="text-lg font-semibold text-gray-800">{item.medicine}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dosage</p>
                      <p className="text-lg font-semibold text-gray-800">{item.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Frequency</p>
                      <p className="text-lg font-semibold text-gray-800">{item.frequency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="text-lg font-semibold text-gray-800">{item.duration}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No prescription details available.</p>
          )}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}