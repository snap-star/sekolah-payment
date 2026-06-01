import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';
import { Footer } from '@/components/footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password, rememberMe });
      toast.success('Selamat datang!');
      navigate('/');
    } catch (err: unknown) {
        if (err instanceof Error){
            toast.error(err.message || 'Login gagal');
        };
    };
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-300 to-teal-900/50 p-4">
      <div className="absolute top-4 right-4">
      <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SEKOLAH<span className="text-primary">PAY</span></CardTitle>
          <CardDescription>Masuk ke sistem pembayaran sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@sekolah.test" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-border" />
              <Label htmlFor="remember" className="text-sm font-normal">Ingat saya</Label>
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'Memuat...' : 'Masuk'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              email: admin@sekolah.test<br />
              Demo: password = "password"</p>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-sm">
            Belum punya akun? 
            <Button variant="link" size="sm" onClick={() => navigate('/register')}>
              Daftar di sini
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}