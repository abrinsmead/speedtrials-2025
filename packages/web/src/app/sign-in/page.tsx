'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Mail, Lock, Loader2, Github, Chrome, Building2 } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement WorkOS AuthKit sign-in
      // const { user } = await signIn({ email, password });
      console.log('Sign in with:', { email, password, rememberMe });

      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, show a placeholder message
      setError('WorkOS AuthKit integration pending. This is a demo page.');
    } catch {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOSignIn = async (provider: string) => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement WorkOS SSO
      // await signInWithSSO({ provider });
      console.log('SSO sign in with:', provider);

      // For now, show a placeholder message
      setError(`${provider} SSO integration pending. This is a demo page.`);
    } catch {
      setError(`Failed to sign in with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-16">
      <Card className="border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to SDWIS</CardTitle>
          <CardDescription className="text-center">
            Access Georgia drinking water compliance data
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={() => handleSSOSignIn('Google')}
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSSOSignIn('GitHub')}
              disabled={isLoading}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSSOSignIn('Microsoft')}
              disabled={isLoading}
              className="w-full"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Microsoft
            </Button>
          </div>

          <div className="text-sm text-center text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardContent>

        <CardFooter>
          <div className="text-sm text-center w-full">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Need help accessing your account?{' '}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
