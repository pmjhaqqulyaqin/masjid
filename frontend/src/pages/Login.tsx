import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn.email({
        email: username,
        password
      });
      if (error) throw new Error(error.message || 'Username atau password salah');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(6,78,59,0.1)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mint-fresh rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-deep text-3xl">mosque</span>
          </div>
          <h1 className="font-headline-md text-emerald-deep mb-2">Masuk ke Portal</h1>
          <p className="text-on-surface-variant font-body-sm">
            Sistem Informasi Manajemen Masjid Haqqul Yaqin
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-label-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full border border-outline-variant rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full border border-outline-variant rounded-xl pl-12 pr-12 py-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-emerald-deep transition-colors"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-deep text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-emerald-deep/20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses...
              </span>
            ) : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/30">
          <p className="text-center text-on-surface-variant font-body-sm text-[11px]">
            <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
            Akun dibuat oleh admin. Hubungi pengurus masjid untuk mendapatkan akses.
          </p>
        </div>
      </div>
    </div>
  );
}
