import { useState } from 'react';
import { useServices } from '../hooks/useServices';

export default function AdminServices() {
  const { servicesQuery, updateStatusMutation } = useServices();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleOpenDetail = (item: any) => {
    setSelectedRequest(item);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
    setSelectedRequest(null);
  };

  return (
    <main className="pt-4 pb-4 md:pb-12 md:pt-10 px-container-margin max-w-screen-md mx-auto w-full">
      {/* Welcome Section */}
      <section className="mb-stack-lg">
        <h2 className="font-headline-lg-mobile text-emerald-deep mb-1">Service Requests</h2>
        <p className="font-body-sm text-on-surface-variant">Review and manage community service applications.</p>
      </section>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-stack-md">
        <div className="relative flex-grow">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input className="w-full pl-10 pr-4 py-3 bg-surface-white shadow-sm border-none rounded-xl focus:ring-2 focus:ring-emerald-deep/20 text-body-sm outline-none" placeholder="Cari permohonan..." type="text" />
        </div>
        <button className="p-3 bg-surface-white shadow-sm rounded-xl text-emerald-deep hover:bg-mint-fresh transition-colors">
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>

      {/* Request Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 mb-stack-md hide-scrollbar">
        <button className="px-5 py-2 rounded-full bg-emerald-deep text-white font-label-sm whitespace-nowrap">Semua</button>
        <button className="px-5 py-2 rounded-full bg-surface-white shadow-sm text-on-surface-variant font-label-sm whitespace-nowrap hover:bg-surface-container">Mualaf</button>
        <button className="px-5 py-2 rounded-full bg-surface-white shadow-sm text-on-surface-variant font-label-sm whitespace-nowrap hover:bg-surface-container">Jenazah</button>
        <button className="px-5 py-2 rounded-full bg-surface-white shadow-sm text-on-surface-variant font-label-sm whitespace-nowrap hover:bg-surface-container">Fasilitas</button>
      </div>

      {/* Service Request List */}
      <div className="space-y-gutter-md">
        {servicesQuery.isLoading ? (
          <p className="text-center text-on-surface-variant py-4">Memuat data layanan...</p>
        ) : servicesQuery.data?.length === 0 ? (
          <p className="text-center text-on-surface-variant py-4">Belum ada permohonan layanan.</p>
        ) : (
          servicesQuery.data?.map((item: any) => (
            <div 
              key={item.id}
              className="p-4 bg-surface-white rounded-2xl shadow-[0_4px_20px_rgba(6,78,59,0.05)] flex items-center gap-4 cursor-pointer hover:scale-[0.98] transition-transform active:scale-95 border border-transparent hover:border-mint-fresh"
              onClick={() => handleOpenDetail(item)}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.serviceType === 'mualaf' ? 'bg-mint-fresh text-emerald-deep' : item.serviceType === 'jenazah' ? 'bg-secondary-container text-on-secondary-fixed-variant' : 'bg-amber-soft/30 text-gold-spiritual'}`}>
                <span className="material-symbols-outlined">
                  {item.serviceType === 'mualaf' ? 'person_add' : item.serviceType === 'jenazah' ? 'church' : 'meeting_room'}
                </span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-label-lg text-emerald-deep capitalize">{item.serviceType}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.status === 'pending' ? 'bg-[#FEF3C7] text-[#92400E]' : item.status === 'approved' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="font-body-sm font-semibold text-on-surface">{item.formData?.name || 'User ' + item.userId}</p>
                <p className="font-label-sm text-outline">{new Date(item.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Bottom Sheet (Modal Simulation) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseDetail}></div>
          <div className="relative w-full max-w-xl bg-surface-white z-[110] sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1 bg-outline-variant mx-auto rounded-full mb-6 sm:hidden"></div>
            
            <div className="flex items-start justify-between mb-stack-md">
              <div>
                <span className="font-label-sm text-emerald-deep bg-mint-fresh px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">Layanan {selectedRequest.serviceType}</span>
                <h3 className="font-headline-lg-mobile text-on-surface">{selectedRequest.formData?.name || 'User ' + selectedRequest.userId}</h3>
                <p className="font-label-sm text-outline">Diajukan pada {new Date(selectedRequest.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-3xl text-emerald-deep">person_add</span>
              </div>
            </div>

            <div className="space-y-4 mb-stack-lg">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider mb-1">Detail Permohonan</p>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  {selectedRequest.formData?.notes || 'Tidak ada catatan tambahan.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                className="py-4 border border-error text-error font-label-lg rounded-2xl active:scale-95 transition-transform" 
                onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                disabled={updateStatusMutation.isPending}
              >
                Reject Request
              </button>
              <button 
                className="py-4 bg-emerald-deep text-white font-label-lg rounded-2xl shadow-lg active:scale-95 transition-transform" 
                onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                disabled={updateStatusMutation.isPending}
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
