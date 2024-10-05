import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}