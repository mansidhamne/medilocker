// "use client";
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'
// import Navbar from '@/components/common/Navbar';
// import { RiAddFill } from 'react-icons/ri';
// import AddAppointment from '@/components/AddAppointment';
// import { PrescriptionModal } from '@/components/PrescriptionModal';

// interface AppointmentHistory {
//     problem: string;
//     date: string;
//     mode: string;
//     prescription: Prescription[];
// }

// interface Prescription {
//     medicine: string;
//     dosage: string;
//     frequency: string;
//     duration: string;
// }

// const AddPatient = () => {
//   const router = useRouter();
//   const [patientData, setPatientData] = useState({
//     firstName: '',
//     lastName: '',
//     dob: '',
//     age: '',
//     gender: '',
//     contact: '',
//     address: '',
//     weight: '',
//     pulseRate: '',
//     bloodPressure: '',
//     complaints: '',
//     surgeryHistory: ''
//   });

//   const [isOpen, setIsOpen] = useState(false);
//   const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([]);
//   const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
//   const [patientId, setPatientId] = useState('');
//   const [appointmentHistory, setAppointmentHistory] = useState<AppointmentHistory[]>([]);

//   const handleChange = (e : React.ChangeEvent<any>) => {
//     setPatientData({
//       ...patientData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.ChangeEvent<any>) => {
//     e.preventDefault();

//     const dobUtc = new Date(patientData.dob).toISOString();

//     const data = {
//         ...patientData,
//         dob: dobUtc
//     };

//     try {
//       const response = await fetch('http://localhost:3000/patients', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });

//       if (response.ok) {
//         const newPatient = await response.json();
//         setPatientId(newPatient.id); 
//         alert('Patient added successfully!');
//         router.push('/dashboard');
//       } else {
//         alert('Failed to add patient.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong.');
//     }
//   };

//   const handleOpenPrescription = async (item: AppointmentHistory, appointmentIndex: number) => {
//     try {
//         const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments/${appointmentIndex}/prescriptions`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch prescription data');
//         }
    
//         // Parse the JSON response
//         const prescriptionData = await response.json();
    
//         // Set the fetched prescription data and open the modal
//         setCurrentPrescription(prescriptionData || []);
//         setIsOpen(true);
//       } catch (error) {
//         console.error('Error fetching prescription:', error);
//       }
//     };

//   const handleAddAppointment = async (newAppointment: any) => {
//     try {
//         const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newAppointment),
//         });
//         const updatedPatient = await response.json();
//         console.log('Updated patient with new appointment:', updatedPatient);
//       } catch (error) {
//         console.error('Error adding appointment:', error);
//       }
//   };

//   useEffect(() => {
//     // Fetch appointment history when the component is mounted and patientId is set
//     if (patientId) {
//       fetchAppointmentHistory();
//     }
//   }, [patientId]);

//   const fetchAppointmentHistory = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const history = await response.json();
//         setAppointmentHistory(history);
//       } else {
//         console.error('Failed to fetch appointment history.');
//       }
//     } catch (error) {
//       console.error('Error fetching appointment history:', error);
//     }
//   };

//   return (
//     <div className="bg-white">
//     <Navbar/>
//     <div className="bg-white min-h-full w-full flex flex-row gap-10 justify-center">
//       <form className="min-h-screen py-4 px-8 rounded-lg w-full" onSubmit={handleSubmit}>
//         <h2 className="text-2xl mb-6 text-blue-600">Add Patient</h2>
//         <div className="mb-4 flex flex-row justify-between gap-5">
//           <div className='flex flex-col w-full'>
//             <label className="block text-sm font-medium text-gray-700">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={patientData.firstName}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//           <div className='flex flex-col w-full'>
//             <label className="block text-sm font-medium text-gray-700">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={patientData.lastName}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//         </div>
//         <div className="mb-4 flex flex-row justify-between gap-8">
//           <div className="flex flex-col w-1/2">
//             <label className="block text-sm font-medium text-gray-700">Age</label>
//             <input
//               type="number"
//               name="age"
//               value={patientData.age}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//           <div className="flex flex-col w-1/2">
//             <label className="block text-sm font-medium text-gray-700">Gender</label>
//             <select
//               name="gender"
//               value={patientData.gender}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
//             <input
//               type="date"
//               name="dob"
//               value={patientData.dob}
//               onChange={handleChange}
//               placeholder='DD/MM/YYYY'
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//         </div>
//         <div className="mb-4 flex flex-row justify-between gap-8">
//           <div className="flex flex-col w-full">
//             <label className="block text-sm font-medium text-gray-700">Contact</label>
//             <input
//               type="text"
//               name="contact"
//               value={patientData.contact}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <textarea
//               name="address"
//               value={patientData.address}
//               onChange={handleChange}
//               required
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//         </div>
//         {/* <!--- Medical Record --> */}
//         <h2 className="text-2xl mb-6 text-blue-600">Medical Details</h2>
//         <div className="mb-4 flex flex-row justify-between gap-8">
//           <div className='flex flex-col w-full'>
//             <label className="block text-sm font-medium text-gray-700">Weight</label>
//             <input
//               type="number"
//               name="weight"
//               value={patientData.weight}
//               onChange={handleChange}
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="block text-sm font-medium text-gray-700">Pulse Rate</label>
//             <input
//               type="number"
//               name="pulseRate"
//               value={patientData.pulseRate}
//               onChange={handleChange}
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//           <div className="flex flex-col w-full">
//             <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
//             <input
//               type="number"
//               name="bloodPressure"
//               value={patientData.bloodPressure}
//               onChange={handleChange}
//               className="mt-1 p-2 border rounded w-full"
//             />
//           </div>
//         </div>
//         <div className="mb-4 flex flex-row w-full">
//           <div className="flex flex-col w-full">
//               <label className="block text-sm font-medium text-gray-700">Complaints</label>
//               <textarea
//                 name="complaints"
//                 value={patientData.complaints}
//                 onChange={handleChange}
//                 className="mt-1 p-2 border rounded w-full"
//               />
//           </div>
//         </div>
//         <div className="mb-6 flex flex-row w-full">
//           <div className="flex flex-col w-full">
//               <label className="block text-sm font-medium text-gray-700">Surgery History</label>
//               <textarea
//                 name="surgeryHistory"
//                 value={patientData.surgeryHistory}
//                 onChange={handleChange}
//                 className="mt-1 p-2 border rounded w-full"
//               />
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 rounded-full px-6 py-2 text-white"
//         >
//           Submit
//         </button>
//       </form>
//       <div className="bg-zinc-800 rounded-xl w-[800px] mr-10 p-8 my-8">
//         <div className="flex flex-row justify-between">
//           <h1 className="text-white text-3xl">Appointment History</h1>
//           <button 
//             onClick={() => setIsAppointmentOpen(true)}
//             className="bg-blue-600 text-white p-3 rounded-full text-2xl">
//             <RiAddFill/>
//           </button>
//           {isAppointmentOpen && (
//             <AddAppointment 
//               onClose={() => setIsAppointmentOpen(false)} 
//               onSave={handleAddAppointment}
//             />
//           )}
//           </div>
//             <div className="flex flex-col gap-4 my-8">
//             {appointmentHistory.length > 0 ? (
//               appointmentHistory.map((item, index) => (
//                 <div key={index} className={`bg-zinc-700 p-4 rounded-lg border-l-8 ${item.mode === 'In-Person' ? "border-green-200" : "border-yellow-100"}`}>
//                   <div className="flex flex-row justify-between text-white">
//                     <div className="flex flex-col space-y-1">
//                       <h1 className="text-lg font-medium">{item.problem}</h1>
//                       <p className="text-sm text-zinc-300">{item.date}</p>
//                       <p className="text-sm text-zinc-300 font-light">{item.mode}</p>
//                     </div>
//                     <div className="flex items-center">
//                         <button
//                             onClick={() => handleOpenPrescription(item, index)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5"
//                         >
//                            Edit Appointment
//                         </button>
//                       <button
//                         onClick={() => handleOpenPrescription(item, index)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5"
//                       >
//                         Open Prescription
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-zinc-300">No appointments found.</p>
//             )}
//             </div>
//       </div>
//     </div>
//       {isOpen && (
//         <PrescriptionModal 
//           prescription={currentPrescription} 
//           onClose={() => setIsOpen(false)} 
//         />
//       )}
//     </div>
//   );
// };

// export default AddPatient;

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Calendar, Phone, MapPin, Weight, Activity, Heart, FileText, Scissors, Plus } from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import { PrescriptionModal } from '@/components/PrescriptionModal'
import AddAppointment from '@/components/AddAppointment'

interface AppointmentHistory {
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

const AddPatient = () => {
  const router = useRouter()
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    age: '',
    gender: '',
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
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [appointmentHistory, setAppointmentHistory] = useState<AppointmentHistory[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dobUtc = new Date(patientData.dob).toISOString()

    const data = {
      ...patientData,
      dob: dobUtc
    }

    try {
      const response = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const newPatient = await response.json()
        setPatientId(newPatient.id)
        alert('Patient added successfully!')
        router.push('/dashboard')
      } else {
        alert('Failed to add patient.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong.')
    }
  }

  const handleOpenPrescription = async (item: AppointmentHistory, appointmentIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments/${appointmentIndex}/prescriptions`)
      
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

  const handleAddAppointment = async (newAppointment: AppointmentHistory) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      })
      const updatedPatient = await response.json()
      console.log('Updated patient with new appointment:', updatedPatient)
      fetchAppointmentHistory()
    } catch (error) {
      console.error('Error adding appointment:', error)
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchAppointmentHistory()
    }
  }, [patientId])

  const fetchAppointmentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const history = await response.json()
        setAppointmentHistory(history)
      } else {
        console.error('Failed to fetch appointment history.')
      }
    } catch (error) {
      console.error('Error fetching appointment history:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Patient</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
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
                      value={patientData.firstName}
                      onChange={handleChange}
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
                      value={patientData.lastName}
                      onChange={handleChange}
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
                      value={patientData.dob}
                      onChange={handleChange}
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
                    value={patientData.age}
                    onChange={handleChange}
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
                    value={patientData.gender}
                    onChange={handleChange}
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
                      value={patientData.contact}
                      onChange={handleChange}
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
                    value={patientData.address}
                    onChange={handleChange}
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
                      value={patientData.weight}
                      onChange={handleChange}
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
                      value={patientData.pulseRate}
                      onChange={handleChange}
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
                      value={patientData.bloodPressure}
                      onChange={handleChange}
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
                    value={patientData.complaints}
                    onChange={handleChange}
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
                    value={patientData.surgeryHistory}
                    onChange={handleChange}
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
                  Add Patient
                </button>
              </div>
            </form>
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
                  onClick={() => setIsAppointmentOpen(true)}
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
                        <button
                          onClick={() => handleOpenPrescription(item, index)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          View Prescription
                        </button>
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

      {isOpen && (
        <PrescriptionModal 
          prescription={currentPrescription} 
          onClose={() => setIsOpen(false)} 
        />
      )}

      {isAppointmentOpen && (
        <AddAppointment 
          onClose={() => setIsAppointmentOpen(false)} 
          onSave={handleAddAppointment}
        />
      )}
    </div>
  )
}

export default AddPatient