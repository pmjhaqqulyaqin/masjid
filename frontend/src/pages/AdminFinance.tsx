import { useState } from 'react';
import { useFinance } from '../hooks/useFinance';

export default function AdminFinance() {
  const { financeQuery, summaryQuery, createFinanceMutation } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('operational');
  const [description, setDescription] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFinanceMutation.mutateAsync({
        type: transactionType,
        amount: amount,
        category: category,
        description: description
      });
      setIsModalOpen(false);
      setAmount('');
      setDescription('');
    } catch (error: any) {
      console.error(error);
      alert('Gagal menyimpan: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <main className="pt-4 md:pt-10 pb-4 md:pb-12 max-w-screen-xl mx-auto w-full">
      {/* Marquee Announcement */}
      <div className="bg-emerald-deep text-white py-1.5 overflow-hidden w-full mb-6 relative">
        <div className="inline-block animate-[marquee_20s_linear_infinite] font-label-sm whitespace-nowrap px-4">
          Laporan Keuangan Terupdate: Saldo Kas Masjid Per 24 Mei 2024 • Target Renovasi Tahap II: 75% Tercapai • Jazakumullah Khairan Katsiran kepada seluruh jamaah.
        </div>
      </div>

      <div className="px-container-margin">
        {/* Summary Dashboard Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md mb-stack-lg">
          {/* Total Balance Card */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border-l-4 border-gold-spiritual relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
            </div>
            <p className="font-label-lg text-on-surface-variant mb-2">Total Balance</p>
            <h2 className="font-display-lg text-emerald-deep">
              Rp {summaryQuery.data?.balance ? summaryQuery.data.balance.toLocaleString('id-ID') : '0'}
            </h2>
            <div className="mt-4 flex items-center text-emerald-600 gap-1 font-label-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12.5% vs last month</span>
            </div>
          </div>
          
          {/* Operational Card */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border-l-4 border-mint-fresh">
            <p className="font-label-lg text-on-surface-variant mb-2">Operational Fund</p>
            <h3 className="font-headline-lg text-on-surface">Rp 42.120.000</h3>
            <div className="w-full bg-mint-fresh h-1.5 rounded-full mt-4">
              <div className="bg-emerald-deep h-full rounded-full w-[65%]"></div>
            </div>
            <p className="text-xs mt-2 text-on-surface-variant italic">Allocated for utility &amp; staff</p>
          </div>
          
          {/* Construction Card */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border-l-4 border-amber-soft">
            <p className="font-label-lg text-on-surface-variant mb-2">Construction Fund</p>
            <h3 className="font-headline-lg text-on-surface">Rp 86.330.000</h3>
            <div className="w-full bg-mint-fresh h-1.5 rounded-full mt-4">
              <div className="bg-gold-spiritual h-full rounded-full w-[88%]"></div>
            </div>
            <p className="text-xs mt-2 text-on-surface-variant italic">Main Prayer Hall Expansion</p>
          </div>
        </section>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="font-headline-md text-emerald-deep">Cash Flow Tracker</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-surface-container-lowest text-emerald-deep border border-emerald-deep font-label-lg px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-mint-fresh transition-colors active:scale-95" onClick={() => window.print()}>
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Export PDF
            </button>
            <button className="bg-emerald-deep text-white font-label-lg px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all" onClick={() => setIsModalOpen(true)}>
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Record Transaction
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(6,78,59,0.05)] overflow-hidden border border-mint-fresh/20">
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
              <h3 className="font-label-lg text-emerald-deep uppercase tracking-wider">Recent History</h3>
              <div className="relative">
                <input className="pl-10 pr-4 py-2 border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-emerald-deep outline-none w-48 md:w-64" placeholder="Search transactions..." type="text" />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low font-label-sm text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4">DESCRIPTION</th>
                    <th className="px-6 py-4">CATEGORY</th>
                    <th className="px-6 py-4 text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {financeQuery.isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-on-surface-variant">Memuat data...</td>
                    </tr>
                  ) : financeQuery.data?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-on-surface-variant">Belum ada riwayat transaksi.</td>
                    </tr>
                  ) : (
                    financeQuery.data?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-mint-fresh/10 transition-colors group">
                        <td className="px-6 py-4 font-body-sm text-on-surface-variant">
                          {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              <span className="material-symbols-outlined text-sm">
                                {item.type === 'income' ? 'trending_up' : 'trending_down'}
                              </span>
                            </div>
                            <div>
                              <p className="font-label-lg">{item.description}</p>
                              <p className="text-xs text-on-surface-variant capitalize">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.category === 'operational' ? 'bg-secondary-container text-on-secondary-container' : 'bg-amber-soft/50 text-gold-spiritual'}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${item.type === 'income' ? 'text-emerald-700' : 'text-red-600'}`}>
                          {item.type === 'income' ? '+' : '-'} Rp {parseInt(item.amount).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container-low text-center">
              <button className="text-emerald-deep font-label-lg hover:underline">View All Transactions</button>
            </div>
          </div>

          {/* Quick Chart/Illustration Side */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Visual Decoration Card */}
            <div className="relative rounded-2xl overflow-hidden h-48 group shadow-lg border border-mint-fresh/20">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Visual" src="/gambar/pos_tausiyah.webp.png" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent flex flex-col justify-end p-6">
                <p className="text-white/80 text-xs font-label-sm uppercase tracking-widest">Financial Health</p>
                <h4 className="text-white font-headline-md">Stable Growth</h4>
              </div>
            </div>
            {/* Category Breakdown */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/20">
              <h3 className="font-label-lg text-emerald-deep mb-4 uppercase tracking-wider">Allocation</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-label-sm">Operational</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-deep h-full w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-label-sm">Construction</span>
                    <span>55%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-gold-spiritual h-full w-[55%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-label-sm">Social/Zakat</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full w-[10%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Record Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-deep/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 bg-emerald-deep text-white flex justify-between items-center">
              <div>
                <h3 className="font-headline-md">Record Transaction</h3>
                <p className="text-xs text-white/70">Ensure data accuracy before saving</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSave}>
              <div>
                <label className="block font-label-lg text-on-surface mb-2">Transaction Type</label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      className="hidden peer" 
                      name="type" 
                      type="radio" 
                      checked={transactionType === 'income'} 
                      onChange={() => setTransactionType('income')} 
                    />
                    <div className="p-3 border-2 border-outline-variant rounded-xl text-center peer-checked:border-emerald-deep peer-checked:bg-mint-fresh/20 peer-checked:text-emerald-deep transition-all">
                      <span className="material-symbols-outlined block mb-1">trending_up</span>
                      <span className="font-label-sm">Income</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input 
                      className="hidden peer" 
                      name="type" 
                      type="radio"
                      checked={transactionType === 'expense'} 
                      onChange={() => setTransactionType('expense')} 
                    />
                    <div className="p-3 border-2 border-outline-variant rounded-xl text-center peer-checked:border-red-600 peer-checked:bg-red-50 peer-checked:text-red-600 transition-all">
                      <span className="material-symbols-outlined block mb-1">trending_down</span>
                      <span className="font-label-sm">Expense</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1">Amount (IDR)</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none font-bold text-lg bg-surface-white" placeholder="0" type="number" required />
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none bg-surface-white">
                    <option value="operational">Operational</option>
                    <option value="construction">Construction</option>
                    <option value="waqf">Waqf</option>
                    <option value="emergency">Emergency Fund</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none h-24 bg-surface-white" placeholder="Write detail of the transaction..." required></textarea>
              </div>
              <button disabled={createFinanceMutation.isPending} className="w-full bg-emerald-deep text-white font-label-lg py-4 rounded-xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]" type="submit">
                {createFinanceMutation.isPending ? 'Menyimpan...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
