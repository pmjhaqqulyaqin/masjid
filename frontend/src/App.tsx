import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
import AdminUsers from './pages/AdminUsers'
import Login from './pages/Login'

function App() {
  return (
    <Router>
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
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
