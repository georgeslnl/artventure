'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth/signin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>There was an error during the authentication process.</p>
      <p>You will be redirected to the sign-in page in 5 seconds.</p>
    </div>
  );
}