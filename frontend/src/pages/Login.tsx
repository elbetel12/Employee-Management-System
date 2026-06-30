import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginInput } from '../features/auth/auth.schema';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-550 via-background to-blue-50 relative overflow-hidden px-4">
      {/* Decorative colored blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md glass-card shadow-2xl border-white/20 relative z-10 transition-transform duration-300">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20 mb-3">
            EM
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Sign in to access your Employee Management dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="bg-destructive/15 border border-destructive/20 text-destructive text-sm rounded-lg p-3 text-center font-medium animate-shake">
                {errors.root.message}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-[38px] h-4 w-4 text-muted-foreground" />
              <Input
                label="Email Address"
                placeholder="you@company.com"
                type="email"
                autoComplete="username"
                className="pl-10"
                error={errors.email?.message}
                disabled={isLoggingIn}
                {...register('email')}
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3.5 top-[38px] h-4 w-4 text-muted-foreground" />
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                className="pl-10"
                error={errors.password?.message}
                disabled={isLoggingIn}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold transition-all mt-6 shadow-lg shadow-primary/25 hover:shadow-primary/35 flex items-center justify-center gap-2 group"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
