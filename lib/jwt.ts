import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;


export function signToken(payload: { userId: string }): string {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

export function verifyToken(token: string): { userId: string } | null {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}