import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [minutes, setMinutes] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutes((prev) => (prev > 0 ? prev - 1 : 59));
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Marquee Announcement */}
      <div className="mt-16 w-full bg-emerald-deep py-2 marquee-container overflow-hidden">
        <div className="marquee-content text-white font-label-lg text-label-lg px-4 whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite]">
          Teks berjalan dikelola melalui Tampilan &gt; Sesuaikan &gt; WP Masjid: Pengaturan &gt; Pengaturan Layout • Infaq Pembangunan Tahap II sedang dibuka • Kajian rutin Sabtu malam bersama Ustadz Ridwan.
        </div>
      </div>
      
      <main className="px-container-margin pt-stack-md space-y-stack-lg">
        {/* Hero Section */}
        <section className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
          <img className="w-full h-full object-cover" data-alt="Visual" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_111_1_1200x550.webp.png" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent flex flex-col justify-end p-gutter-md">
            <span className="text-white/80 font-label-sm text-label-sm">Sabtu, 27 Juni 2026</span>
            <h2 className="text-white font-display-lg text-display-lg leading-tight">Selamat Datang di Baitullah</h2>
          </div>
        </section>

        {/* Prayer Times Widget */}
        <section className="space-y-stack-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-emerald-deep">Jadwal Salat</h3>
            <span className="text-gold-spiritual font-label-lg text-label-lg animate-pulse">{minutes} menit menuju Ashar</span>
            <a className="text-label-sm text-emerald-deep font-semibold hover:underline ml-2" href="#">Lihat Jadwal Lengkap</a>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            <div className="flex-shrink-0 w-28 p-4 rounded-xl bg-white shadow-sm text-center transition-transform active:scale-95">
              <span className="font-label-sm text-on-surface-variant block mb-1">Subuh</span>
              <span className="font-prayer-time-display text-prayer-time-display text-primary">05:47</span>
            </div>
            <div className="flex-shrink-0 w-28 p-4 rounded-xl bg-white shadow-sm text-center transition-transform active:scale-95">
              <span className="font-label-sm text-on-surface-variant block mb-1">Dzuhur</span>
              <span className="font-prayer-time-display text-prayer-time-display text-primary">13:05</span>
            </div>
            <div className="flex-shrink-0 w-28 p-4 rounded-xl bg-mint-fresh text-center shadow-[0_4px_20px_rgba(6,78,59,0.1)] border-l-4 border-gold-spiritual">
              <span className="font-label-sm text-emerald-deep font-bold block mb-1">Ashar</span>
              <span className="font-prayer-time-display text-prayer-time-display text-emerald-deep">16:28</span>
            </div>
            <div className="flex-shrink-0 w-28 p-4 rounded-xl bg-white shadow-sm text-center transition-transform active:scale-95">
              <span className="font-label-sm text-on-surface-variant block mb-1">Maghrib</span>
              <span className="font-prayer-time-display text-prayer-time-display text-primary">19:00</span>
            </div>
            <div className="flex-shrink-0 w-28 p-4 rounded-xl bg-white shadow-sm text-center transition-transform active:scale-95">
              <span className="font-label-sm text-on-surface-variant block mb-1">Isya</span>
              <span className="font-prayer-time-display text-prayer-time-display text-primary">20:15</span>
            </div>
          </div>
        </section>

        {/* Infaq & Financial */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
          {/* Saldo Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-deep to-primary text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <span className="font-label-lg text-label-lg text-white/70 tracking-widest uppercase mb-2 block">SALDO SAAT INI</span>
            <div className="text-[32px] font-bold mb-6">Rp 5.826.000,-</div>
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
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm transition-transform active:scale-95">
                <div className="w-12 h-12 flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-lg">
                  <span className="text-xs font-bold leading-none">24</span>
                  <span className="text-[10px] uppercase">Apr</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md text-body-md font-semibold line-clamp-1">Halal Bihalal Warga Wonosari</h4>
                  <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 08:00 - Selesai
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm transition-transform active:scale-95">
                <div className="w-12 h-12 flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-lg">
                  <span className="text-xs font-bold leading-none">15</span>
                  <span className="text-[10px] uppercase">Mar</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md text-body-md font-semibold line-clamp-1">Kerja Bakti Idul Fitri</h4>
                  <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 07:30 - Selesai
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Announcement */}
        <section className="p-6 bg-surface-white rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-mint-fresh text-emerald-deep text-[10px] font-bold rounded-full uppercase tracking-wider">Pengumuman</span>
            <span className="text-label-sm text-on-surface-variant">Kamis, 2 Mar 2023</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary">Pelaksaaan Pengajian Ibu-Ibu Jumat Pagi</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3">
            Di setiap sudut perkampungan, saat matahari mulai naik atau menjelang sore, masjid-masjid tidak hanya ramai oleh jamaah laki-laki. Di sana, terdengar lantunan ayat suci...
          </p>
          <a className="inline-flex items-center text-emerald-deep font-label-lg text-label-lg group" href="#">
            Baca Selengkapnya
            <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </a>
        </section>

        {/* Petugas Harian Grid */}
        <section className="space-y-stack-sm">
          <h3 className="font-headline-md text-headline-md text-emerald-deep">Petugas Harian</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-deep rounded-xl text-white flex flex-col relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase opacity-60 mb-2">Imam Subuh</span>
              <span className="font-label-lg text-label-lg">Imam Samsudin</span>
              <div className="mt-4 pt-2 border-t border-white/10">
                <span className="text-[10px] uppercase opacity-60">Muadzin</span>
                <div className="font-body-sm text-body-sm">Hidayat</div>
              </div>
              <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10">person</span>
            </div>
            <div className="p-4 bg-mint-fresh rounded-xl text-emerald-deep flex flex-col relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase opacity-60 mb-2">Imam Maghrib</span>
              <span className="font-label-lg text-label-lg">Ahmad Solihun</span>
              <div className="mt-4 pt-2 border-t border-emerald-deep/10">
                <span className="text-[10px] uppercase opacity-60">Muadzin</span>
                <div className="font-body-sm text-body-sm">Khaerudin</div>
              </div>
              <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-6xl opacity-10 fill-icon">star</span>
            </div>
          </div>
        </section>

        {/* Latest Articles / Tausiyah */}
        <section className="space-y-stack-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-emerald-deep">Tausiyah Terbaru</h3>
            <button className="text-label-sm text-on-surface-variant font-semibold">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm transition-transform active:scale-95">
              <div className="w-24 h-24 rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" data-alt="Visual" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_tausiyah_1_320x240.webp.png" />
              </div>
              <div className="flex flex-col justify-center py-1">
                <span className="text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">Oleh: Ustadz Bashir</span>
                <h4 className="font-body-md text-body-md font-bold leading-tight line-clamp-2">Tuntunan Lengkap Berpuasa Ramadhan</h4>
                <span className="mt-2 text-[10px] text-on-surface-variant/60">2 Mar 2023</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Petugas Jumat Pekan Ini */}
        <section className="space-y-stack-sm">
          <h3 className="font-headline-md text-headline-md text-emerald-deep">Petugas Jumat Pekan Ini</h3>
          <div className="p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Khatib</span>
                  <span className="font-label-lg text-label-lg text-primary">KH. Ahmad Dahlan</span>
                </div>
                <span className="material-symbols-outlined text-emerald-deep opacity-20">record_voice_over</span>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Imam</span>
                  <span className="font-label-lg text-label-lg text-primary">Ust. H. Sulaiman</span>
                </div>
                <span className="material-symbols-outlined text-emerald-deep opacity-20">person</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant/60">Muadzin</span>
                  <span className="font-label-lg text-label-lg text-primary">Bpk. M. Yusuf</span>
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
                <span className="font-bold">300 m2</span>
              </div>
              <div className="flex justify-between text-label-sm border-b border-outline-variant pb-1">
                <span>Luas Bangunan</span>
                <span className="font-bold">120 m2</span>
              </div>
              <div className="flex justify-between text-label-sm">
                <span>Tahun Berdiri</span>
                <span className="font-bold">1990</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-emerald-deep rounded-3xl flex flex-col items-center justify-center text-white p-4">
            <span className="material-symbols-outlined text-4xl mb-2">account_balance</span>
            <span className="text-center text-[10px] uppercase font-bold tracking-widest leading-tight">Status Properti</span>
            <span className="text-xl font-bold">WAKAF</span>
          </div>
        </section>
      </main>
    </>
  );
}
