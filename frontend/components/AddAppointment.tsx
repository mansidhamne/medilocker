"use client";
import React, { useEffect, useState } from 'react';

interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Appointment {
    problem: string;
    date: string;
    mode: string;
    prescription: Prescription[];
}

interface AddAppointmentProps {
    onClose: () => void;
    onSave: (appointment: Appointment, appointmentIndex?: number) => void;
    existingAppointment?: Appointment;
    appointmentIndex?: number;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ onClose, onSave, existingAppointment, appointmentIndex  }) => {
  const [appointmentData, setAppointmentData] = useState<Appointment>({
    problem: '',
    date: '',
    mode: '',
    prescription: [
      {
        medicine: '',
        dosage: '',
        frequency: '',
        duration: ''
      }
    ]
  });

  useEffect(() => {
    if (existingAppointment) {
      setAppointmentData(existingAppointment);
    }
  }, [existingAppointment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  const handlePrescriptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPrescription = appointmentData.prescription.map((prescription, i) =>
      i === index ? { ...prescription, [e.target.name]: e.target.value } : prescription
    );
    setAppointmentData({
      ...appointmentData,
      prescription: updatedPrescription
    });
  };

  const handleAddPrescription = () => {
    setAppointmentData({
      ...appointmentData,
      prescription: [...appointmentData.prescription, { medicine: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(appointmentData, appointmentIndex);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto h-[85%]">
        <h2 className="text-2xl font-semibold mb-4">
            {existingAppointment ? 'Edit Appointment' : 'Add Appointment'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Complaint</label>
            <input
              type="text"
              name="problem"
              value={appointmentData.problem}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={appointmentData.date}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Mode</label>
            <select
              name="mode"
              value={appointmentData.mode}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select Mode</option>
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Prescription</h3>
            {appointmentData.prescription.map((prescription, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  name="medicine"
                  value={prescription.medicine}
                  placeholder="Medicine"
                  onChange={(e) => handlePrescriptionChange(index, e)}
                  className="p-2 border rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="dosage"
                  value={prescription.dosage}
                  placeholder="Dosage"
                  onChange={(e) => handlePrescriptionChange(index, e)}
                  className="p-2 border rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="frequency"
                  value={prescription.frequency}
                  placeholder="Frequency"
                  onChange={(e) => handlePrescriptionChange(index, e)}
                  className="p-2 border rounded w-full mb-2"
                />
                <input
                  type="text"
                  name="duration"
                  value={prescription.duration}
                  placeholder="Duration"
                  onChange={(e) => handlePrescriptionChange(index, e)}
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPrescription}
              className="mt-2 text-blue-500 underline"
            >
              + Add another prescription
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 hover:bg-blue-800"
            >
              {existingAppointment ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
