import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { signOut } from '../../hooks/useAuth';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 md:pb-0 md:pl-80">
      
      {/* Top Navigation Bar (Hidden on Desktop Sidebar view) */}
      <header className="bg-surface dark:bg-surface-dim shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-container-margin h-16 max-w-screen-xl mx-auto md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-mint-fresh/40 active:scale-90 transition-all"
            aria-label="Buka menu navigasi"
          >
            <span className="material-symbols-outlined text-emerald-deep dark:text-primary-fixed">menu</span>
          </button>
          <h1 className="font-headline-md text-[24px] font-semibold text-emerald-deep dark:text-primary-fixed">Masjid Haqqul Yaqin</h1>
        </div>
        <button onClick={handleLogout} className="w-8 h-8 rounded-full overflow-hidden border-2 border-error hover:opacity-70 transition-opacity flex items-center justify-center bg-error-container" title="Logout">
          <span className="material-symbols-outlined text-error text-sm">logout</span>
        </button>
      </header>

      {/* Mobile Sidebar Drawer - Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-[280px] z-[60] bg-surface-container-lowest dark:bg-inverse-surface shadow-2xl flex flex-col h-full py-6 md:hidden transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="px-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-[22px] font-semibold text-primary">Masjid Haqqul Yaqin</h2>
            <p className="text-label-sm text-outline mt-1">Management Portal v1.0</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-3 mx-4 rounded-2xl mb-6">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
            <img className="w-full h-full object-cover" data-alt="Profile" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png" />
          </div>
          <div>
            <p className="font-label-lg text-on-surface text-sm">Admin Masjid</p>
            <p className="text-label-sm text-outline text-xs">Super Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
          <SidebarItem to="/admin" icon="dashboard" label="Dashboard" isActive={location.pathname === '/admin'} />
          <SidebarItem to="/admin/donations" icon="volunteer_activism" label="Donations" isActive={location.pathname === '/admin/donations'} />
          <SidebarItem to="/admin/kajian" icon="menu_book" label="Kajian" isActive={location.pathname === '/admin/kajian'} />
          <SidebarItem to="/admin/ibadah" icon="event_note" label="Ibadah" isActive={location.pathname === '/admin/ibadah'} />
          <SidebarItem to="/admin/articles" icon="article" label="Artikel" isActive={location.pathname === '/admin/articles'} />
          <SidebarItem to="/admin/services" icon="assignment" label="Services" isActive={location.pathname === '/admin/services'} />
          <SidebarItem to="/admin/finance" icon="payments" label="Finance" isActive={location.pathname === '/admin/finance'} />
          <SidebarItem to="/admin/users" icon="group" label="Users" isActive={location.pathname === '/admin/users'} />
          <SidebarItem to="/admin/settings" icon="settings" label="Settings" isActive={location.pathname === '/admin/settings'} />
        </nav>
        {/* Back to Jamaah App */}
        <div className="px-4 mt-2">
          <Link to="/" className="flex items-center gap-3 text-emerald-deep font-label-lg p-3 hover:bg-mint-fresh/30 rounded-xl transition-all">
            <span className="material-symbols-outlined">home</span>
            Halaman Utama
          </Link>
        </div>
        <div className="px-4 mt-1 mb-2">
          <button onClick={handleLogout} className="flex items-center gap-3 text-error font-label-lg p-3 hover:bg-error-container/30 rounded-xl transition-all w-full">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Side Navigation Drawer (Desktop) */}
      <aside className="fixed inset-y-0 left-0 w-80 z-[60] bg-surface-container-lowest dark:bg-inverse-surface shadow-2xl hidden md:flex flex-col h-full py-6">
        <div className="px-8 mb-10">
          <h2 className="font-headline-lg text-[28px] font-semibold text-primary">Masjid Haqqul Yaqin</h2>
          <p className="text-label-sm text-outline mt-1">Management Portal v1.0</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-4 mx-4 rounded-2xl mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
            <img className="w-full h-full object-cover" data-alt="Profile" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png" />
          </div>
          <div>
            <p className="font-label-lg text-on-surface">Admin Masjid</p>
            <p className="text-label-sm text-outline">Super Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
          <SidebarItem to="/admin" icon="dashboard" label="Dashboard" isActive={location.pathname === '/admin'} />
          <SidebarItem to="/admin/donations" icon="volunteer_activism" label="Donations" isActive={location.pathname === '/admin/donations'} />
          <SidebarItem to="/admin/kajian" icon="menu_book" label="Kajian" isActive={location.pathname === '/admin/kajian'} />
          <SidebarItem to="/admin/ibadah" icon="event_note" label="Ibadah" isActive={location.pathname === '/admin/ibadah'} />
          <SidebarItem to="/admin/articles" icon="article" label="Artikel" isActive={location.pathname === '/admin/articles'} />
          <SidebarItem to="/admin/services" icon="assignment" label="Services" isActive={location.pathname === '/admin/services'} />
          <SidebarItem to="/admin/finance" icon="payments" label="Finance" isActive={location.pathname === '/admin/finance'} />
          <SidebarItem to="/admin/users" icon="group" label="Users" isActive={location.pathname === '/admin/users'} />
          <SidebarItem to="/admin/settings" icon="settings" label="Settings" isActive={location.pathname === '/admin/settings'} />
        </nav>
        <div className="px-8 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 text-error font-label-lg hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <Outlet />

      {/* Bottom Navigation Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-t border-outline-variant/30 z-50">
        <MobileNavItem to="/admin" icon="home" label="Home" isActive={location.pathname === '/admin'} />
        <MobileNavItem to="/admin/donations" icon="savings" label="Infaq" isActive={location.pathname === '/admin/donations'} />
        <MobileNavItem to="/admin/kajian" icon="event_note" label="Kajian" isActive={location.pathname === '/admin/kajian'} />
        <MobileNavItem to="/admin/finance" icon="account_balance_wallet" label="Dana" isActive={location.pathname === '/admin/finance'} />
        <MobileNavItem to="/admin/users" icon="badge" label="Staf" isActive={location.pathname === '/admin/users'} />
      </nav>
    </div>
  );
}

function SidebarItem({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) {
  if (isActive) {
    return (
      <Link to={to} className="flex items-center gap-4 bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed rounded-xl p-4 mx-4 transition-all">
        <span className="material-symbols-outlined fill-icon">{icon}</span>
        <span className="font-label-lg">{label}</span>
      </Link>
    );
  }
  return (
    <Link to={to} className="flex items-center gap-4 text-on-surface-variant dark:text-outline-variant p-4 mx-4 hover:bg-mint-fresh/30 rounded-xl transition-all">
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-label-lg">{label}</span>
    </Link>
  );
}

function MobileNavItem({ to, icon, label, isActive }: { to: string; icon: string; label: string; isActive: boolean }) {
  if (isActive) {
    return (
      <Link to={to} className="flex flex-col items-center justify-center bg-primary-container dark:bg-on-primary-fixed-variant text-on-primary-container rounded-2xl px-4 py-1.5 active:scale-90 transition-all duration-300">
        <span className="material-symbols-outlined fill-icon">{icon}</span>
        <span className="text-label-sm font-label-sm">{label}</span>
      </Link>
    );
  }
  return (
    <Link to={to} className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant px-4 py-1.5 hover:bg-mint-fresh/30 active:scale-90 transition-all duration-300">
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-label-sm font-label-sm">{label}</span>
    </Link>
  );
}
