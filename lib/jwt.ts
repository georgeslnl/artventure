import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

export function verifyToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error) {
    // You can log the error here if needed
    console.error('Token verification failed:', error);
    return null;
  }
}