"use client"
import Navbar from '@/components/common/Navbar'
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { MdOutlineEditCalendar } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { BiInjection } from "react-icons/bi";
import PatientTable from '@/components/PatientTable';
import { motion } from 'framer-motion';
import FunctionalCalendar from '@/components/FunctionalCalendar';


const DoctorDashboard = () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalOnlineAppointments, setTotalOnlineAppointments] = useState(0);

  useEffect(() => {
    const fetchTotalAppointments = async () => {
      try {
        const response = await fetch('https://medi-backend-two.vercel.app/appointment/total');
        const data = await response.json();
        setTotalAppointments(data.total);
      } catch (error) {
        console.error('Error fetching total appointments:', error);
      }
    };

    fetchTotalAppointments();
  }, []);

  useEffect(() => {
    const fetchTotalOnlineAppointments = async () => {
      try {
        const response = await fetch('https://medi-backend-two.vercel.app/appointment/total-online');
        const data = await response.json();
        setTotalOnlineAppointments(data.total);
      } catch (error) {
        console.error('Error fetching total online appointments:', error);
      }
    };
  
    fetchTotalOnlineAppointments();
  }, []);


  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen w-full pb-6">
      <Navbar />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome, Dr. Mansi Dhamne</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <MdOutlineEditCalendar className="text-4xl text-teal-500 bg-teal-100 rounded-full p-2 mr-4" />
                  <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
                </div>
                <p className="text-4xl font-bold text-teal-600">{totalAppointments}</p>
                <Link href="/appointments" className="text-teal-500 hover:text-teal-600 mt-2 inline-block">
                  View all
                </Link>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <IoCall className="text-4xl text-yellow-500 bg-yellow-100 rounded-full p-2 mr-4" />
                  <h2 className="text-xl font-semibold text-gray-700">Call Consultancy</h2>
                </div>
                <p className="text-4xl font-bold text-yellow-600">{totalOnlineAppointments}</p>
                <Link href="/consultations" className="text-yellow-500 hover:text-yellow-600 mt-2 inline-block">
                  View details
                </Link>
              </motion.div>

              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <BiInjection className="text-4xl text-red-500 bg-red-100 rounded-full p-2 mr-4" />
                  <h2 className="text-xl font-semibold text-gray-700">Surgeries</h2>
                </div>
                <p className="text-4xl font-bold text-red-600">2</p>
                <Link href="/surgeries" className="text-red-500 hover:text-red-600 mt-2 inline-block">
                  View schedule
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-blue-600">Patient Records</h2>
                <Link href="/patients/add">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                    Add Patient
                  </button>
                </Link>
              </div>
              <PatientTable />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            //className="w-full lg:w-80 space-y-6"
          >
            <FunctionalCalendar/>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard