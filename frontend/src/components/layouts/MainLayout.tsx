import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSession, signIn } from '../../hooks/useAuth';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Login modal states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { error } = await signIn.email({ email: username, password });
      if (error) throw new Error(error.message || 'Username atau password salah');
      navigate('/admin');
      setShowLoginModal(false);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm bg-surface-white rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
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
                <div className="bg-error-container text-on-error-container p-2.5 rounded-lg text-[11px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-sm">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">person</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full border border-outline-variant rounded-lg pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border border-outline-variant rounded-lg pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-emerald-deep transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-deep text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Memproses...
                    </span>
                  ) : 'Masuk'}
                </button>
              </form>

              {/* Info */}
              <p className="text-center text-on-surface-variant text-[10px] pt-1">
                <span className="material-symbols-outlined text-[10px] align-middle mr-0.5">info</span>
                Akun dibuat oleh admin. Hubungi pengurus untuk akses.
              </p>

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
