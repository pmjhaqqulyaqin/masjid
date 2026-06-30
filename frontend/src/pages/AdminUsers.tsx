import { useState } from 'react';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<'staff' | 'jamaah'>('staff');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'staff', password: '' });
  
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Ustadz Samsul Bajuri', role: 'Imam Besar', badges: ['Imam Besar', 'Super Admin'], photo: '/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png' },
    { id: 2, name: 'Arifin Zaenal', role: 'Muadzin', badges: ['Muadzin', 'Staff'], photo: '/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_ngaji_1_320x240.webp.png' },
    { id: 3, name: 'Pak Sony Setiawan', role: 'Marbot', badges: ['Marbot'], photo: '/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png' }
  ]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      id: Date.now(),
      name: formData.name,
      role: formData.role === 'finance' ? 'Admin Keuangan' : formData.role === 'content' ? 'Admin Konten' : formData.role === 'superadmin' ? 'Super Admin' : 'Staff',
      badges: [formData.role === 'finance' ? 'Finance' : formData.role === 'superadmin' ? 'Super Admin' : 'Staff'],
      photo: '/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png'
    };
    setStaffList([newStaff, ...staffList]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', role: 'staff', password: '' });
  };

  return (
    <main className="pt-4 pb-4 md:pb-12 md:pt-10 px-container-margin max-w-screen-md mx-auto w-full">
      {/* Stats Row */}
      <section className="grid grid-cols-3 gap-3 mb-stack-lg">
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">Total Users</span>
          <span className="text-headline-md text-emerald-deep font-bold">1,284</span>
        </div>
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">Active Staff</span>
          <span className="text-headline-md text-emerald-deep font-bold">24</span>
        </div>
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">New (Mo)</span>
          <span className="text-headline-md text-emerald-deep font-bold">+52</span>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mb-stack-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-12 pr-4 py-3 bg-surface-white border-none rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] focus:ring-2 focus:ring-emerald-deep transition-all outline-none placeholder:text-outline-variant" placeholder="Search users or staff..." type="text" />
        </div>
      </section>
      
      <section className="mb-stack-md flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        <button className="px-4 py-1.5 rounded-full bg-emerald-deep text-white text-label-sm font-semibold whitespace-nowrap">All</button>
        <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-semibold whitespace-nowrap hover:bg-mint-fresh transition-colors">Verified</button>
        <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-semibold whitespace-nowrap hover:bg-mint-fresh transition-colors">Pending</button>
        <button className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-label-sm font-semibold whitespace-nowrap hover:bg-mint-fresh transition-colors">Banned</button>
      </section>

      {/* Tab Navigation */}
      <section className="mb-stack-md">
        <div className="flex p-1 bg-surface-container-high rounded-xl relative">
          <button 
            className={`flex-1 py-2.5 z-10 text-label-lg transition-colors font-semibold ${activeTab === 'staff' ? 'text-emerald-deep' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('staff')}
          >
            Staff
          </button>
          <button 
            className={`flex-1 py-2.5 z-10 text-label-lg transition-colors font-semibold ${activeTab === 'jamaah' ? 'text-emerald-deep' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('jamaah')}
          >
            Jamaah
          </button>
          <div 
            className="absolute top-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-surface-white rounded-lg shadow-sm transition-all duration-300" 
            style={{ left: activeTab === 'staff' ? '4px' : 'calc(50%)' }}
          ></div>
        </div>
      </section>

      {/* Action Button */}
      <section className={`mb-stack-md flex flex-col md:flex-row justify-between items-center gap-4 transition-opacity ${activeTab === 'staff' ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`}>
        <h2 className="font-headline-md text-on-surface font-semibold text-center md:text-left">Manajemen Pengguna &amp; Staf</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-deep text-white px-4 py-2 rounded-lg text-label-lg flex items-center gap-2 active:scale-95 transition-transform w-full md:w-auto justify-center">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Tambah Staf Baru
        </button>
      </section>

      {/* Staff List */}
      {activeTab === 'staff' && (
        <section className="flex flex-col gap-4">
          {staffList.map((staff) => (
            <div key={staff.id} className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between group cursor-pointer hover:border-mint-fresh border border-transparent transition-all" onClick={() => setSelectedUser(staff)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                  <img className="w-full h-full object-cover" data-alt="Portrait" src={staff.photo} />
                </div>
                <div>
                  <h3 className="font-body-md text-emerald-deep font-bold line-clamp-1">{staff.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {staff.badges.map((badge, idx) => (
                      <span key={idx} className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded ${idx === 0 ? 'bg-mint-fresh text-emerald-deep' : 'bg-surface-container-high text-on-surface-variant'}`}>{badge}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a className="w-10 h-10 rounded-full hidden sm:flex items-center justify-center bg-surface-container-low text-emerald-deep hover:bg-emerald-deep hover:text-white transition-all flex-shrink-0" href="#" onClick={e => e.stopPropagation()}>
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </a>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Jamaah List */}
      {activeTab === 'jamaah' && (
        <section className="flex flex-col gap-4">
          <div className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between group cursor-pointer border border-transparent transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold flex-shrink-0">RM</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-body-md text-on-surface font-semibold line-clamp-1">Rizwan Maulana</h3>
                  <span className="px-2 py-0.5 bg-mint-fresh text-on-primary-fixed-variant text-[10px] uppercase tracking-wider font-bold rounded">Active</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-label-sm text-on-surface-variant">Jamaah</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="text-label-sm text-on-surface-variant hidden sm:inline">Joined: 12 May 2024</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">more_vert</span>
          </div>

          <div className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between group cursor-pointer border border-transparent transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold flex-shrink-0">SN</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-body-md text-on-surface font-semibold line-clamp-1">Siti Nurhaliza</h3>
                  <span className="px-2 py-0.5 bg-mint-fresh text-on-primary-fixed-variant text-[10px] uppercase tracking-wider font-bold rounded">Verified</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-label-sm text-on-surface-variant">Jamaah</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="text-label-sm text-on-surface-variant hidden sm:inline">Joined: 08 May 2024</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline">more_vert</span>
          </div>
        </section>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full sm:max-w-md bg-surface sm:rounded-[32px] rounded-t-[32px] p-container-margin shadow-2xl border-t border-emerald-deep/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-high overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" data-alt="Portrait" src="/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2026_02_takmir.webp.png" />
              </div>
              <div>
                <h2 className="font-headline-lg-mobile text-emerald-deep line-clamp-2">{selectedUser.name}</h2>
                <p className="text-body-md text-on-surface-variant">{selectedUser.role}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="bg-surface-white p-4 rounded-2xl border border-emerald-deep/5">
                <span className="text-label-sm text-outline block mb-2">Permissions &amp; Access</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-mint-fresh text-on-primary-fixed-variant px-3 py-1 rounded-full text-label-sm">Full Admin</span>
                  <span className="bg-mint-fresh text-on-primary-fixed-variant px-3 py-1 rounded-full text-label-sm">Financial Viewer</span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-sm">Content Editor</span>
                </div>
              </div>
              <div className="bg-surface-white p-4 rounded-2xl border border-emerald-deep/5">
                <span className="text-label-sm text-outline block mb-2">Contact Info</span>
                <p className="font-body-md text-on-surface">contact@masjid.id</p>
                <p className="font-body-md text-on-surface">+62 812-3456-7890</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3.5 bg-surface-container-high text-on-surface-variant font-bold rounded-2xl active:scale-95 transition-all">Edit Profile</button>
              <button className="py-3.5 bg-emerald-deep text-white font-bold rounded-2xl active:scale-95 transition-all">Update Access</button>
            </div>
            <div className="pb-10 pt-4">
              <button className="w-full text-error font-bold py-2">Revoke Staff Access</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">Tambah Staf Baru</h3>
              <p className="text-white/80 text-sm">Berikan akses ke dashboard manajemen</p>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="Masukkan nama..." />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Email / Kontak</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="email@masjid.id" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Role / Peran</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none">
                  <option value="staff">Staff Biasa</option>
                  <option value="finance">Admin Keuangan</option>
                  <option value="content">Admin Konten</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Password Sementara</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="Minimal 8 karakter..." minLength={8} />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-outline-variant/30">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-label-lg bg-emerald-deep text-white hover:opacity-90 transition-opacity">
                  Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
