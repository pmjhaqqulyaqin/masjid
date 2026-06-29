import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSession, authClient, signIn, signUp } from '../../hooks/useAuth';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Login modal states
  const [loginMethod, setLoginMethod] = useState<'wa' | 'email'>('email');
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modal on route change
  useEffect(() => {
    setShowLoginModal(false);
  }, [location.pathname]);

  const resetModal = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhoneNumber('');
    setOtpCode('');
    setOtpStep('phone');
    setEmailMode('login');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (emailMode === 'signup') {
        const { error } = await signUp.email({ email, password, name });
        if (error) throw new Error(error.message || 'Gagal mendaftar akun');
        navigate('/admin');
      } else {
        const { error } = await signIn.email({ email, password });
        if (error) throw new Error(error.message || 'Email atau password salah');
        navigate('/admin');
      }
      setShowLoginModal(false);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    let formattedPhone = phoneNumber;
    if (formattedPhone.startsWith('0')) formattedPhone = '+62' + formattedPhone.slice(1);
    else if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;
    try {
      const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber: formattedPhone });
      if (error) setError(error.message || 'Gagal mengirim OTP');
      else setOtpStep('otp');
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
    if (formattedPhone.startsWith('0')) formattedPhone = '+62' + formattedPhone.slice(1);
    else if (!formattedPhone.startsWith('+')) formattedPhone = '+' + formattedPhone;
    try {
      const { error } = await authClient.phoneNumber.verify({ phoneNumber: formattedPhone, code: otpCode });
      if (error) setError(error.message || 'Kode OTP salah');
      else { navigate('/admin'); setShowLoginModal(false); }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memverifikasi OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/admin` });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Top App Bar */}
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-margin h-14 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'} dark:shadow-none`}>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-emerald-deep text-[20px]">location_on</span>
          <div className="flex flex-col">
            <h1 className="font-headline-lg-mobile text-[16px] leading-tight font-semibold text-emerald-deep">Masjid Haqqul Yaqin</h1>
            <span className="text-[10px] text-on-surface-variant leading-tight">Jl. H. Lalu Anang KM 5 Desa Waringin</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {session ? (
            <Link to="/admin" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-mint-fresh transition-colors" title="Dashboard Admin">
              <div className="w-7 h-7 rounded-full bg-emerald-deep text-white flex items-center justify-center font-bold text-xs">
                {session.user.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </Link>
          ) : location.pathname === '/layanan' ? (
            <button
              onClick={() => { resetModal(); setShowLoginModal(true); }}
              className="px-3 py-1 bg-emerald-deep text-white text-[11px] font-semibold rounded-full hover:bg-emerald-deep/90 transition-colors shadow-sm"
            >
              Login
            </button>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <Outlet />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-lg border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(6,78,59,0.05)] rounded-t-xl">
        <NavItem to="/" icon="dashboard" label="Home" isActive={location.pathname === '/'} />
        <NavItem to="/kajian" icon="calendar_month" label="Kajian" isActive={location.pathname === '/kajian'} />
        <NavItem to="/infaq" icon="account_balance_wallet" label="Infaq" isActive={location.pathname === '/infaq'} />
        <NavItem to="/laporan" icon="bar_chart" label="Laporan" isActive={location.pathname === '/laporan'} />
        <NavItem to="/layanan" icon="apps" label="Layanan" isActive={location.pathname === '/layanan'} />
      </nav>

      {/* FAB for Quick Actions (Zakat/Infaq) */}
      {location.pathname !== '/infaq' && (
        <Link to="/infaq" className="fixed bottom-24 right-6 w-14 h-14 bg-gold-spiritual text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40">
          <span className="material-symbols-outlined text-3xl fill-icon">volunteer_activism</span>
        </Link>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-surface-white rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-mint-fresh rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-deep text-lg">mosque</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-emerald-deep">Masuk ke Portal</h2>
                  <p className="text-[10px] text-on-surface-variant">Manajemen Masjid Haqqul Yaqin</p>
                </div>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">close</span>
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              {error && (
                <div className="bg-error-container text-on-error-container p-2.5 rounded-lg text-[11px]">
                  {error}
                </div>
              )}

              {/* Method Switcher */}
              <div className="flex bg-surface-container-low p-0.5 rounded-lg">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${loginMethod === 'email' ? 'bg-emerald-deep text-white shadow-sm' : 'text-on-surface-variant'}`}
                >
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod('wa')}
                  className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${loginMethod === 'wa' ? 'bg-emerald-deep text-white shadow-sm' : 'text-on-surface-variant'}`}
                >
                  WhatsApp
                </button>
              </div>

              {loginMethod === 'email' ? (
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  {emailMode === 'signup' && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                      required
                    />
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                    minLength={8}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-deep text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Memproses...' : emailMode === 'login' ? 'Masuk' : 'Daftar Akun'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmailMode(emailMode === 'login' ? 'signup' : 'login'); setError(''); }}
                    className="w-full text-emerald-deep text-[11px] font-medium py-1 hover:underline"
                  >
                    {emailMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                  </button>
                </form>
              ) : otpStep === 'phone' ? (
                <form onSubmit={handleRequestOTP} className="space-y-3">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Nomor WhatsApp: 081234567890"
                    className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-deep text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Kode OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-3">
                  <p className="text-[11px] text-on-surface-variant text-center">
                    Kode OTP dikirim ke <strong>{phoneNumber}</strong>
                  </p>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="w-full border border-outline-variant rounded-lg px-3 py-2.5 text-center tracking-[0.4em] text-lg font-bold focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full bg-emerald-deep text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                  </button>
                  <button type="button" onClick={() => { setOtpStep('phone'); setOtpCode(''); setError(''); }} className="w-full text-emerald-deep text-[11px] py-1 hover:underline">
                    Ganti Nomor
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-outline-variant/50" />
                <span className="text-[10px] text-outline">atau</span>
                <div className="flex-1 border-t border-outline-variant/50" />
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-surface-white border border-outline-variant text-on-surface text-sm font-medium py-2.5 rounded-lg hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Masuk dengan Google
              </button>

              {/* Back to Dashboard */}
              <button
                onClick={() => { setShowLoginModal(false); navigate('/'); }}
                className="w-full flex items-center justify-center gap-1.5 text-on-surface-variant text-[11px] font-medium py-1.5 hover:text-emerald-deep transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) {
  if (isActive) {
    return (
      <Link to={to} className="flex flex-col items-center justify-center bg-secondary-container dark:bg-on-secondary-container text-on-secondary-container dark:text-secondary-container rounded-full px-4 py-1 scale-90 duration-200 cursor-pointer">
        <span className="material-symbols-outlined fill-icon">{icon}</span>
        <span className="font-label-sm text-label-sm">{label}</span>
      </Link>
    );
  }
  
  return (
    <Link to={to} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant px-4 py-1 hover:text-emerald-deep dark:hover:text-primary-fixed cursor-pointer">
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-label-sm text-label-sm">{label}</span>
    </Link>
  );
}
