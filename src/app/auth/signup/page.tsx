'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signUpSchema } from '@/app/schemas/auth';
import Link from 'next/link';

interface ErrorResponse {
  field: string;
  message: string;
}

interface SignUpResponse {
  token: string;
  errors?: ErrorResponse[];
  message?: string;
}

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const validatePassword = (value: string) => {
    try {
      signUpSchema.shape.password.parse(value);
      setErrors(prev => ({ ...prev, password: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, password: error.errors[0].message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signUpSchema.parse({ name, email, password });

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data: SignUpResponse = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        if (data.errors) {
          setErrors(data.errors.reduce((acc: { [key: string]: string }, error: ErrorResponse) => {
            acc[error.field] = error.message;
            return acc;
          }, {}));
        } else {
          setErrors({ general: data.message || 'An error occurred during sign up' });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc: { [key: string]: string }, err: z.ZodIssue) => {
          acc[err.path[0] as string] = err.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      } else {
        console.error('Sign up failed:', error);
        setErrors({ general: 'An unexpected error occurred' });
      }
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
        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
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
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          
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
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          
          <label htmlFor="signup-password" className='font-semibold text-text-900 text-lg'>Password</label>
          <input 
            type="password"
            id="signup-password" 
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }} 
            placeholder="Enter your password" 
            required  
            className="w-full p-2 text-text-800 bg-background-50 rounded-md"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
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