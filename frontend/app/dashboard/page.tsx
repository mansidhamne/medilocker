import Navbar from '@/components/common/Navbar'
import React, { useEffect } from 'react'
import Link from 'next/link';
import { MdOutlineEditCalendar } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { BiInjection } from "react-icons/bi";
import PatientTable from '@/components/PatientTable';

const DoctorDashboard = () => {
  return (
    <div className="bg-slate-100 min-h-screen w-full">
        <Navbar/>
        <div className="flex flex-row">
          <div className="flex flex-col gap-2.5 px-10 mt-8">
            <div className="flex flex-row gap-6">
              <Link href="/appointments">
              <div className="bg-white rounded-lg p-6 min-w-[250px]">
                <div className="flex flex-row gap-2 items-center"> 
                  <MdOutlineEditCalendar className="text-4xl bg-teal-200 rounded-full p-2"/>
                  <p className="text-xl">Appointments</p>
                </div>
                <p className="text-4xl mt-6">20</p>
              </div>
              </Link>

              <div className="bg-white rounded-lg p-6 min-w-[250px]">
                <div className="flex flex-row gap-2 items-center"> 
                  <IoCall className="text-4xl bg-yellow-200 rounded-full p-2"/>
                  <p className="text-xl">Call Consultancy</p>
                </div>
                <p className="text-4xl mt-6">12</p>
              </div>

              <div className="bg-white rounded-lg p-6 min-w-[250px]">
                <div className="flex flex-row gap-2 items-center"> 
                  <BiInjection className="text-4xl bg-red-200 rounded-full p-2"/>
                  <p className="text-xl">Surgeries</p>
                </div>
                <p className="text-4xl mt-6">2</p>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-6">
              <div className="flex flex-row justify-between">
                <h1 className="text-2xl font-medium text-blue-600">Patient Records</h1>
                <Link href="/patients/add"><button className="bg-blue-600 rounded-full px-4 py-1.5 text-white">Add Patient</button></Link>
              </div>
              <PatientTable/>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default DoctorDashboard