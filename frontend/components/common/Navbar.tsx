import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // Use next-auth's signOut to handle Google OAuth logout
    signOut({ callbackUrl: '/login' }); // Redirect user to login after sign-out
  };

  return (
    <div className="flex flex-row justify-between top-0 px-12 py-6 items-center">
        <div>
            <Link href="/dashboard"><img src="../logo.png" alt="MediLocker" className="h-10 w-auto" /></Link>
        </div>
        <div className="flex flex-row gap-8">
            <Link href="/dashboard">
              <button className={`${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Overview
              </button>
            </Link>
            <Link href="/appointments">
              <button className={`${isActive('/appointments') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Appointments
              </button>
            </Link>
            <Link href="/patients">
              <button className={`${isActive('/patients') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Patients
              </button>
            </Link>
            <Link href="/online">
              <button className={`${isActive('/online') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Call Consultancy
              </button>
            </Link>
        </div>
        <div className="flex flex-row gap-2 font-medium text-blue-600">
        {/* Clickable name for logout */}
        <button onClick={handleLogout} className="hover:text-blue-800">
          Mansi Dhamne
        </button>
      </div>
    </div>
  )
}

export default Navbar;
