import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { signToken } from '../../../../../lib/jwt';
import { signUpSchema } from '@/app/schemas/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = signUpSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, password } = result.data;
    const hashedPassword = await hash(password, 10);

    const client = await clientPromise;
    const db = client.db('Events');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const insertResult = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({ userId: insertResult.insertedId.toString() });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}