// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { signToken } from '../../../../../lib/jwt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await hash(password, 10);

    const client = await clientPromise;
    const db = client.db('Events');

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({ userId: result.insertedId.toString() });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}