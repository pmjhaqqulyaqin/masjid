import { useState } from 'react';
import { useKajian } from '../hooks/useKajian';
import { useSettings } from '../hooks/useSettings';

export default function Kajian() {
  const { kajianQuery } = useKajian();
  const { settings } = useSettings();
  const [activeDate, setActiveDate] = useState('SAB_27');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const dates = [
    { day: 'SAB', date: '27', id: 'SAB_27' },
    { day: 'MIN', date: '28', id: 'MIN_28' },
    { day: 'SEN', date: '29', id: 'SEN_29' },
    { day: 'SEL', date: '30', id: 'SEL_30' },
    { day: 'RAB', date: '01', id: 'RAB_01' },
    { day: 'KAM', date: '02', id: 'KAM_02' },
  ];

  const categories = ['Semua', 'Fiqh', 'Akidah', 'Tahsin', 'Adab'];

  return (
    <>
      {/* Marquee Announcement */}
      {settings?.running_text_kajian && (
        <div className="fixed top-14 left-0 w-full bg-emerald-deep text-surface-white py-1 z-40 marquee-container overflow-hidden">
          <div className="marquee-content text-[11px] font-medium whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite]">
            {settings.running_text_kajian}
          </div>
        </div>
      )}

      <main className="pt-24 pb-24 px-container-margin max-w-lg mx-auto">
        {/* Horizontal Calendar */}
        <section className="mb-stack-lg">
          <div className="flex justify-between items-center mb-stack-sm">
            <h2 className="font-headline-md text-headline-md text-emerald-deep">Pilih Jadwal</h2>
            <button className="text-gold-spiritual font-label-lg text-label-lg">Lihat Kalender</button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
            {dates.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDate(d.id)}
                className={`flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  activeDate === d.id
                    ? 'bg-emerald-deep text-surface-white shadow-lg scale-105'
                    : 'bg-surface-container-low border border-outline-variant/30 hover:bg-surface-variant'
                }`}
              >
                <span className={`text-label-sm font-label-sm ${activeDate === d.id ? 'opacity-80' : 'text-on-surface-variant'}`}>
                  {d.day}
                </span>
                <span className={`text-headline-md font-headline-md ${activeDate === d.id ? '' : 'text-on-surface'}`}>
                  {d.date}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Category Filters */}
        <section className="mb-stack-lg">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-mint-fresh text-emerald-deep border border-emerald-deep/20'
                    : 'bg-surface-white text-on-surface-variant border border-outline-variant/30 hover:bg-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Live Streaming Alert (If Any) */}
        <div className="mb-stack-lg relative overflow-hidden rounded-2xl bg-error p-4 text-on-error flex items-center justify-between shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-surface-white animate-pulse"></span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase">Live Sekarang</span>
            </div>
            <h3 className="font-headline-md text-headline-md leading-tight">Fiqh Ibadah: Sholat Jenazah</h3>
            <p className="text-body-sm font-body-sm opacity-90 mt-1">Ustad Bashir • Aula Masjid</p>
          </div>
          <button className="bg-surface-white text-error px-4 py-2 rounded-xl font-label-lg text-label-lg shadow-md active:scale-95 transition-transform">
            Tonton
          </button>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[100px] fill-icon">sensors</span>
          </div>
        </div>

        {/* Kajian List */}
        <section className="mb-stack-lg">
          <h2 className="font-headline-md text-emerald-deep mb-stack-md">Daftar Kajian Hari Ini</h2>
          <div className="space-y-4">
            {kajianQuery.isLoading ? (
              <p className="text-on-surface-variant text-center py-4">Memuat data kajian...</p>
            ) : kajianQuery.data?.length === 0 ? (
              <p className="text-on-surface-variant text-center py-4">Belum ada kajian terjadwal.</p>
            ) : (
              kajianQuery.data?.map((item: any, index: number) => (
                <div key={item.id} className={`bg-surface-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border-l-4 ${index % 2 === 0 ? 'border-gold-spiritual' : 'border-emerald-deep/20'} relative group transition-all hover:shadow-lg`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 ${index % 2 === 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'} rounded-lg font-label-sm`}>
                      Umum
                    </span>
                    <span className="text-on-surface-variant font-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span> 
                      {new Date(item.scheduledAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-on-surface mb-2">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-surface-dim overflow-hidden border border-mint-fresh flex-shrink-0">
                      <img className="w-full h-full object-cover" data-alt="Ustad Portrait" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png" />
                    </div>
                    <div>
                      <p className="font-label-lg text-on-surface">{item.ustadzName}</p>
                      <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-sm">
                        <span className="material-symbols-outlined text-sm">{item.liveStreamUrl ? 'videocam' : 'place'}</span> 
                        {item.liveStreamUrl ? 'Online via Zoom' : 'Aula Utama Masjid'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tausiyah Terbaru (Bento Grid) */}
        <section className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-emerald-deep mb-stack-md">Tausiyah Terbaru</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Large Feature */}
            <div className="col-span-2 relative h-48 rounded-3xl overflow-hidden group">
              <div className="absolute inset-0">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_pos_tausiyah.webp.png" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 p-5 w-full">
                <span className="text-amber-soft font-label-sm text-label-sm uppercase tracking-widest mb-1 block">Tuntunan</span>
                <h3 className="text-surface-white font-headline-md text-headline-md leading-tight">Mencapai Khusyuk dalam Beribadah</h3>
              </div>
            </div>

            {/* Small Item 1 */}
            <div className="bg-surface-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col justify-between">
              <div className="w-10 h-10 bg-mint-fresh rounded-xl flex items-center justify-center text-emerald-deep mb-3">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <h4 className="font-label-lg text-label-lg text-on-surface leading-snug">Adab Kepada Tetangga</h4>
              <span className="text-on-surface-variant font-label-sm text-label-sm mt-2 block">2 Mar 2023</span>
            </div>

            {/* Small Item 2 */}
            <div className="bg-surface-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col justify-between">
              <div className="w-10 h-10 bg-tertiary-fixed rounded-xl flex items-center justify-center text-tertiary mb-3">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h4 className="font-label-lg text-label-lg text-on-surface leading-snug">Menjaga Hati dari Penyakit Riya</h4>
              <span className="text-on-surface-variant font-label-sm text-label-sm mt-2 block">24 Feb 2026</span>
            </div>
          </div>
        </section>

        {/* Staff / Petugas Harian Quick View */}
        <section className="mb-stack-lg bg-emerald-deep rounded-[2rem] p-6 text-surface-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">mosque</span>
          </div>
          <h2 className="font-headline-md text-headline-md mb-stack-md relative z-10">Petugas Maghrib</h2>
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <span className="text-label-sm font-label-sm opacity-70 uppercase tracking-wider block mb-1">Imam</span>
              <p className="font-label-lg text-label-lg">Ahmad Solihun</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <span className="text-label-sm font-label-sm opacity-70 uppercase tracking-wider block mb-1">Muadzin</span>
              <p className="font-label-lg text-label-lg">Khaerudin</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
