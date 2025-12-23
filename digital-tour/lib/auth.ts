// lib/auth.ts  
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { NextApiResponse, NextApiRequest } from 'next';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const COOKIE_NAME = process.env.COOKIE_NAME || 'ft_auth';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function setAuthCookie(res: NextApiResponse, token: string) {
  const isProd = process.env.NODE_ENV === 'production';

  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,        // ← secure in production only (dev uses http)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days — keep in sync with JWT_EXPIRES_IN
  });

  res.setHeader('Set-Cookie', cookie);
}

export function clearAuthCookie(res: NextApiResponse) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const raw = req.headers.cookie || '';
  const parsed = parse(raw);
  return parsed[COOKIE_NAME] || null;
}