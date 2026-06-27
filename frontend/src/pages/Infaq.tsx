import { useState } from 'react';

export default function Infaq() {
  const [amount, setAmount] = useState<string>('100000');

  const presetAmounts = [
    { label: '50rb', value: '50000' },
    { label: '100rb', value: '100000' },
    { label: '200rb', value: '200000' },
  ];

  return (
    <>
      {/* Marquee Announcement */}
      <div className="fixed top-16 left-0 w-full bg-emerald-deep text-white py-2 overflow-hidden z-40">
        <div className="whitespace-nowrap inline-block animate-[marquee_20s_linear_infinite] text-label-lg font-label-lg uppercase">
          Mari salurkan Infaq &amp; Sedekah terbaik Anda untuk renovasi Masjid At-Taqwa. Semoga menjadi amal jariyah yang tak terputus. Jazakumullah Khairan Katsiran.
        </div>
      </div>

      <main className="px-container-margin pt-28 max-w-lg mx-auto">
        {/* Header Text */}
        <div className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-primary">Donasi &amp; Infaq Online</h1>
          <p className="text-on-surface-variant font-body-md mt-2">Pilih kategori kebaikan yang ingin Anda tunaikan hari ini.</p>
        </div>

        {/* Donation Categories - Bento Grid Style */}
        <section className="grid grid-cols-2 gap-4 mb-stack-lg">
          <button className="flex flex-col items-center justify-center p-6 bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh hover:bg-mint-fresh transition-colors active:scale-95">
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">mosque</span>
            <span className="font-label-lg text-label-lg">Infaq Masjid</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh hover:bg-mint-fresh transition-colors active:scale-95">
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">payments</span>
            <span className="font-label-lg text-label-lg">Zakat Maal</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh hover:bg-mint-fresh transition-colors active:scale-95">
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">volunteer_activism</span>
            <span className="font-label-lg text-label-lg">Wakaf</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh hover:bg-mint-fresh transition-colors active:scale-95">
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">child_care</span>
            <span className="font-label-lg text-label-lg">Anak Yatim</span>
          </button>
        </section>

        {/* Amount Selection */}
        <section className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Pilih Nominal</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presetAmounts.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setAmount(preset.value)}
                className={`py-3 px-2 border-2 rounded-xl font-label-lg transition-all ${
                  amount === preset.value
                    ? 'border-emerald-deep bg-emerald-deep text-white shadow-lg'
                    : 'border-mint-fresh text-emerald-deep bg-surface-white hover:bg-mint-fresh/20'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-lg">Rp</span>
            <input 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant focus:border-emerald-deep focus:ring-1 focus:ring-emerald-deep bg-surface-white outline-none font-body-lg text-body-lg" 
              placeholder="Nominal Lainnya" 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </section>

        {/* Recurring Option */}
        <div className="flex items-center justify-between p-4 bg-secondary-fixed rounded-xl mb-stack-lg border border-mint-fresh">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-deep">update</span>
            <div>
              <span className="block font-label-lg text-primary">Jadikan Donasi Rutin</span>
              <span className="block text-label-sm text-on-secondary-fixed-variant">Mingguan atau Bulanan</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-deep"></div>
          </label>
        </div>

        {/* Payment Methods */}
        <section className="mb-stack-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Metode Pembayaran</h2>
          <div className="space-y-3">
            {/* QRIS Special Highlight */}
            <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-deep to-primary text-white rounded-xl shadow-lg group">
              <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-lg">
                  <span className="material-symbols-outlined text-emerald-deep font-bold">qr_code_scanner</span>
                </div>
                <div className="text-left">
                  <span className="block font-label-lg">QRIS Scan Cepat</span>
                  <span className="block text-label-sm opacity-80">Support All E-Wallet &amp; Mobile Banking</span>
                </div>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            
            {/* Bank Lists */}
            <div className="bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-surface-container-highest overflow-hidden">
              <div className="p-4 border-b border-surface-container-highest flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">account_balance</span>
                  <span className="font-label-lg">Transfer Bank</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant">expand_more</span>
              </div>
              <div className="divide-y divide-surface-container-highest">
                <button className="w-full flex items-center gap-4 p-4 hover:bg-background text-left">
                  <div className="w-10 h-6 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-primary">BSI</div>
                  <span className="font-body-md">Bank Syariah Indonesia</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-background text-left">
                  <div className="w-10 h-6 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-blue-800">BRI</div>
                  <span className="font-body-md">Bank Rakyat Indonesia</span>
                </button>
              </div>
            </div>

            {/* E-Wallet */}
            <div className="bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-surface-container-highest overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">wallet</span>
                <span className="font-label-lg">E-Wallet</span>
              </div>
              <div className="flex gap-4 p-4 pt-0">
                <button className="flex-1 py-3 px-2 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-background">
                  <span className="font-bold text-blue-600">GoPay</span>
                </button>
                <button className="flex-1 py-3 px-2 border border-outline-variant rounded-lg flex items-center justify-center hover:bg-background">
                  <span className="font-bold text-purple-700">OVO</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quran Quote Footer Content */}
        <footer className="mt-stack-lg mb-12 text-center px-4">
          <div className="w-12 h-1 bg-gold-spiritual mx-auto mb-4 rounded-full"></div>
          <p className="font-headline-md text-headline-md text-emerald-deep italic mb-2">"Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..."</p>
          <p className="font-label-lg text-label-lg text-on-surface-variant">(QS. Al-Baqarah: 261)</p>
        </footer>
      </main>
    </>
  );
}
