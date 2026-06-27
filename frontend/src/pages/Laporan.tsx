export default function Laporan() {
  return (
    <>
      {/* Marquee Announcement */}
      <div className="fixed top-16 left-0 w-full bg-emerald-deep text-white py-2 overflow-hidden z-40">
        <div className="animate-[marquee_20s_linear_infinite] inline-block font-label-lg text-label-lg px-4 whitespace-nowrap">
          Teks berjalan dikelola melalui Tampilan &gt; Sesuaikan &gt; WP Masjid: Pengaturan &gt; Pengaturan Layout. Mari salurkan infaq terbaik Anda untuk pembangunan Masjid At-Taqwa.
        </div>
      </div>

      <main className="px-container-margin pt-28 pb-24 max-w-lg mx-auto">
        {/* Hero Balance Section (Asymmetric) */}
        <section className="relative mb-stack-lg">
          <div className="bg-emerald-deep rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
            {/* Abstract Geometric Decoration */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute right-4 bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px] fill-icon">account_balance_wallet</span>
            </div>
            
            <div className="relative z-10">
              <span className="inline-block bg-white/20 px-3 py-1 rounded-full font-label-sm text-label-sm mb-2">SALDO</span>
              <h2 className="font-display-lg text-white mb-6">Rp 5.826.000,-</h2>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-amber-soft text-tertiary font-label-lg text-label-lg px-6 py-3 rounded-full hover:shadow-md active:scale-95 transition-all">
                  <span className="material-symbols-outlined">download</span>
                  Download Laporan (PDF)
                </button>
                <button className="flex items-center gap-2 bg-white/10 text-white font-label-lg text-label-lg px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">filter_list</span>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Stats & Chart */}
        <section className="grid grid-cols-2 gap-4 mb-stack-lg">
          {/* Arus Kas Chart */}
          <div className="col-span-2 md:col-span-1 bg-surface-white rounded-xl p-5 shadow-[0_4px_20px_rgba(6,78,59,0.05)] hover:shadow-xl transition-shadow duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-primary">Arus Kas Bulanan</h3>
              <span className="text-on-surface-variant font-label-sm">Oktober 2024</span>
            </div>
            <div className="h-32 flex items-end justify-between gap-2 px-2">
              <div className="w-full bg-mint-fresh rounded-t-lg relative group h-[40%]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-white text-[10px] px-1 rounded">2.1M</div>
              </div>
              <div className="w-full bg-emerald-deep rounded-t-lg relative group h-[85%]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-white text-[10px] px-1 rounded">4.5M</div>
              </div>
              <div className="w-full bg-mint-fresh rounded-t-lg relative group h-[60%]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-white text-[10px] px-1 rounded">3.2M</div>
              </div>
              <div className="w-full bg-emerald-deep rounded-t-lg relative group h-[95%]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-white text-[10px] px-1 rounded">5.8M</div>
              </div>
              <div className="w-full bg-mint-fresh rounded-t-lg relative group h-[50%]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-white text-[10px] px-1 rounded">2.8M</div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-outline font-label-sm">
              <span>Jun</span><span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span>
            </div>
          </div>
          
          {/* Total Infaq Today */}
          <div className="bg-surface-white rounded-xl p-5 shadow-[0_4px_20px_rgba(6,78,59,0.05)] hover:shadow-xl transition-shadow duration-200 border-l-4 border-emerald-deep">
            <span className="text-on-surface-variant font-label-sm block mb-1">Infaq Hari Ini</span>
            <span className="font-headline-md text-emerald-deep block">Rp 450k</span>
            <div className="mt-2 text-[10px] text-emerald-deep font-bold flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </div>
          </div>
          
          {/* Total Expenditure */}
          <div className="bg-surface-white rounded-xl p-5 shadow-[0_4px_20px_rgba(6,78,59,0.05)] hover:shadow-xl transition-shadow duration-200 border-l-4 border-error">
            <span className="text-on-surface-variant font-label-sm block mb-1">Pengeluaran</span>
            <span className="font-headline-md text-error block">Rp 2.1M</span>
            <div className="mt-2 text-[10px] text-error font-bold flex items-center">
              <span className="material-symbols-outlined text-sm">trending_down</span> -5%
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="mb-stack-lg">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-headline-md text-primary">Riwayat Transaksi</h3>
            <a className="text-emerald-deep font-label-lg text-label-lg" href="#">Lihat Semua</a>
          </div>
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="font-label-lg text-on-surface">Bisyaroh Ust, Syihabudin</p>
                  <p className="text-[12px] text-outline">04 Okt 2024 • Muslimah</p>
                </div>
              </div>
              <span className="font-headline-md text-error text-sm">-Rp 250k</span>
            </div>
            {/* Row 2 */}
            <div className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-mint-fresh flex items-center justify-center text-emerald-deep">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <p className="font-label-lg text-on-surface">Saldo Awal Bulan</p>
                  <p className="text-[12px] text-outline">01 Okt 2024 • Bank BSI</p>
                </div>
              </div>
              <span className="font-headline-md text-emerald-deep text-sm">+Rp 6.8M</span>
            </div>
            {/* Row 3 */}
            <div className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <p className="font-label-lg text-on-surface">Operasional TPQ</p>
                  <p className="text-[12px] text-outline">03 Okt 2024 • Kebutuhan</p>
                </div>
              </div>
              <span className="font-headline-md text-error text-sm">-Rp 200k</span>
            </div>
          </div>
        </section>

        {/* Donasi Section (Premium Glassmorphism Card) */}
        <section className="mb-stack-lg">
          <div className="bg-amber-soft/20 border border-amber-soft/50 rounded-2xl p-6 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="font-headline-md text-tertiary mb-2">Mari Ber-Infaq</h3>
                <p className="text-body-sm text-tertiary/80 mb-4">Penyaluran dana transparan untuk kemaslahatan umat. Salurkan infaq Anda melalui rekening resmi masjid.</p>
                <div className="flex gap-2">
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-amber-soft flex items-center gap-3">
                    <img className="w-8 h-8 object-contain" data-alt="BSI Logo" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_111_1_1200x550.webp.png" />
                    <div>
                      <p className="text-[10px] font-bold text-tertiary">Bank BSI</p>
                      <p className="text-label-lg font-bold text-on-surface">4678904578</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 bg-white rounded-xl p-2 border-2 border-amber-soft flex items-center justify-center shadow-lg">
                {/* Simulated QR Code placeholder with an icon or image */}
                <span className="material-symbols-outlined text-[64px] text-tertiary">qr_code_2</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
