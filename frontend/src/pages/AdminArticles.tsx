import { useState } from 'react';
import { useArticles, Article } from '../hooks/useArticles';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminArticles() {
  const { articles, isLoading, createArticle, updateArticle, deleteArticle } = useArticles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState({
    type: 'tausiyah',
    title: '',
    content: '',
    author: '',
    publishedAt: new Date().toISOString().slice(0, 16)
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        type: article.type,
        title: article.title,
        content: article.content,
        author: article.author || '',
        publishedAt: new Date(article.publishedAt).toISOString().slice(0, 16)
      });
    } else {
      setEditingArticle(null);
      setFormData({
        type: 'tausiyah',
        title: '',
        content: '',
        author: '',
        publishedAt: new Date().toISOString().slice(0, 16)
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('author', formData.author);
      data.append('publishedAt', new Date(formData.publishedAt).toISOString());
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingArticle) {
        await updateArticle({ id: editingArticle.id, formData: data });
      } else {
        await createArticle(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan artikel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        await deleteArticle(id);
      } catch (error) {
        alert('Gagal menghapus artikel');
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <main className="px-container-margin pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Tausiyah & Pengumuman</h2>
          <p className="text-body-md text-on-surface-variant">Kelola artikel kajian dan pengumuman masjid</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-xl font-label-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="hidden sm:inline">Tambah Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-surface-white border border-outline-variant/30 p-4 rounded-2xl shadow-sm flex gap-4">
            {article.imageUrl ? (
              <img src={`${API_URL}${article.imageUrl}`} alt={article.title} className="w-24 h-24 object-cover rounded-xl" />
            ) : (
              <div className="w-24 h-24 bg-surface-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">article</span>
              </div>
            )}
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-deep bg-mint-fresh px-2 py-1 rounded-full mb-2 inline-block">
                {article.type}
              </span>
              <h3 className="font-title-md text-primary line-clamp-1">{article.title}</h3>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">{article.content}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleOpenModal(article)} className="text-primary hover:bg-primary-container px-3 py-1 rounded-lg text-label-sm font-medium transition-colors">Edit</button>
                <button onClick={() => handleDelete(article.id)} className="text-error hover:bg-error-container px-3 py-1 rounded-lg text-label-sm font-medium transition-colors">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-primary">{editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
              <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Jenis Artikel</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-surface-white"
                >
                  <option value="tausiyah">Tausiyah Terbaru</option>
                  <option value="pengumuman">Pengumuman</option>
                </select>
              </div>

              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Judul</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-surface-white"
                  placeholder="Masukkan judul..."
                />
              </div>

              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Penulis (Opsional)</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-surface-white"
                  placeholder="Misal: Ustadz Bashir"
                />
              </div>

              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Waktu Publikasi</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.publishedAt}
                  onChange={e => setFormData({...formData, publishedAt: e.target.value})}
                  className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-surface-white"
                />
              </div>

              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Konten / Isi Lengkap</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-surface-white"
                  placeholder="Tuliskan isi artikel..."
                ></textarea>
              </div>

              <div>
                <label className="block text-label-sm font-medium text-on-surface-variant mb-1">Gambar (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="w-full border border-outline-variant rounded-xl p-3 text-body-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-label-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
