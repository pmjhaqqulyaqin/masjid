import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useDonations } from '../hooks/useDonations';

export default function Infaq() {
  const { settings, uploadAsset } = useSettings();
  const { donationsQuery } = useDonations();
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Infaq Masjid');
  const [showQris, setShowQris] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, method: string}>({isOpen: false, method: ''});
  const [donorName, setDonorName] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [confirmedMethod, setConfirmedMethod] = useState<string | null>(null);
  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.includes('fakepath') || url.startsWith('C:\\')) return ''; // Invalid local path handling
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000';
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  };

  const handleSetCategory = (cat: string) => {
    setCategory(cat);
    setSelectedMethod(null);
  };

  const handleSetAmount = (amt: string) => {
    setAmount(amt);
    setSelectedMethod(null);
  };

  const presetAmounts = [
    { label: '50rb', value: '50000' },
    { label: '100rb', value: '100000' },
    { label: '200rb', value: '200000' },
  ];

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) return alert("Mohon lampirkan bukti transfer");
    
    setIsSubmitting(true);
    try {
      // 1. Upload asset
      const uploaded = await uploadAsset(proofFile);
      
      // 2. Submit donation to backend
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donorName || 'Hamba Allah',
          type: category.toLowerCase().replace(' ', '_'),
          amount: Number(amount),
          paymentMethod: confirmModal.method,
          status: 'pending',
          proofUrl: uploaded.url
        })
      });
      
      if (!res.ok) throw new Error("Gagal mengirim konfirmasi");
      
      alert("Alhamdulillah, konfirmasi donasi berhasil dikirim. Kami akan memverifikasi secepatnya.");
      setConfirmModal({isOpen: false, method: ''});
      setDonorName('');
      setProofFile(null);
      setAmount('');
      setSelectedMethod(null);
      setCategory('Infaq Masjid');
      if (showQris) setShowQris(false);
      
    } catch (err) {
      alert("Terjadi kesalahan sistem, silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Marquee Announcement */}
      {settings?.running_text_infaq && (
        <div className="fixed top-16 left-0 w-full bg-emerald-deep text-white py-2 overflow-hidden z-40">
          <div className="whitespace-nowrap inline-block animate-[marquee_25s_linear_infinite] text-label-lg font-label-lg uppercase">
            {settings.running_text_infaq}
          </div>
        </div>
      )}

      <main className="px-container-margin pt-28 pb-24 max-w-lg mx-auto">
        {/* Page Header */}
        <header className="mb-stack-lg relative overflow-hidden rounded-2xl bg-emerald-deep text-white shadow-xl isolate p-8 sm:p-12 mt-4 text-center">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] h-[300px] bg-mint-fresh/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[250px] h-[250px] bg-gold-spiritual/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h1 className="font-display text-display-sm sm:text-display-md font-bold mb-4">Mari Berinfaq</h1>
          <p className="font-body-lg text-white/90 max-w-2xl mx-auto">"Barangsiapa yang meminjamkan kepada Allah pinjaman yang baik, maka Allah akan melipatgandakan balasan pinjaman itu untuknya..."</p>
        </header>

        {/* Ticker / Running Text */}
        {donationsQuery.data && donationsQuery.data.length > 0 && (
          <div className="mb-stack-lg bg-surface-white border border-mint-fresh rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] overflow-hidden flex items-center relative h-12">
            <div className="bg-emerald-deep text-white px-4 h-full flex items-center z-10 absolute left-0 font-label-md uppercase tracking-wider whitespace-nowrap shadow-[4px_0_10px_rgba(0,0,0,0.1)]">
              <span className="material-symbols-outlined mr-2 text-[20px]">campaign</span> Donatur Terbaru
            </div>
            <div className="w-full overflow-hidden flex-1 pl-44">
              <div className="animate-marquee whitespace-nowrap flex gap-8 items-center h-full text-emerald-deep">
                {donationsQuery.data.filter((d: any) => d.status === 'success' || d.status === 'completed').slice(0, 10).map((d: any, idx: number) => (
                  <span key={d.id || idx} className="flex items-center gap-2 font-label-md">
                    <span className="w-2 h-2 rounded-full bg-gold-spiritual"></span>
                    <span>{d.donorName || 'Hamba Allah'} berinfaq</span>
                    <span className="font-bold">Rp {parseInt(d.amount).toLocaleString('id-ID')}</span>
                    <span className="text-on-surface-variant font-body-sm capitalize">({d.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donation Categories - Bento Grid Style */}
        <section className="grid grid-cols-2 gap-4 mb-stack-lg">
          <button onClick={() => handleSetCategory('Infaq Masjid')} className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border transition-colors active:scale-95 ${category === 'Infaq Masjid' ? 'bg-mint-fresh border-emerald-deep text-emerald-deep' : 'bg-surface-white border-mint-fresh hover:bg-mint-fresh/30'}`}>
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">mosque</span>
            <span className="font-label-lg text-label-lg">Infaq Masjid</span>
          </button>
          <button onClick={() => handleSetCategory('Zakat Maal')} className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border transition-colors active:scale-95 ${category === 'Zakat Maal' ? 'bg-mint-fresh border-emerald-deep text-emerald-deep' : 'bg-surface-white border-mint-fresh hover:bg-mint-fresh/30'}`}>
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">payments</span>
            <span className="font-label-lg text-label-lg">Zakat Maal</span>
          </button>
          <button onClick={() => handleSetCategory('Wakaf')} className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border transition-colors active:scale-95 ${category === 'Wakaf' ? 'bg-mint-fresh border-emerald-deep text-emerald-deep' : 'bg-surface-white border-mint-fresh hover:bg-mint-fresh/30'}`}>
            <span className="material-symbols-outlined text-gold-spiritual text-3xl mb-2">volunteer_activism</span>
            <span className="font-label-lg text-label-lg">Wakaf</span>
          </button>
          <button onClick={() => handleSetCategory('Anak Yatim')} className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border transition-colors active:scale-95 ${category === 'Anak Yatim' ? 'bg-mint-fresh border-emerald-deep text-emerald-deep' : 'bg-surface-white border-mint-fresh hover:bg-mint-fresh/30'}`}>
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
                onClick={() => handleSetAmount(preset.value)}
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
              onChange={(e) => handleSetAmount(e.target.value)}
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
            {settings?.qris_url && (
              <button onClick={() => setShowQris(true)} className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-deep to-primary text-white rounded-xl shadow-lg group active:scale-95 transition-all">
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
            )}
            
            {/* Bank Lists */}
            {(settings?.bank_bsi || settings?.bank_bri) && (
              <div className="bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-surface-container-highest overflow-hidden">
                <div className="p-4 border-b border-surface-container-highest flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">account_balance</span>
                    <span className="font-label-lg">Transfer Bank</span>
                  </div>
                </div>
                <div className="divide-y divide-surface-container-highest">
                  {settings?.bank_bsi && (
                    <div className="w-full flex items-center gap-4 p-4 hover:bg-background text-left transition-colors">
                      <div className="w-12 py-1 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-primary">BSI</div>
                      <div className="flex-1">
                        <span className="font-body-md block leading-none">Bank Syariah Indonesia</span>
                        <span className="font-label-sm text-emerald-deep font-bold mt-1 block tracking-wider">{settings.bank_bsi}</span>
                      </div>
                      {amount !== '' && (
                        <div className="flex items-center gap-3">
                          {selectedMethod === 'transfer_bsi' ? (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmModal({isOpen: true, method: 'transfer_bsi'}); }} className="px-3 py-1 bg-mint-fresh text-emerald-deep text-label-sm font-label-sm rounded-lg hover:bg-emerald-deep hover:text-white transition-colors">
                              Konfirmasi
                            </button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(settings.bank_bsi || ''); setSelectedMethod('transfer_bsi'); }} className="p-1.5 hover:bg-surface-container rounded-full text-outline-variant hover:text-emerald-deep transition-colors" title="Salin Nomor">
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {settings?.bank_bri && (
                    <div className="w-full flex items-center gap-4 p-4 hover:bg-background text-left transition-colors">
                      <div className="w-12 py-1 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-blue-800">BRI</div>
                      <div className="flex-1">
                        <span className="font-body-md block leading-none">Bank Rakyat Indonesia</span>
                        <span className="font-label-sm text-emerald-deep font-bold mt-1 block tracking-wider">{settings.bank_bri}</span>
                      </div>
                      {amount !== '' && (
                        <div className="flex items-center gap-3">
                          {selectedMethod === 'transfer_bri' ? (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmModal({isOpen: true, method: 'transfer_bri'}); }} className="px-3 py-1 bg-mint-fresh text-emerald-deep text-label-sm font-label-sm rounded-lg hover:bg-emerald-deep hover:text-white transition-colors">
                              Konfirmasi
                            </button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(settings.bank_bri || ''); setSelectedMethod('transfer_bri'); }} className="p-1.5 hover:bg-surface-container rounded-full text-outline-variant hover:text-emerald-deep transition-colors" title="Salin Nomor">
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* E-Wallet */}
            {(settings?.gopay || settings?.ovo) && (
              <div className="bg-surface-white rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-surface-container-highest overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">wallet</span>
                  <span className="font-label-lg">E-Wallet</span>
                </div>
                <div className="divide-y divide-surface-container-highest">
                  {settings?.gopay && (
                    <div className="w-full flex items-center gap-4 p-4 hover:bg-background text-left transition-colors">
                      <div className="w-12 py-1 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-blue-600">GoPay</div>
                      <div className="flex-1">
                        <span className="font-body-md block leading-none">GoPay / GoJek</span>
                        <span className="font-label-sm text-emerald-deep font-bold mt-1 block tracking-wider">{settings.gopay}</span>
                      </div>
                      {amount !== '' && (
                        <div className="flex items-center gap-3">
                          {selectedMethod === 'gopay' ? (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmModal({isOpen: true, method: 'gopay'}); }} className="px-3 py-1 bg-mint-fresh text-emerald-deep text-label-sm font-label-sm rounded-lg hover:bg-emerald-deep hover:text-white transition-colors">
                              Konfirmasi
                            </button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(settings.gopay || ''); setSelectedMethod('gopay'); }} className="p-1.5 hover:bg-surface-container rounded-full text-outline-variant hover:text-emerald-deep transition-colors" title="Salin Nomor">
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {settings?.ovo && (
                    <div className="w-full flex items-center gap-4 p-4 hover:bg-background text-left transition-colors">
                      <div className="w-12 py-1 bg-surface-container-low rounded border border-outline-variant flex items-center justify-center font-bold text-[10px] text-purple-700">OVO</div>
                      <div className="flex-1">
                        <span className="font-body-md block leading-none">OVO</span>
                        <span className="font-label-sm text-emerald-deep font-bold mt-1 block tracking-wider">{settings.ovo}</span>
                      </div>
                      {amount !== '' && (
                        <div className="flex items-center gap-3">
                          {selectedMethod === 'ovo' ? (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmModal({isOpen: true, method: 'ovo'}); }} className="px-3 py-1 bg-mint-fresh text-emerald-deep text-label-sm font-label-sm rounded-lg hover:bg-emerald-deep hover:text-white transition-colors">
                              Konfirmasi
                            </button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(settings.ovo || ''); setSelectedMethod('ovo'); }} className="p-1.5 hover:bg-surface-container rounded-full text-outline-variant hover:text-emerald-deep transition-colors" title="Salin Nomor">
                              <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quran Quote Footer Content */}
        <footer className="mt-stack-lg mb-12 text-center px-4">
          <div className="w-12 h-1 bg-gold-spiritual mx-auto mb-4 rounded-full"></div>
          <p className="font-headline-md text-headline-md text-emerald-deep italic mb-2">"Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai..."</p>
          <p className="font-label-lg text-label-lg text-on-surface-variant">(QS. Al-Baqarah: 261)</p>
        </footer>
      </main>

      {/* QRIS Modal */}
      {showQris && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-4 flex justify-end">
              <button onClick={() => setShowQris(false)} className="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="px-8 pb-8 pt-0 flex flex-col items-center">
              <h3 className="font-headline-md text-emerald-deep mb-2">Scan QRIS</h3>
              <p className="text-body-sm text-center text-on-surface-variant mb-6">Gunakan aplikasi m-Banking atau E-Wallet favorit Anda untuk memindai kode QR di bawah ini.</p>
              
              <div className="w-full bg-white p-4 rounded-xl border-4 border-mint-fresh shadow-inner relative">
                {settings?.qris_url ? (
                  <img src={getImageUrl(settings.qris_url)} alt="QRIS" className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline">qr_code</span>
                  </div>
                )}
                
                {/* Visual Scanner line effect */}
                <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-emerald-deep/50 shadow-[0_0_8px_rgba(6,78,59,0.8)] animate-[scan_2s_ease-in-out_infinite] pointer-events-none"></div>
              </div>
              
              <p className="font-label-lg text-emerald-deep mt-6 tracking-widest bg-mint-fresh/30 px-4 py-2 rounded-full border border-mint-fresh mb-4">A/N: {settings?.mosque_name || 'Masjid'}</p>
              
              {confirmedMethod === 'qris' ? (
                <div className="w-full bg-emerald-deep/10 text-emerald-deep py-3 rounded-xl font-label-lg mt-2 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span> Bukti Terkirim
                </div>
              ) : !confirmedMethod ? (
                <button onClick={() => setConfirmModal({isOpen: true, method: 'qris'})} className="w-full bg-emerald-deep text-white py-3 rounded-xl font-label-lg mt-2 active:scale-95 transition-transform">
                  Saya Sudah Bayar (Konfirmasi)
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-emerald-deep text-white">
              <h3 className="font-headline-md">Konfirmasi Infaq</h3>
              <button onClick={() => setConfirmModal({isOpen: false, method: ''})} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleConfirmSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Donatur</label>
                <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)} placeholder="Opsional (Hamba Allah)" className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Upload Bukti Transfer</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors relative">
                  <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" required />
                  <span className="material-symbols-outlined text-3xl text-emerald-deep/50 mb-2">cloud_upload</span>
                  {proofFile ? (
                    <span className="font-label-sm text-emerald-deep">{proofFile.name}</span>
                  ) : (
                    <span className="font-label-sm text-on-surface-variant">Tap untuk memilih file screenshot</span>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-deep text-white rounded-xl font-label-lg shadow-md active:scale-95 transition-transform disabled:opacity-50">
                  {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
