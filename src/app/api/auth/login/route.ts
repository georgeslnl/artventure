// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { signToken } from '../../../../../lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db('Events');

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = signToken({ userId: user._id.toString() });

    return NextResponse.json({ token, name: user.name });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}