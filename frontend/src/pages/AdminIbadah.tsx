import { useState } from 'react';
import { useIbadah } from '../hooks/useIbadah';

export default function AdminIbadah() {
  const { ibadahQuery, createIbadahMutation, updateIbadahMutation, deleteIbadahMutation } = useIbadah();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ prayerType: 'shubuh', time: '', imamName: '', muadzinName: '', khatibName: '', bilalName: '' });

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData({
      prayerType: item.prayerType,
      time: new Date(item.time).toISOString().slice(0, 16),
      imamName: item.imamName || '',
      muadzinName: item.muadzinName || '',
      khatibName: item.khatibName || '',
      bilalName: item.bilalName || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ prayerType: 'shubuh', time: '', imamName: '', muadzinName: '', khatibName: '', bilalName: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateIbadahMutation.mutateAsync({ id: editId, data: formData });
      } else {
        await createIbadahMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan jadwal ibadah");
    }
  };
  
  return (
    <main className="pt-20 md:pt-10 pb-24 md:pb-12 px-container-margin max-w-screen-xl mx-auto w-full space-y-stack-lg">
      {/* Action Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-emerald-deep">Manajemen Ibadah &amp; Petugas</h2>
          <p className="text-body-sm text-on-surface-variant">Kelola jadwal shalat harian dan petugas Jumat secara efisien.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-mint-fresh text-emerald-deep px-4 py-2.5 rounded-xl font-label-lg hover:bg-opacity-80 transition-all">
            <span className="material-symbols-outlined">sync</span>
            Update Waktu Otomatis
          </button>
          <button onClick={handleOpenAdd} className="bg-primary-container text-white px-4 py-2.5 rounded-xl font-label-lg hover:opacity-90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Petugas Baru
          </button>
        </div>
      </section>

      {/* Summary & Next Friday Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md">
        {(() => {
          const jumatOfficers = ibadahQuery.data?.find((i: any) => i.prayerType === 'jumat');
          return (
            <div className="md:col-span-2 bg-surface-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">calendar_month</span>
              </div>
              <h3 className="font-headline-md text-emerald-deep mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gold-spiritual fill-icon">star</span>
                Petugas Jumat Pekan Ini
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-label-sm text-on-surface-variant">Khatib</p>
                  <p className="font-label-lg text-text-primary">{jumatOfficers?.khatibName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-label-sm text-on-surface-variant">Imam</p>
                  <p className="font-label-lg text-text-primary">{jumatOfficers?.imamName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-label-sm text-on-surface-variant">Muadzin</p>
                  <p className="font-label-lg text-text-primary">{jumatOfficers?.muadzinName || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-label-sm text-on-surface-variant">Bilal</p>
                  <p className="font-label-lg text-text-primary">{jumatOfficers?.bilalName || '-'}</p>
                </div>
              </div>
              <button onClick={() => {
                if (jumatOfficers) handleEdit(jumatOfficers);
                else {
                  setEditId(null);
                  setFormData({ prayerType: 'jumat', time: '', imamName: '', muadzinName: '', khatibName: '', bilalName: '' });
                  setIsModalOpen(true);
                }
              }} className="mt-6 flex items-center gap-2 text-emerald-deep font-label-lg hover:underline cursor-pointer">
                {jumatOfficers ? 'Edit Jadwal Jumat' : 'Tambah Jadwal Jumat'}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          );
        })()}

        {/* Quick Stats Card */}
        <div className="bg-primary-container text-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-on-primary-container font-label-lg">Waktu Shalat Selanjutnya</p>
            <h2 className="font-display-lg mt-2">Ashar - 15:24</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 text-mint-fresh">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-body-sm">Semua petugas terkonfirmasi</span>
          </div>
        </div>
      </section>

      {/* Daily Prayer Management List */}
      <section className="space-y-gutter-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-headline-md text-text-primary">Jadwal Shalat 5 Waktu</h3>
          <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 gap-4">
            <button className="text-on-surface-variant hover:bg-surface-variant rounded-full flex items-center justify-center w-8 h-8 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            <span className="font-label-lg">Kamis, 24 Okt 2024</span>
            <button className="text-on-surface-variant hover:bg-surface-variant rounded-full flex items-center justify-center w-8 h-8 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ibadahQuery.isLoading ? (
            <p className="text-center text-on-surface-variant py-4">Memuat jadwal...</p>
          ) : ibadahQuery.data?.length === 0 ? (
            <p className="text-center text-on-surface-variant py-4">Belum ada jadwal ibadah.</p>
          ) : (
            ibadahQuery.data?.map((item: any) => {
              const isActive = false; // Could add logic to determine current prayer
              const getIcon = (type: string) => {
                const map: any = { shubuh: 'sunny', zhuhur: 'wb_sunny', ashar: 'wb_twilight', maghrib: 'bedtime', isya: 'nightlight' };
                return map[type.toLowerCase()] || 'schedule';
              };
              
              return (
                <div key={item.id} className={`group ${isActive ? 'bg-mint-fresh/20 border-mint-fresh shadow-md relative overflow-hidden' : 'bg-surface-white hover:bg-mint-fresh/10 border-transparent hover:border-mint-fresh shadow-[0px_2px_8px_rgba(0,0,0,0.02)]'} transition-all rounded-xl p-4 border flex flex-col md:flex-row md:items-center gap-6`}>
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold-spiritual"></div>}
                  <div className="flex items-center gap-4 md:w-48">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-deep text-white' : 'bg-mint-fresh text-emerald-deep'}`}>
                      <span className="material-symbols-outlined">{getIcon(item.prayerType)}</span>
                    </div>
                    <div>
                      <p className="font-headline-md text-text-primary leading-tight capitalize">{item.prayerType}</p>
                      <p className={`text-label-sm ${isActive ? 'text-gold-spiritual font-bold' : 'text-gold-spiritual'}`}>
                        {new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    </div>
                  </div>
                  <div className={`flex-1 grid grid-cols-2 gap-4 border-l-0 md:border-l md:pl-6 ${isActive ? 'border-emerald-deep/20' : 'border-outline-variant/30'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${isActive ? 'text-emerald-deep' : 'text-on-surface-variant'}`}>person</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Imam</p>
                        <p className={`font-body-md text-text-primary ${isActive ? 'font-bold' : ''}`}>{item.imamName || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${isActive ? 'text-emerald-deep' : 'text-on-surface-variant'}`}>volume_up</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Muadzin</p>
                        <p className={`font-body-md text-text-primary ${isActive ? 'font-bold' : ''}`}>{item.muadzinName || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item)} className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-label-lg transition-colors flex items-center justify-center gap-2 ${isActive ? 'bg-emerald-deep text-white hover:bg-primary' : 'border border-outline text-on-surface-variant hover:bg-surface-container'}`}>
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </button>
                    <button onClick={() => deleteIbadahMutation.mutate(item.id)} className="p-2 rounded-lg text-error hover:bg-error-container/50">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Weekly Insight Pattern Card */}
      <section className="bg-surface-container-high rounded-3xl p-8 relative overflow-hidden group border border-outline-variant/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none transition-transform group-hover:scale-105 duration-1000" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #064E3B 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full border-4 border-gold-spiritual p-1 shrink-0">
            <img className="w-full h-full object-cover rounded-full" data-alt="Portrait" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png" />
          </div>
          <div>
            <h4 className="font-headline-md text-emerald-deep">Tips Pekan Ini</h4>
            <p className="text-body-md text-on-surface-variant mt-2 italic">"Penyusunan jadwal imam dan muadzin sebaiknya mempertimbangkan ketersediaan waktu luang petugas dan kedekatan rumah agar pelaksanaan shalat berjamaah tetap konsisten dan tepat waktu."</p>
          </div>
        </div>
      </section>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed right-6 bottom-24 md:hidden">
        <button onClick={handleOpenAdd} className="w-14 h-14 rounded-full bg-gold-spiritual text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">{editId ? 'Edit Petugas' : 'Petugas Baru'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Waktu Shalat</label>
                <select value={formData.prayerType} onChange={e => setFormData({...formData, prayerType: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none">
                  <option value="shubuh">Shubuh</option>
                  <option value="zhuhur">Zhuhur</option>
                  <option value="ashar">Ashar</option>
                  <option value="maghrib">Maghrib</option>
                  <option value="isya">Isya</option>
                  <option value="jumat">Jumat</option>
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Waktu Pelaksanaan</label>
                <input type="datetime-local" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Imam</label>
                <input type="text" value={formData.imamName} onChange={e => setFormData({...formData, imamName: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Muadzin</label>
                <input type="text" value={formData.muadzinName} onChange={e => setFormData({...formData, muadzinName: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              {formData.prayerType === 'jumat' && (
                <>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Nama Khatib</label>
                    <input type="text" value={formData.khatibName} onChange={e => setFormData({...formData, khatibName: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Nama Bilal</label>
                    <input type="text" value={formData.bilalName} onChange={e => setFormData({...formData, bilalName: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-outline-variant/30">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">Batal</button>
                <button type="submit" disabled={createIbadahMutation.isPending || updateIbadahMutation.isPending} className="px-5 py-2.5 rounded-xl font-label-lg bg-emerald-deep text-white hover:opacity-90 transition-opacity">
                  {createIbadahMutation.isPending || updateIbadahMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
