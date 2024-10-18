"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GiTrashCan } from "react-icons/gi";
import { HiPencil } from "react-icons/hi2";

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
}

const PatientTable = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/patients/${id}`);
      fetchPatients(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleEditClick = async (id: string) => {
    router.push(`http://localhost:3001/patients/edit/${id}`);
  };

  return (
    <div className="mt-4">
        <table className="bg-slate-50 min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients ? (
              <>
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td className="py-2 px-4 border-b text-left">{`${patient.firstName} ${patient.lastName}`}</td>
                  <td className="py-2 px-4 border-b text-center">{patient.age}</td>
                  <td className="py-2 px-4 border-b text-center">{patient.gender}</td>
                  <td className="py-2 px-4 border-b space-x-2 items-center text-center">
                    <button onClick={() => handleEditClick(patient._id)}>
                      <HiPencil className="text-yellow-300 text-xl" />
                    </button>
                    <button onClick={() => deletePatient(patient._id)}>
                      <GiTrashCan className="text-red-600 text-2xl" />
                    </button>
                  </td>
                </tr>
              ))}
              </>
            ) : (
              <>
              <tr>
                <td colSpan={4} className="py-2 px-4 border-b text-center">No patients found</td>
              </tr>
              </>
            )}
            
          </tbody>
        </table>
    </div>
  );
};

export default PatientTable;
