import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  // NOTE: Register API is not implemented on backend yet
  // Uncomment these when backend adds /auth/register endpoint
  // const { register } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (password !== passwordConfirmation) {
      toast.error('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 8) {
      toast.error('Password minimal harus 8 karakter');
      return;
    }

    try {
      // TODO: Implement when backend adds register endpoint
      // await register.mutateAsync({ name, email, password, password_confirmation: passwordConfirmation });
      // toast.success('Pendaftaran berhasil! Silakan masuk.');
      // navigate('/login');
      
      // Temporary message until API is implemented
      toast.info('Fitur pendaftaran belum tersedia. Silakan hubungi administrator.');
    } catch (err: unknown) {
      // Handle different types of API errors (commented until API is ready)
      /*
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string, errors?: Record<string, string[]> }, status?: number } };
        const errorMessage = axiosError.response?.data?.message;
        const validationErrors = axiosError.response?.data?.errors;
        
        if (axiosError.response?.status === 422 && validationErrors) {
          // Show first validation error
          const firstError = Object.values(validationErrors)[0]?.[0];
          toast.error(firstError || 'Validasi gagal');
        } else if (axiosError.response?.status === 409) {
          toast.error(errorMessage || 'Email sudah terdaftar');
        } else {
          toast.error('Terjadi kesalahan server. Silakan coba lagi.');
        }
      } else if (err instanceof Error) {
        toast.error(err.message || 'Pendaftaran gagal');
      } else {
        toast.error('Pendaftaran gagal. Silakan coba lagi.');
      }
      */
     if (err instanceof AxiosError) {
      toast.info('Fitur pendaftaran belum tersedia. Silakan hubungi administrator.');
     }
    };
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-300 to-teal-900/50 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">SEKOLAH<span className="text-primary">PAY</span></CardTitle>
          <CardDescription>Daftar untuk masuk ke sistem pembayaran sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                autoComplete="name"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@sekolah.test" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete="email"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Minimal 8 karakter" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                autoComplete="new-password"
                minLength={8}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
              <Input 
                id="password_confirmation" 
                type="password" 
                placeholder="Ulangi password" 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                autoComplete="new-password"
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              // disabled={register?.isPending}
            >
              {/* {register?.isPending ? 'Memproses...' : 'Daftar'} */}
              Daftar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-sm">
            Sudah punya akun? 
            <Button variant="link" size="sm" onClick={() => navigate('/login')}>
              Masuk di sini
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}