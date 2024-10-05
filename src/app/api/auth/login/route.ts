import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import clientPromise from '../../../../../lib/mongodb';
import { signToken } from '../../../../../lib/jwt';
import { loginSchema } from '@/app/schemas/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        field: error.path.join('.'),
        message: error.message
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { email, password } = result.data;

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