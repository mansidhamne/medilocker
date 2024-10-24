// 'use client'
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// interface User {
//   email: string;
//   role: 'doctor' | 'patient';
//   firstName?: string;
//   lastName?: string;
//   specialization?: string;
//   isVerified?: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   googleLogin: () => Promise<void>;
//   logout: () => void;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Create axios instance with credentials
// const api = axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true, // Important for cookies
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Check auth status on mount and after refreshes
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data } = await api.get('/auth/me');
//         setUser(data.user);
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const { data } = await api.post('/auth/doctor/login', { email, password });
//       setUser(data.user);
      
//       if (data.user.isVerified) {
//         router.push('/doctor/dashboard');
//       } else {
//         router.push('/doctor/verification');
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const googleLogin = async () => {
//     window.open('https://medi-backend-two.vercel.app/auth/doctor/google', '_self');
//   };

//   const logout = async () => {
//     try {
//       await api.post('/auth/logout');
//       setUser(null);
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, googleLogin, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };