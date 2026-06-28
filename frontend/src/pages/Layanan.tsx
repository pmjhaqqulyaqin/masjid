import { useSettings } from '../hooks/useSettings';

export default function Layanan() {
  const { settings } = useSettings();

  const renderMap = (embedStr?: string) => {
    if (!embedStr) return null;
    if (embedStr.includes('<iframe')) {
      return <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: embedStr }} />;
    }
    const match = embedStr.match(/(https:\/\/www\.google\.com\/maps\/embed\?[^\s"]+)/);
    if (match) {
      return <iframe src={match[1]} className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>;
    }
    return null;
  };

  return (
    <>
      {/* Marquee Announcement */}
      {settings?.running_text_layanan && (
        <div className="fixed top-16 left-0 w-full bg-emerald-deep py-2 overflow-hidden whitespace-nowrap z-40">
          <p className="animate-[marquee_20s_linear_infinite] inline-block font-label-lg text-label-lg text-white">
            {settings.running_text_layanan}
          </p>
        </div>
      )}
      
      <main className="px-container-margin pt-28 pb-24 space-y-stack-lg max-w-lg mx-auto">
        {/* Service Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-primary">Layanan Kami</h2>
            <span className="font-label-sm text-label-sm text-emerald-deep uppercase tracking-wider">Akses Cepat</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Pendaftaran Mualaf */}
            <div className="bg-surface-white rounded-xl p-4 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 group active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-mint-fresh rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-emerald-deep">person_add</span>
              </div>
              <h3 className="font-label-lg text-label-lg mb-1">Pendaftaran Mualaf</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Bimbingan syahadat dan pembinaan aqidah.</p>
            </div>
            {/* Pengurusan Jenazah */}
            <div className="bg-surface-white rounded-xl p-4 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-amber-soft/20 rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-gold-spiritual">church</span>
              </div>
              <h3 className="font-label-lg text-label-lg mb-1">Pengurusan Jenazah</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Layanan pemandian hingga pemakaman.</p>
            </div>
            {/* Pendaftaran Nikah */}
            <div className="bg-surface-white rounded-xl p-4 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-secondary">favorite</span>
              </div>
              <h3 className="font-label-lg text-label-lg mb-1">Pendaftaran Nikah</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Administrasi akad nikah di Masjid.</p>
            </div>
            {/* Peminjaman Fasilitas */}
            <div className="bg-surface-white rounded-xl p-4 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30 active:scale-95 transition-transform">
              <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-tertiary">apartment</span>
              </div>
              <h3 className="font-label-lg text-label-lg mb-1">Pinjam Fasilitas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Aula, Peralatan, dan Perlengkapan.</p>
            </div>
          </div>
        </section>

        {/* Feature Spotlight (Bento Style) */}
        <section className="space-y-4">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg border border-mint-fresh">
            <img className="w-full h-full object-cover" data-alt="Mualaf Center" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_muallaf_1_320x240.webp.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent flex flex-col justify-end p-5">
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-white mb-1">Mualaf Center</h3>
              <p className="font-body-sm text-body-sm text-mint-fresh">Bergabung dengan komunitas mualaf kami untuk pembinaan spiritual berkelanjutan.</p>
            </div>
          </div>
        </section>

        {/* Digital Directory & Facilities */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-primary">Direktori &amp; Fasilitas</h2>
          </div>
          <div className="bg-surface-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/20">
            {/* Location Map */}
            <div className="relative h-64 w-full bg-surface-variant overflow-hidden">
              {settings?.map_embed && renderMap(settings.map_embed) ? (
                renderMap(settings.map_embed)
              ) : (
                <>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_111_1_1200x550.webp.png')" }}></div>
                  <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-emerald-deep scale-75">open_in_new</span>
                    <span className="font-label-sm text-label-sm text-primary">Buka Gmaps</span>
                  </div>
                </>
              )}
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">meeting_room</span>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Aula Utama</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Kapasitas 500</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">local_library</span>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Perpustakaan</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Buku Islami</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">water_drop</span>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Tempat Wudhu</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Bersih &amp; Luas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">directions_car</span>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Parkir Luas</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Aman &amp; Nyaman</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Staff Schedule (Horizontal Scroll) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-primary">Petugas Harian</h2>
            <button className="font-label-lg text-label-lg text-emerald-deep">Lihat Semua</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-container-margin px-container-margin hide-scrollbar">
            {/* Subuh Card */}
            <div className="min-w-[240px] bg-mint-fresh/20 rounded-2xl p-5 border-l-4 border-emerald-deep shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-lg text-label-lg text-emerald-deep uppercase tracking-widest">Subuh</span>
                <span className="material-symbols-outlined text-emerald-deep">wb_twilight</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-deep flex items-center justify-center text-white font-bold text-xs">IS</div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Imam</p>
                    <p className="font-label-lg text-label-lg text-primary">Imam Samsudin</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs">H</div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Muadzin</p>
                    <p className="font-label-lg text-label-lg text-primary">Hidayat</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Maghrib Card */}
            <div className="min-w-[240px] bg-amber-soft/10 rounded-2xl p-5 border-l-4 border-gold-spiritual shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-lg text-label-lg text-gold-spiritual uppercase tracking-widest">Maghrib</span>
                <span className="material-symbols-outlined text-gold-spiritual">wb_sunny</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold-spiritual flex items-center justify-center text-white font-bold text-xs">AS</div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Imam</p>
                    <p className="font-label-lg text-label-lg text-primary">Ahmad Solihun</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs">K</div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Muadzin</p>
                    <p className="font-label-lg text-label-lg text-primary">Khaerudin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Form */}
        <section className="bg-emerald-deep rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-mint-fresh/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2">Butuh Layanan Cepat?</h3>
            <p className="font-body-sm text-body-sm text-mint-fresh mb-6">Ajukan pendaftaran atau permohonan layanan tanpa harus datang langsung.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <select className="w-full bg-white/10 border-white/20 rounded-xl px-4 py-3 text-white font-label-lg appearance-none outline-none">
                  <option className="text-on-surface">Pilih Jenis Layanan</option>
                  <option className="text-on-surface">Pendaftaran Mualaf</option>
                  <option className="text-on-surface">Peminjaman Fasilitas</option>
                  <option className="text-on-surface">Lainnya</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-3.5 text-white pointer-events-none">expand_more</span>
              </div>
              <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 font-label-lg outline-none" placeholder="Nama Lengkap" type="text" />
              <button className="w-full bg-amber-soft text-tertiary font-label-lg py-4 rounded-xl shadow-lg active:scale-95 transition-transform font-bold" type="submit">Kirim Permohonan</button>
            </form>
          </div>
        </section>

        {/* Important Contacts */}
        <section className="space-y-4 pb-12">
          <h2 className="font-headline-md text-headline-md text-primary">Kontak Penting</h2>
          <div className="flex flex-col gap-3">
            <a className="flex items-center justify-between p-4 bg-surface-white rounded-xl shadow-sm border border-mint-fresh/20" href="tel:09878786579">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-error-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-error">phone_in_talk</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">Darurat / Jenazah</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">0987-8786-579</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </a>
            <a className="flex items-center justify-between p-4 bg-surface-white rounded-xl shadow-sm border border-mint-fresh/20" href="https://wa.me/628479937389" target="_blank" rel="noreferrer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-mint-fresh rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-deep">chat</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">WhatsApp Pengurus</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Klik untuk chat langsung</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
