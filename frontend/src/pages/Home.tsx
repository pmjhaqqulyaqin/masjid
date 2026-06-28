import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useFinance } from '../hooks/useFinance';
import { useKajian } from '../hooks/useKajian';
import { useArticles } from '../hooks/useArticles';
import { useIbadah } from '../hooks/useIbadah';

export default function Home() {
  const [minutes, setMinutes] = useState(0);
  const [nextPrayer, setNextPrayer] = useState('Subuh');
  
  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/gambar')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000';
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };
  
  const { settings } = useSettings();
  const { summaryQuery, financeQuery } = useFinance();
  const { kajianQuery } = useKajian();
  const { articles } = useArticles();
  const { ibadahQuery } = useIbadah();

  const kajianList: any[] = kajianQuery.data || [];
  const ibadahList: any[] = ibadahQuery.data || [];

  const [prayerTimes, setPrayerTimes] = useState<any>(null);

  // Fetch automatic prayer times based on settings coords
  useEffect(() => {
    async function fetchPrayerTimes() {
      if (settings?.map_coords) {
        const [lat, lng] = settings.map_coords.split(',').map((s: string) => s.trim());
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11`);
          const data = await res.json();
          if (data.data && data.data.timings) {
            setPrayerTimes(data.data.timings);
          }
        } catch (e) {
          console.error("Failed fetching prayer times");
        }
      }
    }
    fetchPrayerTimes();
  }, [settings?.map_coords]);

  // Calculate current balance
  const currentBalance = summaryQuery.data?.totalSaldo || (financeQuery.data || []).reduce((acc: number, f: any) => {
    return f.type === 'income' ? acc + Number(f.amount) : acc - Number(f.amount);
  }, 0);

  // Filter Upcoming Agenda
  const upcomingAgenda = kajianList
    .filter(k => new Date(k.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 2);

  // Separate articles
  const pengumuman = articles.find(a => a.type === 'pengumuman');
  const tausiyahTerbaru = articles.filter(a => a.type === 'tausiyah');

  // Ibadah officers
  const jumatOfficers = ibadahList.find(i => i.prayerType === 'jumat');
  const shubuhOfficers = ibadahList.find(i => i.prayerType === 'shubuh');
  const maghribOfficers = ibadahList.find(i => i.prayerType === 'maghrib');

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes((prev) => (prev > 0 ? prev - 1 : 59));
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Marquee Announcement */}
      {settings?.running_text && (
        <div className="mt-16 w-full bg-emerald-deep py-2 marquee-container overflow-hidden">
          <div className="marquee-content text-white font-label-lg text-label-lg px-4 whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite]">
            {settings.running_text}
          </div>
        </div>
      )}
      
      <main className={`px-container-margin pt-stack-md pb-24 space-y-stack-lg ${!settings?.running_text ? 'mt-16' : ''}`}>
        {/* Hero Section */}
        <section className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
          <img className="w-full h-full object-cover" data-alt="Visual" src={settings?.banner_url ? getImageUrl(settings.banner_url) : "/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_111_1_1200x550.webp.png"} />
        </section>

        {/* Prayer Times Widget */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-on-surface-variant text-sm font-medium">
            <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>{settings?.masjid_name ? `${settings.masjid_name}` : 'Waringin - Lombok Timur'}</span>
          </div>
          <div className="flex justify-between gap-1 sm:gap-3 pb-2 w-full">
            {[
              { name: 'Subuh', time: prayerTimes?.Fajr || '--:--', icon: '/gambar/subuh.png' },
              { name: 'Dzuhur', time: prayerTimes?.Dhuhr || '--:--', icon: '/gambar/zuhur.png' },
              { name: 'Ashar', time: prayerTimes?.Asr || '--:--', icon: '/gambar/asar.png' },
              { name: 'Maghrib', time: prayerTimes?.Maghrib || '--:--', icon: '/gambar/magrib.png' },
              { name: 'Isya', time: prayerTimes?.Isha || '--:--', icon: '/gambar/isya.png' },
            ].map((prayer, idx) => (
              <div key={idx} className="flex-1 p-1.5 sm:p-3 rounded-lg bg-[#F8F9FA] flex flex-col justify-between min-h-[55px] sm:min-h-[80px] shadow-sm">
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <span className="font-label-sm text-[11px] sm:text-sm text-on-surface-variant leading-none tracking-tight">{prayer.name}</span>
                  <img src={prayer.icon} alt={prayer.name} className="w-5 h-5 sm:w-[22px] sm:h-[22px] object-contain opacity-70 -mt-0.5" />
                </div>
                <span className="font-display text-[15px] sm:text-[22px] font-bold text-[#14B8A6] leading-none">{prayer.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Infaq & Financial */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
          {/* Saldo Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-deep to-primary text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <span className="font-label-lg text-label-lg text-white/70 tracking-widest uppercase mb-2 block">SALDO SAAT INI</span>
            <div className="text-[32px] font-bold mb-6">Rp {currentBalance.toLocaleString('id-ID')}</div>
            <div className="flex gap-3">
              <Link to="/infaq" className="flex-1 bg-gold-spiritual hover:bg-amber-600 text-white font-label-lg py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">payments</span>
                Mari Ber-Infaq
              </Link>
              <Link to="/laporan" className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">analytics</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Agenda */}
          <div className="space-y-stack-sm">
            <h3 className="font-headline-md text-headline-md text-emerald-deep px-1">Agenda Terdekat</h3>
            <div className="space-y-3">
              {upcomingAgenda.length > 0 ? upcomingAgenda.map(agenda => {
                const date = new Date(agenda.scheduledAt);
                return (
                  <div key={agenda.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm transition-transform active:scale-95">
                    <div className="w-12 h-12 flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-lg">
                      <span className="text-xs font-bold leading-none">{date.getDate()}</span>
                      <span className="text-[10px] uppercase">{date.toLocaleString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body-md text-body-md font-semibold line-clamp-1">{agenda.title}</h4>
                      <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - Selesai
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-4 bg-white rounded-xl shadow-sm text-center text-on-surface-variant font-label-sm">Belum ada agenda terdekat.</div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Announcement */}
        {pengumuman && (
          <section className="p-6 bg-surface-white rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-mint-fresh text-emerald-deep text-[10px] font-bold rounded-full uppercase tracking-wider">Pengumuman</span>
              <span className="text-label-sm text-on-surface-variant">{new Date(pengumuman.publishedAt).toLocaleDateString('id-ID')}</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">{pengumuman.title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
              {pengumuman.content}
            </p>
          </section>
        )}

        {/* Petugas Harian Grid */}
        <section className="space-y-stack-sm">
          <h3 className="font-headline-md text-headline-md text-emerald-deep">Petugas Harian</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-deep rounded-xl text-white flex flex-col relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase opacity-60 mb-2">Imam Subuh</span>
              <span className="font-label-lg text-label-lg line-clamp-1">{shubuhOfficers?.imamName || 'Belum diatur'}</span>
              <div className="mt-4 pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase opacity-60">Muadzin</span>
                <div className="font-body-sm text-body-sm line-clamp-1">{shubuhOfficers?.muadzinName || 'Belum diatur'}</div>
              </div>
              <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10">person</span>
            </div>
            <div className="p-4 bg-mint-fresh rounded-xl text-emerald-deep flex flex-col relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase opacity-60 mb-2">Imam Maghrib</span>
              <span className="font-label-lg text-label-lg line-clamp-1">{maghribOfficers?.imamName || 'Belum diatur'}</span>
              <div className="mt-4 pt-2 border-t border-emerald-deep/10">
                <span className="text-[10px] uppercase opacity-60">Muadzin</span>
                <div className="font-body-sm text-body-sm line-clamp-1">{maghribOfficers?.muadzinName || 'Belum diatur'}</div>
              </div>
              <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10 fill-icon">star</span>
            </div>
          </div>
        </section>

        {/* Latest Articles / Tausiyah */}
        {tausiyahTerbaru.length > 0 && (
          <section className="space-y-stack-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-emerald-deep">Tausiyah Terbaru</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {tausiyahTerbaru.slice(0, 3).map(article => (
                <div key={article.id} className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm transition-transform active:scale-95">
                  <div className="w-24 h-24 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {article.imageUrl ? (
                      <img className="w-full h-full object-cover" data-alt="Visual" src={`http://localhost:3000${article.imageUrl}`} />
                    ) : (
                      <span className="material-symbols-outlined text-outline">article</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    {article.author && <span className="text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Oleh: {article.author}</span>}
                    <h4 className="font-body-md text-body-md font-bold leading-tight line-clamp-2">{article.title}</h4>
                    <span className="mt-2 text-[10px] text-on-surface-variant/60">{new Date(article.publishedAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Petugas Jumat Pekan Ini */}
        <section className="space-y-stack-sm">
          <h3 className="font-headline-md text-headline-md text-emerald-deep">Petugas Jumat Pekan Ini</h3>
          <div className="p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Khatib</span>
                  <span className="font-label-lg text-label-lg text-primary">{jumatOfficers?.khatibName || 'Belum ditugaskan'}</span>
                </div>
                <span className="material-symbols-outlined text-emerald-deep opacity-20">record_voice_over</span>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Imam</span>
                  <span className="font-label-lg text-label-lg text-primary">{jumatOfficers?.imamName || 'Belum ditugaskan'}</span>
                </div>
                <span className="material-symbols-outlined text-emerald-deep opacity-20">person</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Muadzin / Bilal</span>
                  <span className="font-label-lg text-label-lg text-primary">{jumatOfficers?.muadzinName || jumatOfficers?.bilalName || 'Belum ditugaskan'}</span>
                </div>
                <span className="material-symbols-outlined text-emerald-deep opacity-20">campaign</span>
              </div>
            </div>
          </div>
        </section>

        {/* Masjid Info Section (Asymmetric) */}
        <section className="grid grid-cols-5 gap-4 pb-8">
          <div className="col-span-3 p-5 bg-surface-container-low rounded-3xl space-y-3">
            <h4 className="font-headline-md text-headline-md text-primary">Informasi Masjid</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-label-sm border-b border-outline-variant pb-1">
                <span>Luas Area</span>
                <span className="font-bold">{settings?.land_area || '1200'} m2</span>
              </div>
              <div className="flex justify-between text-label-sm border-b border-outline-variant pb-1">
                <span>Luas Bangunan</span>
                <span className="font-bold">{settings?.build_area || '850'} m2</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>Tahun Berdiri</span>
                <span className="font-bold">{settings?.year_established || '1998'}</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-emerald-deep rounded-3xl flex flex-col items-center justify-center text-white p-4">
            <span className="material-symbols-outlined text-4xl mb-2">account_balance</span>
            <span className="text-center text-[10px] uppercase font-bold tracking-widest leading-tight">Status Properti</span>
            <span className="text-xl font-bold uppercase">{settings?.status_properti || 'WAKAF'}</span>
          </div>
        </section>
      </main>
    </>
  );
}
