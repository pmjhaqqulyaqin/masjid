import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function MainLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className="min-h-screen bg-surface">
      {/* Top App Bar */}
      <header className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-margin h-16 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'} dark:shadow-none`}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-deep">location_on</span>
          <div className="flex flex-col">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-emerald-deep leading-tight">Masjid Haqqul Yaqin</h1>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Jl. Lintas Lampung Barat</span>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-mint-fresh transition-colors">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
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
