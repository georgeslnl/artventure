'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        router.push('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-50">
      <form onSubmit={handleSubmit} className="w-10/12 lg:w-full max-w-md bg-secondary-100 p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <button
            type="button"
            aria-label='Back'
            onClick={() => router.back()}
            className="text-primary-700 text-lg hover:text-primary-900 transition-colors"
          >
            &larr;
          </button>
          <h2 className="text-2xl font-bold text-text-900 mx-auto text-center">Login</h2>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="flex flex-col gap-2">
          <label htmlFor="login-email" className='font-semibold text-text-900 text-lg'>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-2 text-text-800 bg-background-50 rounded-md" />
          <label htmlFor="login-password" className='font-semibold text-text-900 text-lg'>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full p-2 text-text-800 bg-background-50 rounded-md" />
        </div>
        <button type="submit"
          className="w-full bg-primary-500 text-text-900 p-2 rounded-lg text-lg mt-6 hover:bg-primary-600 transition-colors"
        >Login</button>
        <p className="mt-4 text-center text-text-800">Dont have an account? {' '}
          <Link href="/auth/signup" className="underline hover:font-semibold text-primary-700">
            Sign up</Link>
        </p>
      </form>
    </div>
  );
}