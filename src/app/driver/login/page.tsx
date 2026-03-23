import { Metadata } from 'next';
import { DriverLoginContainer } from '@/features/driver/containers/DriverLoginContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Driver Login | ChargeApp',
  description: 'Sign in to your driver account to access charging stations',
};

export default function DriverLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-card/95 shadow-xl border-border/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your driver account to start charging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DriverLoginContainer />
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
