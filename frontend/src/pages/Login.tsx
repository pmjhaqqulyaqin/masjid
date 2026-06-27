import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient, signIn } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn.social({
      provider: 'google',
      callbackURL: '/admin'
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

        {step === 'phone' ? (
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

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-surface-white border border-outline-variant text-on-surface font-label-lg py-4 rounded-xl hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              Google
            </button>
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
        )}
      </div>
    </div>
  );
}
