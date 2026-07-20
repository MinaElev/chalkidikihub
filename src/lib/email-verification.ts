import { createHash } from 'crypto';

// Codes are stored hashed, salted with the user id so a leaked table
// can't be brute-forced offline against all users at once.
export function hashVerificationCode(code: string, userId: string): string {
  return createHash('sha256').update(`${code}:${userId}`).digest('hex');
}

export const MAX_VERIFY_ATTEMPTS = 5;
