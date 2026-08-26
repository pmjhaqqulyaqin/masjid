import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState<'staff' | 'jamaah'>('staff');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', username: '', role: 'staff', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError('Gagal memuat data pengguna');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-clear success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => { setSuccess(''); setError(''); }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const staffUsers = users.filter(u => u.role === 'admin' || u.role === 'staff');
  const jamaahUsers = users.filter(u => u.role === 'jamaah');

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: result });
    setShowPassword(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/users/create', {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });
      setSuccess(`User "${formData.name}" berhasil dibuat dengan username: ${formData.username}`);
      setIsAddModalOpen(false);
      setFormData({ name: '', username: '', role: 'staff', password: '' });
      setShowPassword(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat user');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setSuccess(`User "${userToDelete.name}" berhasil dihapus`);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menghapus user');
      setIsDeleteConfirmOpen(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return { label: 'Admin', className: 'bg-emerald-deep text-white' };
      case 'staff': return { label: 'Staff', className: 'bg-mint-fresh text-emerald-deep' };
      case 'jamaah': return { label: 'Jamaah', className: 'bg-surface-container-high text-on-surface-variant' };
      default: return { label: role, className: 'bg-surface-container-high text-on-surface-variant' };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <main className="pt-4 pb-4 md:pb-12 md:pt-10 px-container-margin max-w-screen-md mx-auto w-full">
      {/* Toast Messages */}
      {(success || error) && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm w-full mx-4 flex items-center gap-2 ${success ? 'bg-mint-fresh text-emerald-deep' : 'bg-error-container text-on-error-container'}`}>
          <span className="material-symbols-outlined text-lg">{success ? 'check_circle' : 'error'}</span>
          {success || error}
        </div>
      )}

      {/* Stats Row */}
      <section className="grid grid-cols-3 gap-3 mb-stack-lg">
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">Total Users</span>
          <span className="text-headline-md text-emerald-deep font-bold">{users.length}</span>
        </div>
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">Staff/Admin</span>
          <span className="text-headline-md text-emerald-deep font-bold">{staffUsers.length}</span>
        </div>
        <div className="bg-surface-white p-3 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex flex-col gap-1 border border-emerald-deep/5">
          <span className="text-label-sm text-on-surface-variant">Jamaah</span>
          <span className="text-headline-md text-emerald-deep font-bold">{jamaahUsers.length}</span>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="mb-stack-md">
        <div className="flex p-1 bg-surface-container-high rounded-xl relative">
          <button 
            className={`flex-1 py-2.5 z-10 text-label-lg transition-colors font-semibold ${activeTab === 'staff' ? 'text-emerald-deep' : 'text-on-surface-variant'}`}
            onClick={() => setActiveTab('staff')}
          >
            Staff & Admin
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
      <section className="mb-stack-md flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="font-headline-md text-on-surface font-semibold text-center md:text-left">
          Manajemen Pengguna
        </h2>
        <button onClick={() => { setFormData({ name: '', username: '', role: 'staff', password: '' }); setShowPassword(false); setIsAddModalOpen(true); }} className="bg-emerald-deep text-white px-4 py-2 rounded-lg text-label-lg flex items-center gap-2 active:scale-95 transition-transform w-full md:w-auto justify-center">
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Tambah User Baru
        </button>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 border-3 border-emerald-deep/20 border-t-emerald-deep rounded-full animate-spin"></span>
        </div>
      )}

      {/* Staff/Admin List */}
      {!isLoading && activeTab === 'staff' && (
        <section className="flex flex-col gap-4">
          {staffUsers.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 block">group_off</span>
              <p>Belum ada staff/admin</p>
            </div>
          ) : staffUsers.map((user) => {
            const badge = getRoleBadge(user.role);
            return (
              <div key={user.id} className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between group cursor-pointer hover:border-mint-fresh border border-transparent transition-all" onClick={() => setSelectedUser(user)}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold flex-shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h3 className="font-body-md text-emerald-deep font-bold line-clamp-1">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded ${badge.className}`}>{badge.label}</span>
                      <span className="text-[10px] text-on-surface-variant">{user.email}</span>
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-emerald-deep transition-colors">chevron_right</span>
              </div>
            );
          })}
        </section>
      )}

      {/* Jamaah List */}
      {!isLoading && activeTab === 'jamaah' && (
        <section className="flex flex-col gap-4">
          {jamaahUsers.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 block">group_off</span>
              <p>Belum ada jamaah terdaftar</p>
            </div>
          ) : jamaahUsers.map((user) => (
            <div key={user.id} className="bg-surface-white p-4 rounded-xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center justify-between group cursor-pointer border border-transparent transition-all" onClick={() => setSelectedUser(user)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold flex-shrink-0">{getInitials(user.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-body-md text-on-surface font-semibold line-clamp-1">{user.name}</h3>
                    <span className="px-2 py-0.5 bg-mint-fresh text-on-primary-fixed-variant text-[10px] uppercase tracking-wider font-bold rounded">Jamaah</span>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">{user.email}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
          ))}
        </section>
      )}

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full sm:max-w-md bg-surface sm:rounded-[32px] rounded-t-[32px] p-container-margin shadow-2xl border-t border-emerald-deep/10 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-2xl flex-shrink-0">
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h2 className="font-headline-lg-mobile text-emerald-deep line-clamp-2">{selectedUser.name}</h2>
                <p className="text-body-md text-on-surface-variant capitalize">{selectedUser.role}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="bg-surface-white p-4 rounded-2xl border border-emerald-deep/5">
                <span className="text-label-sm text-outline block mb-2">Informasi Akun</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
                    <span className="font-body-md text-on-surface">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">badge</span>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded ${getRoleBadge(selectedUser.role).className}`}>
                      {getRoleBadge(selectedUser.role).label}
                    </span>
                  </div>
                  {selectedUser.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
                      <span className="font-body-md text-on-surface">
                        Dibuat: {new Date(selectedUser.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pb-10 pt-4">
              <button
                onClick={() => { setUserToDelete(selectedUser); setIsDeleteConfirmOpen(true); }}
                className="w-full text-error font-bold py-2 hover:bg-error-container/30 rounded-xl transition-colors"
              >
                Hapus User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative bg-surface-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-error-container rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
              </div>
              <h3 className="font-headline-md text-on-surface mb-1">Hapus User?</h3>
              <p className="text-on-surface-variant text-sm">
                Anda yakin ingin menghapus <strong>{userToDelete.name}</strong>? Tindakan ini tidak bisa dibatalkan.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-error text-white font-bold rounded-xl active:scale-95 transition-all">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">Tambah User Baru</h3>
              <p className="text-white/80 text-sm">Buat akun baru dengan username dan password</p>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Lengkap</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="Masukkan nama..." />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Username</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="contoh: staf.ahmad" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Role / Peran</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none">
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="jamaah">Jamaah</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-label-sm text-on-surface-variant">Password</label>
                  <button type="button" onClick={generatePassword} className="text-[11px] text-emerald-deep font-semibold hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full border border-outline-variant rounded-xl p-3 pr-10 focus:ring-2 focus:ring-emerald-deep outline-none"
                    placeholder="Minimal 8 karakter..."
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-emerald-deep transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
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
