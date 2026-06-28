import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [showInputMenu, setShowInputMenu] = useState(false);
  const navigate = useNavigate();

  const handleDownloadLaporan = () => {
    window.print();
  };

  return (
    <main className="pt-20 md:pt-10 pb-24 md:pb-12 px-container-margin max-w-7xl mx-auto w-full space-y-stack-lg relative">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display-lg text-emerald-deep">Assalamualaikum, Admin</h2>
          <p className="text-body-md text-on-surface-variant">Overview sistem hari ini, 24 Oktober 2023.</p>
        </div>
        <div className="flex gap-3 relative">
          <button 
            onClick={handleDownloadLaporan}
            className="flex items-center gap-2 bg-white border border-outline-variant px-4 py-2.5 rounded-xl font-label-lg shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-emerald-deep">download</span>
            Laporan
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowInputMenu(!showInputMenu)}
              className="flex items-center gap-2 bg-emerald-deep text-white px-5 py-2.5 rounded-xl font-label-lg shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
              Input Baru
            </button>
            
            {showInputMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-outline-variant/30 py-2 w-48 z-50">
                <button onClick={() => navigate('/admin/donations')} className="w-full text-left px-4 py-2 hover:bg-mint-fresh/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">savings</span> Infaq Baru
                </button>
                <button onClick={() => navigate('/admin/finance')} className="w-full text-left px-4 py-2 hover:bg-mint-fresh/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span> Kas Baru
                </button>
                <button onClick={() => navigate('/admin/kajian')} className="w-full text-left px-4 py-2 hover:bg-mint-fresh/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">event</span> Kajian Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
        {/* Total Donations */}
        <div className="bento-card bg-surface-white p-6 rounded-[2rem] shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-mint-fresh/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-label-sm text-outline uppercase tracking-wider">Total Infaq (Bulan Ini)</p>
              <h3 className="font-prayer-time-display text-emerald-deep mt-1">Rp 45.280.000</h3>
              <div className="flex items-center gap-1 mt-2 text-emerald-600 font-label-sm">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+12% dari bulan lalu</span>
              </div>
            </div>
            <div className="bg-mint-fresh p-3 rounded-2xl">
              <span className="material-symbols-outlined text-emerald-deep fill-icon">savings</span>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bento-card bg-surface-white p-6 rounded-[2rem] shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-soft/20 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-label-sm text-outline uppercase tracking-wider">Permohonan Layanan</p>
              <h3 className="font-prayer-time-display text-emerald-deep mt-1">12 Pending</h3>
              <div className="flex items-center gap-1 mt-2 text-gold-spiritual font-label-sm">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Butuh persetujuan segera</span>
              </div>
            </div>
            <div className="bg-amber-soft/40 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-gold-spiritual fill-icon">event_busy</span>
            </div>
          </div>
        </div>

        {/* Upcoming Kajian */}
        <div className="bento-card bg-surface-white p-6 rounded-[2rem] shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-deep/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-label-sm text-outline uppercase tracking-wider">Kajian Terjadwal</p>
              <h3 className="font-prayer-time-display text-emerald-deep mt-1">8 Sesi</h3>
              <div className="flex items-center gap-1 mt-2 text-on-secondary-fixed-variant font-label-sm">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>7 hari ke depan</span>
              </div>
            </div>
            <div className="bg-emerald-deep/10 p-3 rounded-2xl">
              <span className="material-symbols-outlined text-emerald-deep fill-icon">menu_book</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg pb-10">
        {/* Quick Action Grid */}
        <div className="lg:col-span-2 space-y-gutter-md">
          <h3 className="font-headline-md text-emerald-deep flex items-center gap-2">
            <span className="material-symbols-outlined">bolt</span>
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <QuickActionBtn icon="add_card" label="Tambah Transaksi" />
            <QuickActionBtn icon="event_repeat" label="Jadwal Kajian" />
            <QuickActionBtn icon="verified_user" label="Approve Layanan" />
            <QuickActionBtn icon="campaign" label="Umumkan" />
            <QuickActionBtn icon="person_add" label="Staf Baru" />
            <QuickActionBtn icon="settings" label="Pengaturan" />
          </div>

          {/* Featured Section: Progress Infaq Pembangunan */}
          <div className="mt-8 bg-emerald-deep p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 w-full">
                <h4 className="font-headline-lg-mobile">Progress Renovasi Masjid</h4>
                <p className="text-on-primary-container text-body-sm opacity-90">Target penyelesaian tahap pondasi: Desember 2023</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-3 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-soft w-[75%] rounded-full"></div>
                  </div>
                  <span className="font-label-lg">75%</span>
                </div>
              </div>
              <button className="bg-amber-soft text-emerald-deep px-8 py-3 rounded-2xl font-label-lg shadow-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="space-y-gutter-md">
          <h3 className="font-headline-md text-emerald-deep flex items-center gap-2">
            <span className="material-symbols-outlined">history</span>
            Aktivitas Terbaru
          </h3>
          <div className="bg-surface-white rounded-[2rem] border border-mint-fresh/30 shadow-sm overflow-hidden">
            <div className="divide-y divide-outline-variant/30">
              <ActivityItem 
                icon="payments" 
                bg="bg-mint-fresh" 
                iconColor="text-emerald-deep"
                time="Baru saja"
                content={<><span className="font-semibold">H. Ahmad</span> mendonasikan <span className="text-emerald-deep font-semibold">Rp 5.000.000</span> untuk renovasi.</>}
              />
              <ActivityItem 
                icon="event_available" 
                bg="bg-secondary-container" 
                iconColor="text-on-secondary-fixed-variant"
                time="2 jam yang lalu"
                content={<>Ustadz Hanan Attaki mengkonfirmasi jadwal Kajian Ahad Subuh.</>}
              />
              <ActivityItem 
                icon="report" 
                bg="bg-error-container" 
                iconColor="text-error"
                time="5 jam yang lalu"
                content={<>Laporan kerusakan AC di ruang sholat utama oleh Staf Kebersihan.</>}
              />
              <ActivityItem 
                icon="person_add" 
                bg="bg-mint-fresh" 
                iconColor="text-emerald-deep"
                time="Kemarin, 14:20"
                content={<>User <span className="font-semibold">Siti Aminah</span> mendaftar akun baru.</>}
              />
            </div>
            <button className="w-full py-4 text-center font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function QuickActionBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-mint-fresh/40 rounded-3xl hover:bg-mint-fresh/10 transition-colors group">
      <div className="bg-mint-fresh p-4 rounded-2xl group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-emerald-deep">{icon}</span>
      </div>
      <span className="font-label-lg text-on-surface">{label}</span>
    </button>
  );
}

function ActivityItem({ icon, bg, iconColor, time, content }: { icon: string, bg: string, iconColor: string, time: string, content: React.ReactNode }) {
  return (
    <div className="p-5 flex gap-4 hover:bg-surface-container-low transition-colors group cursor-pointer">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
        <span className={`material-symbols-outlined ${iconColor} text-lg`}>{icon}</span>
      </div>
      <div>
        <p className="text-body-sm text-on-surface">{content}</p>
        <p className="text-label-sm text-outline mt-1">{time}</p>
      </div>
    </div>
  );
}
