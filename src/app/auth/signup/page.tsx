'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setError(data.message || 'An error occurred during sign up');
      }
    } catch (error) {
      console.error('Sign up failed:', error);
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
          <h2 className="text-2xl font-bold text-text-900 mx-auto text-center">Sign Up</h2>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex flex-col gap-2">
        <label htmlFor="signup-name" className='font-semibold text-text-900 text-lg'>Name</label>
          <input 
            type="text" 
            id="signup-name"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name"
            required 
            className="w-full p-2 text-text-800 bg-background-50 rounded-md"
          />
          <label htmlFor="signup-email" className='font-semibold text-text-900 text-lg'>Email</label>
          <input 
            type="email" 
            id="signup-email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            required 
            className="w-full p-2 text-text-800 bg-background-50 rounded-md"
          />
          <label htmlFor="signup-password" className='font-semibold text-text-900 text-lg'>Password</label>
          <input 
            type="password"
            id="signup-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
            required  
            className="w-full p-2 text-text-800 bg-background-50 rounded-md"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary-500 text-text-900 p-2 rounded-lg text-lg mt-6 hover:bg-primary-600 transition-colors"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center text-text-800">
          Already have an account? {' '}
          <Link href="/auth/login" className="underline hover:font-semibold text-primary-700">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}