import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LogOut, Power, User, UserIcon } from 'lucide-react'

const NavbarPatient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null); // State to store user data
  const [showLogout, setShowLogout] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user data and store it in state
    }
  }, []);

  const toggleLogoutMenu = () => {
    setShowLogout((prev) => !prev);
  };


  return (
    <div className="flex flex-row justify-between top-0 px-12 py-6 items-center">
        <div>
            <Link href="/dashboard/patient"><img src="../logo.png" alt="MediLocker" className="h-10 w-auto" /></Link>
        </div>
        <div className="flex flex-row gap-8">
            <Link href="/dashboard/patient">
              <button className={`${isActive('/dashboard/patient') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Overview
              </button>
            </Link>
            <Link href="/book">
              <button className={`${isActive('/appointments') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Book Appointment
              </button>
            </Link>
            <Link href="/reports">
              <button className={`${isActive('/reports') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                Reports
              </button>
            </Link>
            <Link href="/medimate">
              <button className={`${isActive('/medimate') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
                MediMate
              </button>
            </Link>
        </div>
        <div>
      {user ? (
        <div className="relative"
          //onMouseEnter={() => setShowLogout(true)} // Show logout menu on hover
          // onMouseLeave={() => setShowLogout(false)}
        > 
        <div className="flex items-center gap-2">
          <Link href="/profile/patient">
            <UserIcon />
          </Link>
          <span onClick={toggleLogoutMenu} className="cursor-pointer font-medium ">
            {user.firstName} {user.lastName}
          </span>
          <button onClick={handleLogout} className="text-white bg-blue-600 rounded-md block w-full text-left px-8 py-2 hover:bg-blue-300 hover:rounded-md">
                Logout
              </button>
        </div>
          {showLogout && (
            <div className="absolute right-0 bg-blue-600 shadow-md mt-2 rounded-md">
              <button onClick={handleLogout} className="text-white block w-full text-left px-8 py-2 hover:bg-blue-300 hover:rounded-md">
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <span>Loading...</span>
      )}
    </div>
    </div>
  )
}

export default NavbarPatient;
