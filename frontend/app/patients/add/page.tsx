"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar';
import { RiAddFill } from 'react-icons/ri';
import AddAppointment from '@/components/AddAppointment';
import { PrescriptionModal } from '@/components/PrescriptionModal';

interface AppointmentHistory {
    problem: string;
    date: string;
    mode: string;
    prescription: Prescription[];
}

interface Prescription {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
}

const AddPatient = () => {
  const router = useRouter();
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
  });

  const [isOpen, setIsOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([]);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [appointmentHistory, setAppointmentHistory] = useState<AppointmentHistory[]>([]);

  const handleChange = (e : React.ChangeEvent<any>) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    const dobUtc = new Date(patientData.dob).toISOString();

    const data = {
        ...patientData,
        dob: dobUtc
    };

    try {
      const response = await fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const newPatient = await response.json();
        setPatientId(newPatient.id); 
        alert('Patient added successfully!');
        router.push('/dashboar');
      } else {
        alert('Failed to add patient.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  const handleOpenPrescription = async (item: AppointmentHistory, appointmentIndex: number) => {
    try {
        const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments/${appointmentIndex}/prescriptions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prescription data');
        }
    
        // Parse the JSON response
        const prescriptionData = await response.json();
    
        // Set the fetched prescription data and open the modal
        setCurrentPrescription(prescriptionData || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching prescription:', error);
      }
    };

  const handleAddAppointment = async (newAppointment: any) => {
    try {
        const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAppointment),
        });
        const updatedPatient = await response.json();
        console.log('Updated patient with new appointment:', updatedPatient);
      } catch (error) {
        console.error('Error adding appointment:', error);
      }
  };

  useEffect(() => {
    // Fetch appointment history when the component is mounted and patientId is set
    if (patientId) {
      fetchAppointmentHistory();
    }
  }, [patientId]);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${patientId}/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const history = await response.json();
        setAppointmentHistory(history);
      } else {
        console.error('Failed to fetch appointment history.');
      }
    } catch (error) {
      console.error('Error fetching appointment history:', error);
    }
  };

  return (
    <div className="bg-white">
    <Navbar/>
    <div className="bg-white min-h-full w-full flex flex-row gap-10 justify-center">
      <form className="min-h-screen py-4 px-8 rounded-lg w-full" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 text-blue-600">Add Patient</h2>
        <div className="mb-4 flex flex-row justify-between gap-5">
          <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={patientData.firstName}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={patientData.lastName}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-row justify-between gap-8">
          <div className="flex flex-col w-1/2">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={patientData.dob}
              onChange={handleChange}
              placeholder='DD/MM/YYYY'
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-row justify-between gap-8">
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={patientData.contact}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={patientData.address}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
        {/* <!--- Medical Record --> */}
        <h2 className="text-2xl mb-6 text-blue-600">Medical Details</h2>
        <div className="mb-4 flex flex-row justify-between gap-8">
          <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              name="weight"
              value={patientData.weight}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Pulse Rate</label>
            <input
              type="number"
              name="pulseRate"
              value={patientData.pulseRate}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="number"
              name="bloodPressure"
              value={patientData.bloodPressure}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-row w-full">
          <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-gray-700">Complaints</label>
              <textarea
                name="complaints"
                value={patientData.complaints}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
          </div>
        </div>
        <div className="mb-6 flex flex-row w-full">
          <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-gray-700">Surgery History</label>
              <textarea
                name="surgeryHistory"
                value={patientData.surgeryHistory}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 rounded-full px-6 py-2 text-white"
        >
          Submit
        </button>
      </form>
      <div className="bg-zinc-800 rounded-xl w-[800px] mr-10 p-8 my-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-white text-3xl">Appointment History</h1>
          <button 
            onClick={() => setIsAppointmentOpen(true)}
            className="bg-blue-600 text-white p-3 rounded-full text-2xl">
            <RiAddFill/>
          </button>
          {isAppointmentOpen && (
            <AddAppointment 
              onClose={() => setIsAppointmentOpen(false)} 
              onSave={handleAddAppointment}
            />
          )}
          </div>
            <div className="flex flex-col gap-4 my-8">
            {appointmentHistory.length > 0 ? (
              appointmentHistory.map((item, index) => (
                <div key={index} className={`bg-zinc-700 p-4 rounded-lg border-l-8 ${item.mode === 'In-Person' ? "border-green-200" : "border-yellow-100"}`}>
                  <div className="flex flex-row justify-between text-white">
                    <div className="flex flex-col space-y-1">
                      <h1 className="text-lg font-medium">{item.problem}</h1>
                      <p className="text-sm text-zinc-300">{item.date}</p>
                      <p className="text-sm text-zinc-300 font-light">{item.mode}</p>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleOpenPrescription(item, index)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5"
                        >
                           Edit Appointment
                        </button>
                      <button
                        onClick={() => handleOpenPrescription(item, index)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1.5"
                      >
                        Open Prescription
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-300">No appointments found.</p>
            )}
            </div>
      </div>
    </div>
      {isOpen && (
        <PrescriptionModal 
          prescription={currentPrescription} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};

export default AddPatient;