import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Layouts
import MainLayout from './components/layouts/MainLayout'
import AdminLayout from './components/layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import Kajian from './pages/Kajian'
import Infaq from './pages/Infaq'
import Laporan from './pages/Laporan'
import Layanan from './pages/Layanan'

import AdminDashboard from './pages/AdminDashboard'
import AdminDonations from './pages/AdminDonations'
import AdminKajian from './pages/AdminKajian'
import AdminFinance from './pages/AdminFinance'
import AdminIbadah from './pages/AdminIbadah'
import AdminServices from './pages/AdminServices'
import AdminSettings from './pages/AdminSettings'
import AdminArticles from './pages/AdminArticles'
import AdminUsers from './pages/AdminUsers'
import Login from './pages/Login'

// Redirect ke Home setiap kali app pertama kali dibuka (session baru)
function RedirectOnOpen() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasOpened = sessionStorage.getItem('app_opened');
    if (!hasOpened) {
      sessionStorage.setItem('app_opened', '1');
      // Hanya redirect jika bukan halaman admin (agar login callback tetap bekerja)
      if (!location.pathname.startsWith('/admin') && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <RedirectOnOpen />
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        {/* App Jamaah Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/kajian" element={<Kajian />} />
          <Route path="/infaq" element={<Infaq />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/layanan" element={<Layanan />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="kajian" element={<AdminKajian />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="ibadah" element={<AdminIbadah />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
