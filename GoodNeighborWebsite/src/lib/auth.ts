import crypto from 'crypto';
import type { AuthUser } from '@/types';

export const AUTH_COOKIE_NAME = 'authToken';
export const AUTH_SESSION_SECONDS = 60 * 60 * 8;

const AUTH_SECRET =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'development-auth-secret-change-me';

type AuthTokenUser = AuthUser & {
  timestamp: number;
};

/**
 * Hash a password using SHA256 and return base64 encoded
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('base64');
}

/**
 * Compare a plain password with a hashed password
 */
export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  const hash = hashPassword(plainPassword);
  return hash === hashedPassword;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf-8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf-8');
}

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
}

function signaturesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function createAuthToken(user: AuthTokenUser): string {
  const payload = base64UrlEncode(JSON.stringify(user));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function readAuthToken(token?: string): AuthTokenUser | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature || !signaturesMatch(signature, signPayload(payload))) {
    return null;
  }

  try {
    const user = JSON.parse(base64UrlDecode(payload)) as AuthTokenUser;

    if (typeof user.timestamp !== 'number') {
      return null;
    }

    const ageSeconds = (Date.now() - user.timestamp) / 1000;

    if (ageSeconds > AUTH_SESSION_SECONDS) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Failed to read auth token:', error);
    return null;
  }
}
