import { useState } from 'react';
import { useKajian } from '../hooks/useKajian';

export default function AdminKajian() {
  const { kajianQuery, createKajianMutation, updateKajianMutation, deleteKajianMutation } = useKajian();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', ustadzName: '', description: '', scheduledAt: '', liveStreamUrl: '' });

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData({
      title: item.title,
      ustadzName: item.ustadzName,
      description: item.description || '',
      scheduledAt: new Date(item.scheduledAt).toISOString().slice(0, 16),
      liveStreamUrl: item.liveStreamUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ title: '', ustadzName: '', description: '', scheduledAt: '', liveStreamUrl: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateKajianMutation.mutateAsync({ id: editId, data: formData });
      } else {
        await createKajianMutation.mutateAsync(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan kajian");
    }
  };
  
  return (
    <main className="pt-4 md:pt-10 pb-4 md:pb-12 max-w-7xl mx-auto w-full">
      <section className="px-container-margin mb-stack-lg">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md-mobile text-emerald-deep">Manajemen Kajian</h2>
          <button className="p-2 bg-mint-fresh rounded-xl text-emerald-deep hover:bg-emerald-deep hover:text-white transition-all duration-300">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        
        <div className="relative mb-stack-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-12 pr-4 py-3 bg-surface-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-deep transition-all placeholder:text-outline-variant font-body-md text-body-md outline-none" placeholder="Cari judul kajian atau ustadz..." type="text" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-4 py-2 bg-emerald-deep text-white rounded-full font-label-lg whitespace-nowrap">Semua</button>
          <button className="px-4 py-2 bg-surface-white border border-outline-variant text-on-surface-variant rounded-full font-label-lg whitespace-nowrap hover:bg-surface-container">Fiqh</button>
          <button className="px-4 py-2 bg-surface-white border border-outline-variant text-on-surface-variant rounded-full font-label-lg whitespace-nowrap hover:bg-surface-container">Akidah</button>
          <button className="px-4 py-2 bg-surface-white border border-outline-variant text-on-surface-variant rounded-full font-label-lg whitespace-nowrap hover:bg-surface-container">Tahsin</button>
          <button className="px-4 py-2 bg-surface-white border border-outline-variant text-on-surface-variant rounded-full font-label-lg whitespace-nowrap hover:bg-surface-container">Sejarah</button>
        </div>
      </section>

      <section className="px-container-margin space-y-stack-md mb-stack-lg">
        {kajianQuery.isLoading ? (
          <p className="text-center text-on-surface-variant">Memuat data...</p>
        ) : kajianQuery.data?.length === 0 ? (
          <p className="text-center text-on-surface-variant">Belum ada kajian terjadwal.</p>
        ) : (
          kajianQuery.data?.map((item: any) => (
            <div key={item.id} className="bg-surface-white rounded-3xl p-4 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-transparent hover:border-mint-fresh transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${item.liveStreamUrl ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                  {item.liveStreamUrl ? (
                    <span className="flex items-center gap-1 animate-pulse"><span className="w-1.5 h-1.5 bg-error rounded-full"></span> LIVE</span>
                  ) : 'UPCOMING'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 hover:bg-mint-fresh rounded-lg transition-colors"><span className="material-symbols-outlined text-outline text-[20px]">edit</span></button>
                  <button onClick={() => deleteKajianMutation.mutate(item.id)} className="p-2 hover:bg-error-container/50 rounded-lg transition-colors"><span className="material-symbols-outlined text-error text-[20px]">delete</span></button>
                </div>
              </div>
              <h3 className="font-headline-md text-emerald-deep mb-1">{item.title}</h3>
              <p className="font-body-md text-on-surface-variant mb-4">{item.ustadzName}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-outline">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span className="text-label-sm font-label-sm">{new Date(item.scheduledAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                {item.liveStreamUrl && (
                  <div className="flex items-center gap-2 text-primary-container">
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    <a className="text-label-sm font-label-sm underline decoration-emerald-deep" href={item.liveStreamUrl} target="_blank" rel="noreferrer">Link Zoom/YouTube</a>
                  </div>
                )}
              </div>
              <button className="w-full py-3 border border-outline-variant text-emerald-deep rounded-2xl font-label-lg flex items-center justify-center gap-2 hover:bg-mint-fresh/20 transition-colors shadow-sm">
                <span className="material-symbols-outlined">share</span> Bagikan Jadwal
              </button>
            </div>
          ))
        )}
      </section>

      <section className="px-container-margin mb-stack-lg">
        <h2 className="font-headline-md text-emerald-deep mb-stack-md">Tausiyah Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tausiyah 1 */}
          <div className="bg-surface-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex group">
            <div className="w-32 h-32 flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_ngaji_1_320x240.webp.png')" }}></div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h4 className="font-label-lg text-emerald-deep line-clamp-2 mb-1">Pentingnya Menjaga Ukhuwah di Era Digital</h4>
                <p className="text-[10px] text-outline uppercase tracking-wider font-semibold">12 Okt 2023 • Akidah</p>
              </div>
              <div className="flex justify-end gap-3">
                <button className="text-outline hover:text-emerald-deep transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                <button className="text-error hover:text-red-700 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
              </div>
            </div>
          </div>
          
          {/* Tausiyah 2 */}
          <div className="bg-surface-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex group">
            <div className="w-32 h-32 flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: "url('/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_tausiyah_1_320x240.webp.png')" }}></div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h4 className="font-label-lg text-emerald-deep line-clamp-2 mb-1">Membangun Keluarga Sakinah dengan Komunikasi</h4>
                <p className="text-[10px] text-outline uppercase tracking-wider font-semibold">10 Okt 2023 • Keluarga</p>
              </div>
              <div className="flex justify-end gap-3">
                <button className="text-outline hover:text-emerald-deep transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                <button className="text-error hover:text-red-700 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Adding Kajian */}
      <button onClick={handleOpenAdd} className="fixed bottom-24 md:bottom-12 right-6 w-16 h-16 bg-gold-spiritual rounded-2xl shadow-lg shadow-gold-spiritual/20 flex items-center justify-center text-white active:scale-90 transition-all duration-200 z-40 group">
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
        <div className="absolute right-20 bg-emerald-deep text-white px-4 py-2 rounded-xl text-label-sm font-label-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md hidden md:block">
            Tambah Kajian Baru
        </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">{editId ? 'Edit Kajian' : 'Tambah Kajian'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Judul Kajian</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Ustadz</label>
                <input type="text" required value={formData.ustadzName} onChange={e => setFormData({...formData, ustadzName: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Waktu Pelaksanaan</label>
                <input type="datetime-local" required value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Link Live Stream (Opsional)</label>
                <input type="url" value={formData.liveStreamUrl} onChange={e => setFormData({...formData, liveStreamUrl: e.target.value})} placeholder="https://youtube.com/..." className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Deskripsi</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">Batal</button>
                <button type="submit" disabled={createKajianMutation.isPending || updateKajianMutation.isPending} className="px-5 py-2.5 rounded-xl font-label-lg bg-emerald-deep text-white hover:opacity-90 transition-opacity">
                  {createKajianMutation.isPending || updateKajianMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
