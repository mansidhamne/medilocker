'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { email } = router.query; // Assuming you're passing both email and id
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  return (
    <div>
      
      {/* Add more user details as needed */}
      <div>
        <h2>Your Appointments</h2>
        <div>{email}</div>
        {userDetails.appointments.length > 0 ? (
          <ul>
            {userDetails.appointments.map(appointment => (
              <li key={appointment.id}>
                {appointment.date} - {appointment.time} with {appointment.patientName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>
    </div>
  );
}