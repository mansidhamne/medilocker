'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Upload } from 'lucide-react'
import NavbarPatient from '@/components/common/NavbarPatient'
import { form } from 'framer-motion/client'

interface Report {
  _id: string
  name: string
  type: 'personal' | 'medical'
  date?: string
  fileUrl: string
}

const UploadedReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileType, setFileType] = useState('medical') // Default to 'medical'

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value) // Update the file type when selection changes
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('https://medi-backend-two.vercel.app/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      } else {
        console.error('Failed to fetch reports')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const patientId = "6717d33389614a5d7f3f6827"
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', fileType) // You might want to add a way to select the type
      formData.append('patientId', patientId)
      
      try {
        const response = await fetch('https://medi-backend-two.vercel.app/reports/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const newReport = await response.json()
          setReports([...reports, newReport])
        } else {
          console.error('Failed to upload report')
        }
      } catch (error) {
        console.error('Error uploading report:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleDelete = async (reportId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this report?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://medi-backend-two.vercel.app/reports/${reportId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Update the reports state after successful deletion
        setReports(reports.filter(report => report._id !== reportId));
      } else {
        console.error('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
      console.error('Invalid time value')
      return ''
    }
    return date.toISOString().split('T')[0] // Extracts the "yyyy-MM-dd" part
  }

  return (
    <div className="min-h-screen bg-gray-100 py-0 px-4 sm:px-6 lg:px-8">
        <NavbarPatient />
      <div className="max-w-7xl mx-auto py-6">
        

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Reports</h1>

            <div className="bg-gray-600 rounded-md p-4 text-white mb-6">
              <h1 className="text-xl font-semibold mb-4">Upload Documents</h1>
              <div className="flex justify-between items-center">
                <div>
                <label htmlFor="fileType" className="font-medium text-lg">Select File Type: </label>
                <select id="fileType" value={fileType} onChange={handleTypeChange} className="ml-2.5 bg-gray-400 py-1 px-2.5 rounded-md">
                  <option value="medical">Medical</option>
                  <option value="personal">Personal</option>
                </select>
                </div>
                <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload New Report'}
                  <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            

            

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Personally Identifiable Reports</h2>
              {/* <div className="mt-8">
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload New Report'}
                <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div> */}
              <ul className="space-y-2">
                {reports.filter(report => report.type === 'personal').map(report => (
                  <li key={report._id} className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                    <span className="font-medium text-blue-800">{report.name}</span>
                    <button
                      onClick={() => handleView(report.fileUrl)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline-block mr-2" />
                      VIEW
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Medical Records/ Reports</h2>
              <ul className="space-y-2">
                {reports.filter(report => report.type === 'medical').map(report => (
                  <li key={report._id} className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-green-800">{report.name}</span>
                      {report.date && <span className="ml-4 text-sm text-gray-500">{formatDate(report.date)}</span>}
                    </div>
                    <div className="flex gap-4">
                    <button
                      onClick={() => handleView(report.fileUrl)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline-block mr-2" />
                      VIEW
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      DELETE
                    </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* <div className="mt-8">
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload New Report'}
                <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
              </label>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadedReports