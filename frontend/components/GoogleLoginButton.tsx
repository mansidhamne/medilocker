'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface GoogleLoginButtonProps {
  userType: 'doctor' | 'patient';
}

export default function GoogleLoginButton({ userType }: GoogleLoginButtonProps) {
  const router = useRouter();

  useEffect(() => {
    // Listen for the postMessage from the popup
    const handleMessage = (event: MessageEvent) => {
      console.log('event', event);
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

      if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        localStorage.setItem('token', event.data.data.access_token);
        localStorage.setItem('user', JSON.stringify({
          ...event.data.data[userType],
          role: userType
        }));

        // Redirect to the appropriate dashboard
        router.push(`/dashboard/${userType}`);
      }

      if (event.data.type === 'GOOGLE_LOGIN_ERROR') {
        console.error('Google login failed:', event.data.error);
        // Handle error - show error message to user
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [userType, router]);

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.screenX + (window.outerWidth - width) / 2);
    const top = (window.screenY + (window.outerHeight - height) / 2.5);

    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/${userType}/google`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="mt-4 w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      {/* <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg> */}
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
      Continue with Google
    </button>
  );
}