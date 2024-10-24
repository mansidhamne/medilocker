// "use client";
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { GiTrashCan } from "react-icons/gi";
// import { HiPencil } from "react-icons/hi2";

// interface Patient {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   age: number;
//   gender: string;
// }

// const PatientTable = () => {
//   const router = useRouter();
//   const [patients, setPatients] = useState<Patient[]>([]);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       const response = await axios.get('https://medi-backend-two.vercel.app/patients');
//       setPatients(response.data);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//     }
//   };

//   const deletePatient = async (id: string) => {
//     try {
//       await axios.delete(`https://medi-backend-two.vercel.app/patients/${id}`);
//       fetchPatients(); // Refresh the list after deletion
//     } catch (error) {
//       console.error('Error deleting patient:', error);
//     }
//   };

//   const handleEditClick = async (id: string) => {
//     router.push(`http://localhost:3001/patients/edit/${id}`);
//   };

//   return (
//     <div className="mt-4">
//         <table className="bg-slate-50 min-w-full border border-gray-200">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b text-left">Name</th>
//               <th className="py-2 px-4 border-b">Age</th>
//               <th className="py-2 px-4 border-b">Gender</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients ? (
//               <>
//               {patients.map((patient) => (
//                 <tr key={patient._id}>
//                   <td className="py-2 px-4 border-b text-left">{`${patient.firstName} ${patient.lastName}`}</td>
//                   <td className="py-2 px-4 border-b text-center">{patient.age}</td>
//                   <td className="py-2 px-4 border-b text-center">{patient.gender}</td>
//                   <td className="py-2 px-4 border-b space-x-2 items-center text-center">
//                     <button onClick={() => handleEditClick(patient._id)}>
//                       <HiPencil className="text-yellow-300 text-xl" />
//                     </button>
//                     <button onClick={() => deletePatient(patient._id)}>
//                       <GiTrashCan className="text-red-600 text-2xl" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               </>
//             ) : (
//               <>
//               <tr>
//                 <td colSpan={4} className="py-2 px-4 border-b text-center">No patients found</td>
//               </tr>
//               </>
//             )}
            
//           </tbody>
//         </table>
//     </div>
//   );
// };

// export default PatientTable;

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { GiTrashCan } from "react-icons/gi";
import { HiPencil } from "react-icons/hi2";
import { FaUserMd } from "react-icons/fa";
import { UserRound } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://medi-backend-two.vercel.app/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`https://medi-backend-two.vercel.app/patients/${id}`);
        fetchPatients(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleEditClick = async (id: string) => {
    router.push(`http://localhost:3001/patients/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
      {patients.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center h-10">
                    <div className="flex-shrink-0">
                      <UserRound className="ml-2 h-5 w-7 rounded-full text-blue-500" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{`${patient.firstName} ${patient.lastName}`}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.age}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    patient.gender.toLowerCase() === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {patient.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEditClick(patient._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                  >
                    <HiPencil className="inline-block text-xl" />
                    <span className="ml-1">Edit</span>
                  </button>
                  <button 
                    onClick={() => deletePatient(patient._id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                  >
                    <GiTrashCan className="inline-block text-xl" />
                    <span className="ml-1">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8">
          <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new patient.</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => router.push('/patients/add')}
            >
              <FaUserMd className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;