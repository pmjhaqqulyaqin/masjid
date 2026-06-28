import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient, signIn, signUp } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  
  // Email Auth States
  const [loginMethod, setLoginMethod] = useState<'wa' | 'email'>('wa');
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Format nomor HP
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+62' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const { error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: formattedPhone
      });
      
      if (error) {
        setError(error.message || 'Gagal mengirim OTP');
      } else {
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat meminta OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+62' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    try {
      const { error } = await authClient.phoneNumber.verify({
        phoneNumber: formattedPhone,
        code: otpCode
      });
      
      if (error) {
        setError(error.message || 'Kode OTP salah');
      } else {
        // Login berhasil, arahkan ke dashboard
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memverifikasi OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (emailMode === 'signup') {
        const { error } = await signUp.email({
          email,
          password,
          name,
          // You could pass role somehow or default to jamaah and update in DB
        });
        if (error) throw new Error(error.message || 'Gagal mendaftar akun');
        // Auto login after sign up? better-auth signs in automatically
        navigate('/admin');
      } else {
        const { error } = await signIn.email({
          email,
          password
        });
        if (error) throw new Error(error.message || 'Email atau password salah');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/admin`
    });
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    await signIn.social({
      provider: 'facebook',
      callbackURL: `${window.location.origin}/admin`
    });
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
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-label-sm">
            {error}
          </div>
        )}

        {/* Method Switcher */}
        <div className="flex bg-surface-container-low p-1 rounded-xl mb-6">
          <button 
            onClick={() => setLoginMethod('wa')}
            className={`flex-1 py-2 rounded-lg font-label-md transition-colors ${loginMethod === 'wa' ? 'bg-emerald-deep text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            WhatsApp
          </button>
          <button 
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-lg font-label-md transition-colors ${loginMethod === 'email' ? 'bg-emerald-deep text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Email
          </button>
        </div>

        {loginMethod === 'wa' ? (
          step === 'phone' ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Nomor WhatsApp</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-deep text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Kode OTP'}
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-outline text-label-sm">Atau masuk dengan</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-surface-white border border-outline-variant text-on-surface font-label-lg py-4 rounded-xl hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full bg-[#1877F2] text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-6 h-6 brightness-0 invert" />
                Facebook
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-on-surface-variant font-body-sm">
                Masukkan 6 digit kode OTP yang telah dikirim ke nomor WhatsApp <strong>{phoneNumber}</strong>
              </p>
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Kode OTP</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full border border-outline-variant rounded-xl p-4 text-center tracking-[0.5em] font-headline-md focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || otpCode.length < 6}
              className="w-full bg-emerald-deep text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtpCode('');
                setError('');
              }}
              className="w-full text-emerald-deep font-label-md py-2 hover:underline"
            >
              Ganti Nomor WhatsApp
            </button>
          </form>
          )
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {emailMode === 'signup' && (
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Fulan"
                  className="w-full border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@masjid.id"
                className="w-full border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-outline-variant rounded-xl p-4 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white transition-all"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-deep text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : (emailMode === 'login' ? 'Masuk' : 'Daftar Akun')}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setEmailMode(emailMode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="w-full text-emerald-deep font-label-md py-2 hover:underline"
            >
              {emailMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-4 text-outline text-label-sm">Atau</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-surface-white border border-outline-variant text-on-surface font-label-lg py-4 rounded-xl hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full bg-[#1877F2] text-white font-label-lg py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-6 h-6 brightness-0 invert" />
                Facebook
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
