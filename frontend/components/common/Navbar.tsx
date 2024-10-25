import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { LogOut, Power } from 'lucide-react'

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null); // State to store user data
  const [showLogout, setShowLogout] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');  // Redirect to login page
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
            <Link href="/dashboard/doctor"><img src="../logo.png" alt="MediLocker" className="h-10 w-auto" /></Link>
        </div>
        <div className="flex flex-row gap-8">
            <Link href="/dashboard/doctor">
              <button className={`${isActive('/dashboard/doctor') ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-200'} rounded-full px-4 py-2`}>
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
        <div>
      {user ? (
        <div className="relative"
          //onMouseEnter={() => setShowLogout(true)} // Show logout menu on hover
          // onMouseLeave={() => setShowLogout(false)}
        > 
          <span onClick={toggleLogoutMenu} className="cursor-pointer font-medium ">
            {/* Dr. Mansi Dhamne */}
            Dr. {user.firstName} {user.lastName}
          </span>
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

export default Navbar;
