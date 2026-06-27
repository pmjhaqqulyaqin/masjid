import { useState } from 'react';
import { useDonations } from '../hooks/useDonations';

export default function AdminDonations() {
  const { donationsQuery, summaryQuery, createDonationMutation } = useDonations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ donorName: '', amount: '', donationType: 'infaq', paymentMethod: 'cash' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDonationMutation.mutateAsync({
        userId: null,
        donorName: formData.donorName || 'Hamba Allah',
        type: formData.donationType,
        amount: Number(formData.amount.replace(/\D/g, '')),
        paymentMethod: formData.paymentMethod,
        status: 'completed'
      });
      setIsModalOpen(false);
      setFormData({ donorName: '', amount: '', donationType: 'infaq', paymentMethod: 'cash' });
    } catch (err) {
      alert("Gagal menyimpan donasi");
    }
  };
  
  return (
    <main className="pt-20 md:pt-10 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <section className="px-container-margin flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md-mobile text-emerald-deep">Donation Management</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-deep text-on-primary font-label-lg text-label-lg px-4 py-2 rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Manual Entry</span>
        </button>
      </section>

      {/* Marquee Announcement */}
      <div className="bg-emerald-deep text-white py-1 px-4 text-label-sm overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_25s_linear_infinite]">
          Update: Total Infaq Renovasi Masjid minggu ini mencapai 75% dari target • Jazakumullah Khairan Katsiran kepada seluruh donatur • Perhatian: Batas akhir zakat maal periode Syawal tinggal 3 hari lagi.
        </div>
      </div>

      <div className="p-container-margin space-y-stack-lg mt-6">
        {/* Statistics Overview (Bento Grid Style) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
          <div className="bg-surface-white p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh transition-transform hover:-translate-y-1">
            <div className="z-10">
              <p className="text-on-surface-variant text-label-sm uppercase tracking-wide">Total Dana Terkumpul (Infaq)</p>
              <h4 className="font-prayer-time-display text-emerald-deep">
                Rp {summaryQuery.data?.totalInfaq ? parseInt(summaryQuery.data.totalInfaq).toLocaleString('id-ID') : '0'}
              </h4>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-emerald-deep/5 select-none">payments</span>
          </div>

          <div className="bg-surface-white p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh border-l-4 border-l-gold-spiritual transition-transform hover:-translate-y-1">
            <div className="z-10">
              <p className="text-on-surface-variant text-label-sm uppercase tracking-wide">Menunggu Verifikasi</p>
              <h4 className="font-prayer-time-display text-gold-spiritual">14 Transaksi</h4>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-gold-spiritual/5 select-none">pending_actions</span>
          </div>

          <div className="bg-surface-white p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh transition-transform hover:-translate-y-1">
            <div className="z-10">
              <p className="text-on-surface-variant text-label-sm uppercase tracking-wide">Donatur Baru (Bulan Ini)</p>
              <h4 className="font-prayer-time-display text-emerald-deep">128 Orang</h4>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-emerald-deep/5 select-none">diversity_1</span>
          </div>
        </section>

        {/* Filters Section */}
        <section className="flex flex-col md:flex-row gap-gutter-md items-center justify-between">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="px-5 py-2 rounded-full bg-emerald-deep text-white font-label-sm text-label-sm whitespace-nowrap">All Donations</button>
            <button className="px-5 py-2 rounded-full bg-mint-fresh text-emerald-deep font-label-sm text-label-sm border border-emerald-deep/10 whitespace-nowrap hover:bg-emerald-deep/5 transition-colors">Success</button>
            <button className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30 whitespace-nowrap hover:bg-surface-variant transition-colors">Pending</button>
            <button className="px-5 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30 whitespace-nowrap hover:bg-surface-variant transition-colors">Failed</button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border border-outline-variant/50 focus:ring-emerald-deep focus:border-emerald-deep font-label-sm text-label-sm outline-none" placeholder="Search donor name..." type="text" />
            </div>
            <select className="bg-surface rounded-xl border border-outline-variant/50 px-4 py-2 font-label-sm text-label-sm focus:ring-emerald-deep focus:border-emerald-deep outline-none">
              <option>All Types</option>
              <option>Zakat</option>
              <option>Infaq</option>
              <option>Wakaf</option>
            </select>
          </div>
        </section>

        {/* Table/List Section */}
        <section className="bg-surface-white shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider font-label-sm text-label-sm">
                  <th className="px-6 py-4 font-semibold">Donor Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Method</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {donationsQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Memuat data donasi...</td>
                  </tr>
                ) : donationsQuery.data?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">Belum ada data donasi.</td>
                  </tr>
                ) : (
                  donationsQuery.data?.map((item: any, index: number) => {
                    // Extract initial for avatar
                    const name = item.userId ? 'User ID ' + item.userId.substring(0,4) : (item.donorName || 'Hamba Allah');
                    const initials = item.userId ? item.userId.substring(0,2).toUpperCase() : (item.donorName ? item.donorName.substring(0,2).toUpperCase() : 'HA');
                    
                    return (
                      <tr key={item.id} className="hover:bg-mint-fresh/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index % 2 === 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-amber-soft text-gold-spiritual'}`}>
                              {initials}
                            </div>
                            <div>
                              <p className="font-label-lg text-emerald-deep">{name}</p>
                              <p className="text-on-surface-variant text-label-sm">
                                {new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-label-sm text-on-surface-variant capitalize">{item.type}</td>
                        <td className="px-6 py-4 font-label-lg">Rp {parseInt(item.amount).toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm capitalize">
                            <span className="material-symbols-outlined text-[18px]">
                              {item.paymentMethod === 'qris' ? 'qr_code_2' : 'account_balance'}
                            </span>
                            <span>{item.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {item.status === 'success' ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-deep/10 text-emerald-deep font-label-sm flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-deep"></span> Success
                            </span>
                          ) : item.status === 'pending' ? (
                            <span className="px-3 py-1 rounded-full bg-gold-spiritual/10 text-gold-spiritual font-label-sm flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold-spiritual"></span> Pending
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-error/10 text-error font-label-sm flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined text-on-surface-variant">more_vert</span></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between">
            <p className="text-on-surface-variant text-label-sm">Showing 1-10 of 254 donations</p>
            <div className="flex gap-2">
              <button className="p-2 border border-outline-variant/50 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-deep text-white font-label-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant font-label-sm">2</button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant font-label-sm">3</button>
              <button className="p-2 border border-outline-variant/50 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Activity Trends */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md">
          <div className="bg-surface-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh">
            <h5 className="font-label-lg text-emerald-deep mb-4 uppercase tracking-wider">Metode Pembayaran Terpopuler</h5>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span>BSI Mobile / Transfer</span>
                  <span>45%</span>
                </div>
                <div className="h-2 w-full bg-mint-fresh rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-deep" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span>QRIS GPN</span>
                  <span>30%</span>
                </div>
                <div className="h-2 w-full bg-mint-fresh rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-deep" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-label-sm mb-1">
                  <span>Cash / Kotak Amal</span>
                  <span>25%</span>
                </div>
                <div className="h-2 w-full bg-mint-fresh rounded-full overflow-hidden">
                  <div className="h-full bg-gold-spiritual" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('/gambar/pos_tausiyah.webp.png')" }}></div>
            <div className="absolute inset-0 bg-emerald-deep/60 backdrop-blur-[2px]"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
              <p className="font-label-sm uppercase tracking-widest opacity-80">Report Generation</p>
              <h4 className="font-headline-md mb-4">Export Financial Summary</h4>
              <button className="bg-white text-emerald-deep font-label-lg px-6 py-3 rounded-xl w-fit shadow-lg active:scale-95 transition-transform">Download CSV / PDF</button>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">Tambah Donasi Manual</h3>
              <p className="text-body-sm opacity-80 mt-1">Masukkan data infaq/sedekah</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Donatur</label>
                <input type="text" value={formData.donorName} onChange={e => setFormData({...formData, donorName: e.target.value})} placeholder="Kosongkan untuk Hamba Allah" className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Jumlah (Rp)</label>
                <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Contoh: 50000" className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Tipe</label>
                  <select value={formData.donationType} onChange={e => setFormData({...formData, donationType: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none">
                    <option value="infaq">Infaq</option>
                    <option value="zakat">Zakat</option>
                    <option value="wakaf">Wakaf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Metode</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none">
                    <option value="cash">Cash / Kotak</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">Batal</button>
                <button type="submit" disabled={createDonationMutation.isPending} className="px-5 py-2.5 rounded-xl font-label-lg bg-emerald-deep text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                  {createDonationMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
