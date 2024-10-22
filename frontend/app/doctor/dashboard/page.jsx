// app/doctor/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getUserFromStorage } from '@/lib/auth';

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = getUserFromStorage();
    if (userData) {
      setUser(userData);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, Dr. {user.lastName}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Specialization:</strong> {user.specialization}</p>
          <p><strong>Verification Status:</strong> {user.isVerified ? 'Verified' : 'Pending'}</p>
        </div>
      </div>
    </div>
  );
}