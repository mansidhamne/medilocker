"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/common/Navbar";
import { PrescriptionModal } from "@/components/PrescriptionModal";
import { RiAddFill } from "react-icons/ri";
import AddAppointment from "@/components/AddAppointment";

interface Appointment {
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

const EditPatient = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Get the dynamic id from the URL
  const [patient, setPatient] = useState(null);
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
  });
  const [isOpen, setIsOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription[]>([]);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingAppointmentIndex, setEditingAppointmentIndex] = useState<number | null>(null);


  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:3000/patients/${id}`);
          const formattedDob = new Date(response.data.dob).toISOString().slice(0, 10);
          const patientData = {
            ...response.data,
            dob: formattedDob, // Update the dob field with the formatted date
          };
          setPatient(patientData);
          setFormValues(patientData);
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }
    };
    fetchPatient();
  }, [id]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const dobUtc = new Date(formValues.dob).toISOString();
    const updatedPatient = {
      ...formValues,
      dob: dobUtc,
    };
    try {
      await axios.put(`http://localhost:3000/patients/${id}`, updatedPatient);
      // Redirect back to the patients list or show success message
      router.push('/dashboard'); // Adjust the redirect as needed
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleOpenPrescription = async (item: Appointment, appointmentIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments/${appointmentIndex}/prescriptions`);
      
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

  const handleAddAppointment = async (newAppointment: Appointment) => {
    try {
        const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAppointment),
        });
        const updatedPatient = await response.json();
        console.log('Updated patient with new appointment:', updatedPatient);
        fetchAppointmentHistory();
        setIsAppointmentModalOpen(false);
      } catch (error) {
        console.error('Error adding appointment:', error);
      }
  };

  const handleSaveAppointment = async (appointment: Appointment, index?: number) => {
    if (index !== undefined) {
      await handleEditAppointment(appointment, index);
    } else {
      await handleAddAppointment(appointment);
    }
  };

  const handleEditAppointment = async (appointment: Appointment, appointmentIndex: number) => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments/${appointmentIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
      const updatedPatient = await response.json();
      console.log('Updated patient with edited appointment:', updatedPatient);
      fetchAppointmentHistory();
      setIsAppointmentModalOpen(false);
      setEditingAppointment(null);
      setEditingAppointmentIndex(null);
    } catch (error) {
      console.error('Error editing appointment:', error);
    }
  }

  const openEditAppointmentModal = (appointment: Appointment, index: number) => {
    setEditingAppointment(appointment);
    setEditingAppointmentIndex(index);
    setIsAppointmentModalOpen(true);
  };

  useEffect(() => {
    if (id) {
      fetchAppointmentHistory();
    }
  }, [id]);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}/appointments`, {
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
      {patient ? (
        <form className="min-h-screen py-4 px-8 rounded-lg w-full" onSubmit={handleFormSubmit}>
        <h2 className="text-2xl mb-6 text-blue-600">Edit Patient</h2>
        <div className="mb-4 flex flex-row justify-between gap-5">
          <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className='flex flex-col w-full'>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
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
              value={formValues.age}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formValues.gender}
              onChange={handleInputChange}
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
              value={formValues.dob}
              onChange={handleInputChange}
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
              value={formValues.contact}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
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
              value={formValues.weight}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Pulse Rate</label>
            <input
              type="number"
              name="pulseRate"
              value={formValues.pulseRate}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="number"
              name="bloodPressure"
              value={formValues.bloodPressure}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-row w-full">
          <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-gray-700">Complaints</label>
              <textarea
                name="complaints"
                value={formValues.complaints}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded w-full"
              />
          </div>
        </div>
        <div className="mb-6 flex flex-row w-full">
          <div className="flex flex-col w-full">
              <label className="block text-sm font-medium text-gray-700">Surgery History</label>
              <textarea
                name="surgeryHistory"
                value={formValues.surgeryHistory}
                onChange={handleInputChange}
                className="mt-1 p-2 border rounded w-full"
              />
          </div>
        </div>
        <button type="submit" className="bg-blue-600 rounded-full px-6 py-2 text-white">
          Update
        </button>
      </form>
      ) : (
        <p>Loading...</p>
      )}
      <div className="bg-zinc-800 rounded-xl w-[800px] mr-10 p-8 my-8">
        <div className="flex flex-row justify-between">
          <h1 className="text-white text-3xl">Appointment History</h1>
          <button 
            onClick={() => {
              setEditingAppointment(null);
              setEditingAppointmentIndex(null);
              setIsAppointmentModalOpen(true);
            }}
            className="bg-blue-600 text-white p-3 rounded-full text-2xl">
            <RiAddFill/>
          </button>
          {/* {isAppointmentOpen && (
            <AddAppointment 
              onClose={() => setIsAppointmentOpen(false)} 
              onSave={handleAddAppointment}
            />
          )} */}
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
                    <div className="flex items-center flex-col gap-4">
                    <button
                            onClick={() => openEditAppointmentModal(item, index)}
                            className="text-white bg-zinc-800 hover:bg-zinc-600 text-sm rounded-full px-4 py-1.5"
                        >
                           Edit Appointment
                        </button>
                      <button
                        onClick={() => handleOpenPrescription(item, index)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full px-4 py-1.5"
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
      {isAppointmentModalOpen && (
          <AddAppointment 
            onClose={() => {
              setIsAppointmentModalOpen(false);
              setEditingAppointment(null);
              setEditingAppointmentIndex(null);
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
  );
};

export default EditPatient;


