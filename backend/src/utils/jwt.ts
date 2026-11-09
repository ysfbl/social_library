import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret_key_change_in_production';
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  username: string;
}

// Generate JWT token
export const generateToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Generate password reset token (expires in 1 hour)
export const generatePasswordResetToken = (payload: JWTPayload): string => {
  const options: SignOptions = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export default {
  generateToken,
  verifyToken,
  generatePasswordResetToken,
};
