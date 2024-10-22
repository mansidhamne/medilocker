import Image from 'next/image'
import { Bell, User } from 'lucide-react'

export default function PatientDetails({ patientId }: { patientId: string }) {
  // Fetch patient data based on patientId
  // For now, we'll use dummy data
  const patientData = {
    name: "Mansi Dhamne",
    age: 20,
    gender: "Female",
    dob: "09/11/2004",
    weight: "55kg",
    doctorName: "Dr. Neeta S."
  };

  return (
    <div className="bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-7 gap-8">
          <div className="col-span-7 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{patientData.name}</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p><span className="font-medium">Patient Name:</span> {patientData.name}</p>
                <p><span className="font-medium">Gender:</span> {patientData.gender}</p>
                <p><span className="font-medium">Doctor Name:</span> {patientData.doctorName}</p>
              </div>
              <div>
                <p><span className="font-medium">Age:</span> {patientData.age}</p>
                <p><span className="font-medium">DOB:</span> {patientData.dob}</p>
                <p><span className="font-medium">Weight:</span> {patientData.weight}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {['Blood Report', 'Liver Report', 'ECG', 'Kidney Report'].map((report) => (
                <div key={report} className="bg-gray-100 p-4 rounded-lg text-center">
                  <Image src="/placeholder.svg" alt={report} width={100} height={100} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{report}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Appointment History</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Add</button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Comment</th>
                  <th className="px-4 py-2 text-left">Prescription</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">16 Aug 2024</td>
                  <td className="px-4 py-2">Viral Fever</td>
                  <td className="px-4 py-2">Reappointment in 5 days</td>
                  <td className="px-4 py-2"><a href="#" className="text-blue-600">Prescription</a></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2 Feb 2024</td>
                  <td className="px-4 py-2">Stomach Infection</td>
                  <td className="px-4 py-2">Antibiotics Treatment</td>
                  <td className="px-4 py-2"><a href="#" className="text-blue-600">Prescription</a></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <div className="bg-gray-800 text-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">August</h3>
              <select className="bg-white text-gray-800 rounded-md px-2 py-1">
                <option>2024</option>
              </select>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                <div key={day} className="text-center text-xs font-medium">{day}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`text-center p-2 rounded-full ${day === 16 ? 'bg-blue-600' : ''}`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Today&apos;s appointments</h4>
                <a href="#" className="text-blue-400 text-sm">View All</a>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
                  <Image src="/placeholder.svg" alt="Mansi Dhamne" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-medium">Mansi Dhamne</p>
                    <p className="text-sm text-gray-400">Video Consultancy</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
                  <Image src="/placeholder.svg" alt="Vanashree Tajane" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-medium">Vanashree Tajane</p>
                    <p className="text-sm text-gray-400">Clinic Appointment</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  )
}