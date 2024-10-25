'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Edit, Save, ArrowLeft } from 'lucide-react'
import NavbarPatient from '@/components/common/NavbarPatient'
import Link from 'next/link'

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
    surgeryHistory: string
  }

const PatientProfile: React.FC = () => {
  const router = useRouter()
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
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse the user data and store it in state
        }
    }, []);

    console.log(user);

    const fetchPatientID = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:3000/patients/find-by-id/Swara`)
                if (response.ok) {
                const data = await response.json()
                return data.patientId
                } else {
                console.error('Failed to fetch patient id')
                }
            } catch (error) {
                console.error('Error fetching patient id', error)
            } 
        }
    }

    const userId = fetchPatientID();
    console.log(userId);

    useEffect(() => {
    const fetchPatientInfo = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:3000/patients/find-by-firstName/Swara`)
                if (response.ok) {
                  const data = await response.json()
                  const patientId = data._id
                  setPatientInfo(data)
                } else {
                  console.error('Failed to fetch patient info')
                }
              } catch (error) {
                console.error('Error fetching patient info:', error)
              } finally {
                setIsLoading(false)
              }
        }
    }

    fetchPatientInfo()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPatientInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const userId = await fetchPatientID()
      const response = await fetch(`http://localhost:3000/patients/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientInfo),
      })
      if (response.ok) {
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toISOString().split('T')[0] // Extracts the "yyyy-MM-dd" part
  }
  

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-0 px-4 sm:px-6 lg:px-8">
    <NavbarPatient />
      <div className="max-w-5xl mx-auto py-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Patient Profile</h1>
              <Link href="/dashboard/patient">
                <button
                    className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
          <div className="px-6 py-8">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  {user ? (
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                  ) : (
                    <h2 className="text-2xl font-bold">Vanashree Tajane</h2>
                  )}
                  {/* <h2 className="text-2xl font-semibold text-gray-800">{patientInfo.firstName} {patientInfo.lastName}</h2> */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    Edit Profile
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField label="Patient ID" value={patientInfo._id} />
                  <ProfileField label="Age" value={patientInfo.age || 'Not specified'} />
                  <ProfileField label="Gender" value={patientInfo.gender || 'Not specified'} />
                  <ProfileField label="Date of Birth" value={patientInfo.dob ? formatDate(patientInfo.dob) : "Not specified"} />
                  <ProfileField label="Phone Number" value={patientInfo.contact || 'Not specified'} />
                  <ProfileField label="Address" value={patientInfo.address || 'Not specified'} />
                  <ProfileField label="Weight" value={patientInfo.weight ? `${patientInfo.weight} kg` : 'Not specified'} />
                  <ProfileField label="Height" value={patientInfo.height ? `${patientInfo.height} cm` : 'Not specified'} />
                  <ProfileField label="Blood Group" value={patientInfo.bloodGroup || 'Not specified'} />
                  <ProfileField label="Sugar Level" value={patientInfo.pulseRate || 'Not specified'} />
                  <ProfileField label="Disorders" value={patientInfo.bloodPressure || 'None'} />
                  <ProfileField label="Surgery History" value={patientInfo.surgeryHistory || 'None'} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user ? (
                    <InputField label="Full Name" name="name" value={user.name} onChange={handleInputChange} />
                  ) : (
                    <InputField label="Full Name" name="name" value={`${patientInfo.firstName} ${patientInfo.lastName}`} onChange={handleInputChange} />
                  )}
                  <InputField label="Patient ID" name="id" value={patientInfo._id} onChange={handleInputChange} readOnly />
                  <InputField label="Age" name="age" value={patientInfo.age} onChange={handleInputChange} type="number" />
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={patientInfo.gender}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Select Gender" },
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                  <InputField label="Date of Birth" name="dob" value={formatDate(patientInfo.dob)} onChange={handleInputChange} type="date" />
                  <InputField label="Phone Number" name="contact" value={patientInfo.contact} onChange={handleInputChange} />
                  <InputField label="Address" name="address" value={patientInfo.address} onChange={handleInputChange} />
                  <InputField label="Weight (kg)" name="weight" value={patientInfo.weight} onChange={handleInputChange} type="number" />
                  <InputField label="Height (cm)" name="height" value={patientInfo.height} onChange={handleInputChange} type="number" />
                  <SelectField
                    label="Blood Group"
                    name="bloodGroup"
                    value={patientInfo.bloodGroup}
                    onChange={handleInputChange}
                    options={[
                      { value: "", label: "Select Blood Group" },
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                    ]}
                  />
                  <InputField label="Sugar Level" name="pulseRate" value={patientInfo.pulseRate} onChange={handleInputChange} type="number" />
                  <InputField label="Blood Pressure" name="bloodPressure" value={patientInfo.bloodPressure} onChange={handleInputChange} />
                  <InputField label="Surgery History" name="surgeryHistory" value={patientInfo.surgeryHistory} onChange={handleInputChange} />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileField: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
)

const InputField: React.FC<{
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  readOnly?: boolean;
}> = ({ label, name, value, onChange, type = "text", readOnly = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
        readOnly ? 'bg-gray-100' : ''
      }`}
    />
  </div>
)

const SelectField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default PatientProfile