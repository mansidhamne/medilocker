'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUserMd, FaUser, FaLock, FaHeartbeat, FaCalendarAlt, FaChartLine, FaFileAlt, FaComments, FaRobot } from 'react-icons/fa'
import LoginModal from '@/components/LoginModal'
import { useRouter } from 'next/navigation'
import RegisterModal from '@/components/RegisterModal'

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginType, setLoginType] = useState<'doctor' | 'patient'>('patient')
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const router = useRouter();

  const openLoginModal = (type: 'doctor' | 'patient') => {
    setLoginType(type)
    setIsLoginModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* <FaLock className="text-teal-600 text-3xl mr-2" />
            <span className="text-3xl font-bold text-gray-800">MediLocker</span> */}
            <img src="/logo.png" alt="MediLocker" className="h-12 ml-2" />
          </div>
          <div className="space-x-4">
            <button
              onClick={() => openLoginModal('doctor')}
              className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors shadow-md"
            >
              Doctor Login
            </button>
            <button
              onClick={() => openLoginModal('patient')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
              Patient Login
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-gray-800 my-6"
          >
            Your Secure Digital Vault for Health Records
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            MediLocker provides a secure, user-friendly platform for storing, organizing, and sharing medical documents. Manage your health with ease and confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-blue-600 text-white text-lg px-10 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
            >
              Get Started Now
            </button>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-3 gap-12 mb-24">
          {[
            { icon: FaFileAlt, title: "Secure Document Storage", description: "Store and organize all your medical records in one secure place." },
            { icon: FaCalendarAlt, title: "Easy Appointment Scheduling", description: "Book and manage your medical appointments effortlessly." },
            { icon: FaComments, title: "Doctor-Patient Communication", description: "Connect securely with your healthcare providers for online consultations." },
            { icon: FaChartLine, title: "Health Analytics", description: "Visualize your health data with intuitive charts and graphs." },
            { icon: FaHeartbeat, title: "E-Prescription Management", description: "Access and manage your digital prescriptions anytime, anywhere." },
            { icon: FaRobot, title: "HealthBot Assistant", description: "Get instant answers to your health queries with our AI-powered chatbot." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow hover:bg-teal-300"
            >
              <feature.icon className="text-6xl text-teal-600 mb-6 mx-auto " />
              <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="bg-white rounded-xl shadow-lg p-12 mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">How MediLocker Works</h2>
          <div className="flex flex-col md:flex-row justify-around items-center space-y-12 md:space-y-0">
            {[
              { step: 1, title: "Create Your Account", icon: FaUser, description: "Sign up and set up your secure MediLocker profile." },
              { step: 2, title: "Upload Your Records", icon: FaFileAlt, description: "Easily upload and organize your medical documents." },
              { step: 3, title: "Connect with Doctors", icon: FaUserMd, description: "Securely share your records with healthcare providers." },
              { step: 4, title: "Manage Your Health", icon: FaHeartbeat, description: "Track your health progress and schedule appointments." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center max-w-xs"
              >
                <div className="bg-teal-100 rounded-full p-6 mb-6">
                  <item.icon className="text-5xl text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Step {item.step}</h3>
                <p className="text-gray-600 text-center">{item.title}</p>
                <p className="text-sm text-gray-500 text-center mt-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center mb-24">
          <h2 className="text-4xl font-bold mb-8">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join MediLocker today and experience the future of personal health management. Your health data, secure and accessible, whenever you need it.
          </p>
          <button
            onClick={() => openLoginModal('patient')}
            className="bg-teal-600 text-white text-lg px-10 py-4 rounded-full hover:bg-teal-700 transition-colors shadow-lg transform hover:scale-105"
          >
            Create Your MediLocker Now
          </button>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-6">
            <FaLock className="text-teal-400 text-3xl mr-2" />
            <span className="text-3xl font-bold">MediLocker</span>
          </div>
          <p className="mb-6">Secure, Efficient, and Accessible Healthcare Management</p>
          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="hover:text-teal-400 transition-colors">About Us</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Contact</a>
          </div>
          <p>&copy; 2024 MediLocker. All rights reserved.</p>
        </div>
      </footer>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          loginType={loginType}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} loginType={loginType} />
      )}
    </div>
  )
}