// import Image from 'next/image'
// import { Bell, User } from 'lucide-react'
// import { useEffect, useState } from 'react';
// import { PrescriptionModal } from './PrescriptionModal';
// import AddAppointment from './AddAppointment';

// type Prescription = {
//   medicine: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
// };

// type Appointment = {
//   problem: string;
//   date: string;
//   mode: string;
//   type: string;
//   notes: string;
//   prescription: Prescription[];
// };

// type PatientDetailsProps = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   age: number;
//   dob: string;
//   gender: string;
//   contact: string;
//   address: string;
//   weight: number;
//   pulseRate: number;
//   bloodPressure: number;
//   complaints: string;
//   surgeryHistory: string;
//   appointmentHistory: Appointment[];
// }
// export default function PatientDetails({ id }: { id: string }) {
//   const [patientData, setPatientData] = useState<PatientDetailsProps | null>(null);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([]);
//   const [newAppointment, setNewAppointment] = useState<Appointment>({
//     problem: '',
//     date: '',
//     mode: '',
//     type: '',
//     notes: '',
//     prescription: [],
//   });

//   const fetchPatientData = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/patients/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       setPatientData(data);
//     } catch (error) {
//       console.error('Error fetching patient data:', error);
//     }
//   }

//   useEffect(() => {
//     fetchPatientData();
//   }, [id]);

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data: Appointment[] = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAppointments();
//   }, [id]);

//   const handleOpenPrescription = async (item: Appointment, appointmentIndex: number) => {
//     try {
//       const response = await fetch(`http://localhost:3000/patients/${id}/appointments/${appointmentIndex}/prescriptions`)
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch prescription data')
//       }
  
//       const prescriptionData = await response.json()
  
//       setCurrentPrescription(prescriptionData || [])
//       setIsOpen(true)
//     } catch (error) {
//       console.error('Error fetching prescription:', error)
//     }
//   }

//   const handleAddAppointment = async (appointment: Appointment) => {
//     try {
//       const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newAppointment),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to add appointment');
//       }

//       const data: Appointment = await response.json();
//       setAppointments([...appointments, data]);
//     } catch (error) {
//       console.error('Error adding appointment:', error);
//     }
//   }

//   if (!patientData) {
//     return <div>Loading...</div>; // or some loading indicator
//   }

//   return (
//     <div className="bg-gray-100">
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
//         <div className="grid grid-cols-7 gap-8">
//           <div className="col-span-7 bg-white shadow rounded-lg p-6">
//             <h2 className="text-2xl font-bold mb-2 text-center underline underline-offset-2">{patientData.firstName} {patientData.lastName}</h2>
//             <div className="flex items-center justify-between">
//               <h4 className="text-lg text-left"><span className="font-medium">Doctor: </span>Dr. Stephen Alfred</h4>
//               <h4 className="text-lg text-right"><span className="font-medium">Hospital: </span>Bethany</h4>
//             </div>
//             <hr className="my-4"/>
//             <h4 className="text-lg font-semibold mb-2 underline underline-offset-2">Personal Details</h4>
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div>
//                 <p className="text-lg"><span className="font-medium">Patient Name: </span>{patientData.firstName} {patientData.lastName}</p>
//                 <p className="text-lg"><span className="font-medium">Gender: </span> {patientData.gender}</p>
//                 <p className="text-lg"><span className="font-medium">Contact: </span> {patientData.contact}</p>
//                 {/* <p><span className="font-medium">Doctor Name:</span> {patientData.doctorName}</p> */}
//               </div>
//               <div>
//                 <p className="text-lg"><span className="font-medium">Age:</span> {patientData.age}</p>
//                 <p className="text-lg"><span className="font-medium">DOB:</span> {patientData.dob}</p>
//                 <p className="text-lg"><span className="font-medium">Address:</span> {patientData.address}</p>
//               </div>
//             </div>
//             <hr className="my-4"/>
//             <h4 className="text-lg font-semibold mb-2 underline underline-offset-2">Medical Details</h4>
//             <div className="grid grid-cols-3 mb-6">
//                 <p className="text-lg"><span className="font-medium">Weight: </span>{patientData.weight}</p>
//                 <p className="text-lg"><span className="font-medium">Pulse Rate: </span> {patientData.pulseRate}</p>
//                 <p className="text-lg"><span className="font-medium">Blood Pressure: </span> {patientData.bloodPressure}</p>
//                 <p className="text-lg"><span className="font-medium">Surgery History: </span> {patientData.surgeryHistory}</p>
//             </div>
//             <hr className="mb-4"/>
//             <h3 className="text-lg font-semibold mb-2">Reports</h3>
//             <div className="grid grid-cols-4 gap-4 mb-6">
//               {['Blood Report', 'Liver Report', 'ECG', 'Kidney Report'].map((report) => (
//                 <div key={report} className="bg-gray-100 p-4 rounded-lg text-center">
//                   <Image src="/placeholder.svg" alt={report} width={100} height={100} className="mx-auto mb-2" />
//                   <p className="text-sm font-medium">{report}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Appointment History</h3>
//               <button 
//                 onClick={() => setIsModalOpen(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
//                 Add Appointment
//               </button>
//               {isModalOpen  && (
//                 <AddAppointment
//                   onClose={() => setIsModalOpen(false)}
//                   onSave={handleAddAppointment}
//                 />
//               )}
//             </div>
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Date</th>
//                   <th className="px-4 py-2 text-left">Complaint</th>
//                   <th className="px-4 py-2 text-left">Notes</th>
//                   <th className="px-4 py-2 text-left">Prescription</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appointments.map((appointment, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-2">{new Date(appointment.date).toLocaleDateString()}</td>
//                     <td className="px-4 py-2">{appointment.problem}</td>
//                     <td className="px-4 py-2">{appointment.notes}</td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => handleOpenPrescription(appointment, index)}
//                         className="text-blue-600 hover:text-blue-800 transition-colors"
//                       >
//                         View Prescription
//                       </button>
//                       {isOpen && (
//                         <PrescriptionModal 
//                           prescription={currentPrescription} 
//                           onClose={() => setIsOpen(false)} 
//                         />
//                         )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
        
//       </main>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Bell, User } from 'lucide-react'
import { PrescriptionModal } from './PrescriptionModal'
import AddAppointment from './AddAppointment'

type Prescription = {
  medicine: string
  dosage: string
  frequency: string
  duration: string
}

type Appointment = {
  problem: string
  date: string
  mode: string
  type: string
  notes: string
  prescription: Prescription[]
}

type PatientDetailsProps = {
  _id: string
  firstName: string
  lastName: string
  age: number
  dob: string
  gender: string
  contact: string
  address: string
  weight: number
  pulseRate: number
  bloodPressure: number
  complaints: string
  surgeryHistory: string
  appointmentHistory: Appointment[]
}

export default function PatientDetails({ id }: { id: string }) {
  const [patientData, setPatientData] = useState<PatientDetailsProps | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([])

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setPatientData(data)
    } catch (error) {
      console.error('Error fetching patient data:', error)
    }
  }

  useEffect(() => {
    fetchPatientData()
  }, [id])

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data: Appointment[] = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [id])

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

  const handleAddAppointment = async (appointment: Appointment) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      })

      if (!response.ok) {
        throw new Error('Failed to add appointment')
      }

      const data: Appointment = await response.json()
      setAppointments([...appointments, data])
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding appointment:', error)
    }
  }

  if (!patientData) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
        <div className="grid grid-cols-7 gap-8">
          <div className="col-span-7 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2 text-center underline underline-offset-2">{patientData.firstName} {patientData.lastName}</h2>
            <div className="flex items-center justify-between">
              <h4 className="text-lg text-left"><span className="font-medium">Doctor: </span>Dr. Stephen Alfred</h4>
              <h4 className="text-lg text-right"><span className="font-medium">Hospital: </span>Bethany</h4>
            </div>
            <hr className="my-4"/>
            <h4 className="text-lg font-semibold mb-2 underline underline-offset-2">Personal Details</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-lg"><span className="font-medium">Patient Name: </span>{patientData.firstName} {patientData.lastName}</p>
                <p className="text-lg"><span className="font-medium">Gender: </span> {patientData.gender}</p>
                <p className="text-lg"><span className="font-medium">Contact: </span> {patientData.contact}</p>
              </div>
              <div>
                <p className="text-lg"><span className="font-medium">Age: </span> {patientData.age}</p>
                <p className="text-lg"><span className="font-medium">DOB: </span>{new Date(patientData.dob).toLocaleDateString()}</p>
                <p className="text-lg"><span className="font-medium">Address: </span> {patientData.address}</p>
              </div>
            </div>
            <hr className="my-4"/>
            <h4 className="text-lg font-semibold mb-2 underline underline-offset-2">Medical Details</h4>
            <div className="grid grid-cols-3 mb-6">
                <p className="text-lg"><span className="font-medium">Weight: </span>{patientData.weight}</p>
                <p className="text-lg"><span className="font-medium">Pulse Rate: </span> {patientData.pulseRate}</p>
                <p className="text-lg"><span className="font-medium">Blood Pressure: </span> {patientData.bloodPressure}</p>
                <p className="text-lg"><span className="font-medium">Surgery History: </span> {patientData.surgeryHistory}</p>
            </div>
            <hr className="mb-4"/>
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {['Blood Report', 'Liver Report', 'ECG', 'Kidney Report'].map((report) => (
                <div key={report} className="bg-gray-100 p-4 rounded-lg text-center">
                  <Image src="/placeholder.svg" alt={report} width={100} height={100} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{report}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Appointment History</h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                Add Appointment
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Complaint</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                  <th className="px-4 py-2 text-left">Prescription</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{appointment.problem}</td>
                    <td className="px-4 py-2">{appointment.notes}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleOpenPrescription(appointment, index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Prescription
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {isOpen && (
        <PrescriptionModal 
          prescription={currentPrescription} 
          onClose={() => setIsOpen(false)} 
        />
      )}
      {isModalOpen && (
        <AddAppointment
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddAppointment}
        />
      )}
    </div>
  )
}