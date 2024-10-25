'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Bell, User, Calendar, FileText, Activity, Edit, MessageCircle, Upload } from 'lucide-react'
import NavbarPatient from '@/components/common/NavbarPatient'
import Link from 'next/link'
import { PrescriptionModal } from '@/components/PrescriptionModal'

interface Prescription {
  medicine: string
  dosage: string
  duration: string
  frequency: string
}

interface Appointment {
  _id: string
  doctorName: string
  date: string
  time: string
  location: string
  problem: string
  mode: 'in-person' | 'online'
  type: 'check-up' | 'follow-up'
  prescription?: Prescription[]
}

interface Report {
  id: string
  name: string
  type: 'personal' | 'medical'
  date?: string
  fileUrl: string
}

interface PatientInfo {
  _id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  dob: string
  address: string
  contact: string
  weight: number
  height: number
  bloodGroup: string
  pulseRate: number
  bloodPressure: number
  //disorders: string
  surgeryHistory: string
}

const PatientDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null); // State to store user data
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    _id: "",
    firstName: "",
    lastName: "",
    age: 0,
    dob: "",
    address: "",
    gender: "",
    contact: "",
    weight: 0,
    height: 0,
    bloodGroup: "",
    pulseRate: 0,
    bloodPressure: 0,
    surgeryHistory: "",
  })
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: "Hi! This is MediMate! How can i assist you?", sender: 'bot' }
  ])

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse the user data and store it in state
        }
    }, []);

    useEffect(() => {
      const fetchPatientInfo = async () => {
        if (user) {
          try {
            const response = await fetch(`http://localhost:3000/patients/find-by-firstName/Swara`)
            if (response.ok) {
              const data = await response.json()
              setPatientInfo(data)
            } else {
              console.error('Failed to fetch patient info')
            }
          } catch (error) {
            console.error('Error fetching patient info:', error)
          } finally {
            setLoading(false)
          }
        }
      }

      fetchPatientInfo()
    }, [user])

    const fetchPatientId = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:3000/patients/find-by-id/Swara`)
          if (response.ok) {
            const data = await response.json()
            return data.patientId
          } else {
            console.error('Failed to fetch patient info')
          }
        } catch (error) {
          console.error('Error fetching patient info:', error)
        }
      }
    }

    const handleView = (fileUrl: string) => {
      window.open(fileUrl, '_blank')
    }
  
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      const patientId = "6717d33389614a5d7f3f6827"
      if (file) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'medical') // You might want to add a way to select the type
        formData.append('patientId', patientId)
        
        try {
          const response = await fetch('http://localhost:3000/reports/upload', {
            method: 'POST',
            body: formData,
          })
  
          if (response.ok) {
            const newReport = await response.json()
            setReports([...reports, newReport])
          } else {
            console.error('Failed to upload report')
          }
        } catch (error) {
          console.error('Error uploading report:', error)
        } finally {
          setIsUploading(false)
        }
      }
    }

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const userId = await fetchPatientId();
          const response = await fetch(`http://localhost:3000/patients/${userId}/appointments`, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'GET',
          })
          if (response.ok) {
            const data = await response.json()
            setAppointments(data)

            const today = new Date();
            const filteredUpcoming = data.filter((appointment: Appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today; // Only keep upcoming appointments
            });

            const filteredHistory = data.filter((appointment: Appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < today; // Only keep past appointments
            });

            setAppointmentHistory(filteredHistory);
            setUpcomingAppointments(filteredUpcoming);
          } else {
            console.error('Failed to fetch appointments')
          }
        } catch (error) {
          console.error('Error fetching appointments:', error)
        }
      }
    }

    fetchAppointments()
  })

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      console.error('Invalid time value')
      return ''
    }
    return date.toISOString().split('T')[0] // Extracts the "yyyy-MM-dd" part
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:3000/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        console.error('Failed to fetch reports')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const popularReports: { [key: string]: string } = {
    'Blood Test': 'https://img.freepik.com/free-photo/hand-with-protective-gloves-holding-blood-samples-covid-test_23-2148958366.jpg?ga=GA1.1.1059406992.1728971711&semt=ais_hybrid',
    'X-Ray': 'https://img.freepik.com/free-vector/human-bones-realistic-x-ray-shots_1284-29690.jpg?ga=GA1.1.1059406992.1728971711&semt=ais_hybrid',
    'MRI Scan': 'https://media.istockphoto.com/id/522675931/photo/mri-image-brain-on-black-background.jpg?s=612x612&w=0&k=20&c=KNIxHpoXGN2MBu-PXaWMqLmIIKEHGTYs4-FSor1uB_Q=',
    'CT Scan': 'https://media.istockphoto.com/id/503663386/photo/patient-lying-inside-a-medical-scanner-in-hospital.jpg?s=612x612&w=0&k=20&c=GOXVtNCG9AmmkdilutdyxbuO_As1J5sieqQVv9jfxkk=',
    // Add more reports and their image links here
  }

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem('chatInput') as HTMLInputElement
    const userMessage = input.value.trim()
    if (userMessage) {
      setChatMessages([...chatMessages, { text: userMessage, sender: 'user' }])
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: "Check out the offical page of MediMate to chat in detail!", sender: 'bot' }])
      }, 1000)
      input.value = ''
    }
  }

  const handleOpenPrescription = async (patientId: string, item: Appointment, appointmentIndex: number) => {
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


const removePdfExtension = (fileName: string) => {
  return fileName.replace('.pdf', '') // Remove .pdf extension
}

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarPatient/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="mr-2" />
                Upcoming Appointments
              </h2>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div className="bg-blue-50 p-4 rounded-md" key={appointment._id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-600">{appointment.date}, {appointment.time}, {appointment.location}</p>
                        <p className="text-sm text-gray-600">{appointment.problem}</p>
                      </div>
                      {appointment.mode === 'online' && (
                        <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                          Join Call
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming appointments</p>
              )}
              
              
            </section>

            <section className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2" />
                  Uploaded Documents
                </h2>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                  Upload
                </button> */}
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-2.5 py-1 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                  <Upload className="w-3 h-3 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                  </label>
            </div>
              </div>
              {/* <div 
                onClick={() => handleView(reports[0].fileUrl)}
                className="grid grid-cols-5 gap-4 hover:cursor-pointer">
                {reports.map((doc) => (
                  <div key={doc.id} className="text-center hover:bg-slate-400">
                    {/* <Image src={doc.imageUrl} alt={doc.name} width={100} height={100} className="mx-auto mb-2 rounded-md" /> 
                    <p className="text-sm font-medium">{doc.name}</p>
                  </div>
                ))}
              </div> */}
              <div
                onClick={() => handleView(reports[0]?.fileUrl)}
                className="grid grid-cols-5 gap-4 hover:cursor-pointer"
              >
                {reports.map((doc) => (
                  <div key={doc.id} className="text-center hover:bg-slate-400">
                    {popularReports[removePdfExtension(doc.name)] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={popularReports[removePdfExtension(doc.name)]} // Display image based on report name
                        alt={doc.name}
                        width={100}
                        height={100}
                        className="mx-auto mb-2 rounded-md"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-gray-200 mx-auto mb-2 rounded-md flex items-center justify-center">
                        <p className="text-sm font-medium">No Image</p>
                      </div>
                    )}
                    <p className="text-sm font-medium">{removePdfExtension(doc.name)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-800 text-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="mr-2" />
                Appointment History
              </h2>
              <div className="space-y-4">
                {appointmentHistory.map((appointment, index) => (
                  <div key={appointment._id} className="bg-gray-700 p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{appointment.problem}</h3>
                        <p className="text-sm text-gray-300">{appointment.date}</p>
                        <p className="text-sm text-gray-300">{appointment.mode === 'online' ? 'Online Consultancy' : 'In-Person Consultancy'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick = {() => handleOpenPrescription(patientInfo._id, appointment, index)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                          Open Prescription
                        </button>
                      </div>
                    </div>
                    <p className="text-right mt-2 text-gray-400">{appointment.doctorName}</p>
                  </div>
                ))}
              </div>
              {isOpen && (
                <PrescriptionModal 
                  prescription={currentPrescription} 
                  onClose={() => setIsOpen(false)} 
                />
              )}
            </section>
          </div>

          {!loading && (
            <div className="space-y-8">
            <section className="bg-blue-600 text-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{patientInfo.firstName} {patientInfo.lastName}</h2>
                <Link href="/profile/patient">  
                  <Edit className="cursor-pointer" />
                </Link>
              </div>
              {/* <p className="mb-4">Patient ID: {patientInfo._id}</p> */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <User className="mr-2" />
                  General Information
                </h3>
                <p>Age: {patientInfo.age}</p>
                <p>Gender: {patientInfo.gender}</p>
                <p>Date of Birth: {formatDate(patientInfo.dob)}</p>
                <p>Address: {patientInfo.address}</p>
                <p>Phone No: {patientInfo.contact}</p>
              </div>
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <Activity className="mr-2" />
                  Medical Information
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>Weight: {patientInfo.weight}KG</p>
                  <p>Height: {patientInfo.height}cm</p>
                  <p>Blood Group: {patientInfo.bloodGroup}</p>
                  <p>Sugar Level: {patientInfo.pulseRate}</p>
                </div>
                <p>Blood Pressure: {patientInfo.bloodPressure}</p>
                <p>Surgery History: {patientInfo.surgeryHistory}</p>
              </div>
            </section>

            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageCircle className="mr-2" />
                Chat With Our Health Bot: MediMate
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Our health bot is trained to answer your doubts regarding common symptoms and basic treatments until your doctor&apos;s appointment!
              </p>
              <button 
                onClick={() => setChatOpen(true)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Chat
              </button>
            </section>
          </div>
          )}
          
        </div>
      </main>

      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-teal-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">MediMate</h3>
            <button onClick={() => setChatOpen(false)} className="text-white">&times;</button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3/4 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                name="chatInput"
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-md"
              />
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-md">Send</button>
            </div>
          
          </form>
        </div>
      )}
    </div>
  )
}

export default PatientDashboard