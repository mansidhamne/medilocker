import Link from 'next/link'
import React from 'react'
import { MdNotifications } from "react-icons/md";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between top-0 p-4">
        <div>
            <img src="../logo.png" alt="MediLocker" className="h-10 w-auto" />
        </div>
        <div className="flex flex-row gap-8">
            <Link href="/doctor-dashboard"><button className="bg-blue-600 rounded-full px-4 py-2 text-white hover:bg-blue-900">Overview</button></Link>
            <Link href="/appointments"><button className="rounded-full p-2 text-blue-600 hover:bg-blue-200">Appointments</button></Link>
            <Link href="/patients"><button className="rounded-full p-2 text-blue-600 hover:bg-blue-200">Patients</button></Link>
        </div>
        <div className="flex flex-row gap-2">
            <MdNotifications className="text-2xl"/>
            <p>Stephen Alfred</p>
        </div>
    </div>
  )
}

export default Navbar