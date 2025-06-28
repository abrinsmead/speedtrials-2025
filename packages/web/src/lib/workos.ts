// WorkOS AuthKit Configuration Stub
// This file will contain the WorkOS client setup and authentication helpers

/**
 * WorkOS AuthKit Configuration
 *
 * To implement:
 * 1. Install @workos-inc/node: npm install @workos-inc/node
 * 2. Add environment variables to .env.local:
 *    - WORKOS_API_KEY
 *    - WORKOS_CLIENT_ID
 *    - WORKOS_REDIRECT_URI
 *    - WORKOS_COOKIE_PASSWORD (32+ character string)
 *
 * 3. Initialize WorkOS client:
 * ```
 * import { WorkOS } from '@workos-inc/node';
 *
 * const workos = new WorkOS(process.env.WORKOS_API_KEY);
 * ```
 */

export interface AuthKitConfig {
  clientId: string;
  redirectUri: string;
  providers: AuthProvider[];
}

export type AuthProvider = 'google' | 'github' | 'microsoft' | 'okta' | 'email';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  email: string;
  expiresAt: string;
}

// Placeholder functions - implement with actual WorkOS SDK

export async function signIn(
  _email: string,
  _password: string
): Promise<{ user: User; session: Session }> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit sign-in not implemented');
}

export async function signInWithSSO(_provider: AuthProvider): Promise<{ url: string }> {
  // TODO: Implement with WorkOS SSO
  throw new Error('WorkOS SSO sign-in not implemented');
}

export async function signUp(_email: string, _password: string): Promise<{ user: User }> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit sign-up not implemented');
}

export async function signOut(): Promise<void> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit sign-out not implemented');
}

export async function getSession(): Promise<Session | null> {
  // TODO: Implement with WorkOS AuthKit
  return null;
}

export async function verifyEmail(_token: string): Promise<void> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit email verification not implemented');
}

export async function resetPassword(_email: string): Promise<void> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit password reset not implemented');
}

export async function updatePassword(_token: string, _newPassword: string): Promise<void> {
  // TODO: Implement with WorkOS AuthKit
  throw new Error('WorkOS AuthKit password update not implemented');
}
