interface User {
    email: string;
    firstName: string;
    lastName: string;
    role: 'doctor' | 'patient';
  }
  
  export const getUserFromStorage = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };
  
  export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };