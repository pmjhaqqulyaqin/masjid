import { useState, useRef, useEffect } from 'react';
import { useFacilities } from '../hooks/useFacilities';
import { useSettings } from '../hooks/useSettings';

export default function AdminSettings() {
  const { facilities, createFacility, updateFacility, deleteFacility } = useFacilities();
  const { settings, saveSettings, uploadAsset } = useSettings();

  const [isOpen24Hours, setIsOpen24Hours] = useState(true);
  const [profileData, setProfileData] = useState({ name: 'Masjid Haqqul Yaqin', year: '1998', address: 'Jl. KH. Agus Salim No. 12, Jakarta Pusat, DKI Jakarta', landArea: '1200', buildArea: '850' });
  const [uiModal, setUiModal] = useState<{type: string, title: string, message: string} | null>(null);

  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editFacilityId, setEditFacilityId] = useState<number | null>(null);
  const [facilityFormData, setFacilityFormData] = useState({ name: '', icon: 'meeting_room', description: '' });
  
  const [mapCoords, setMapCoords] = useState('-6.1751, 106.8272');
  const [mapEmbed, setMapEmbed] = useState('');
  const [uploadType, setUploadType] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync settings when fetched
  useEffect(() => {
    if (settings) {
      if (settings.is_open_24h !== undefined) setIsOpen24Hours(settings.is_open_24h === 'true');
      if (settings.mosque_name) setProfileData(prev => ({...prev, name: settings.mosque_name}));
      if (settings.year_established) setProfileData(prev => ({...prev, year: settings.year_established}));
      if (settings.address) setProfileData(prev => ({...prev, address: settings.address}));
      if (settings.land_area) setProfileData(prev => ({...prev, landArea: settings.land_area}));
      if (settings.build_area) setProfileData(prev => ({...prev, buildArea: settings.build_area}));
      if (settings.map_coords) setMapCoords(settings.map_coords);
      if (settings.map_embed) setMapEmbed(settings.map_embed);
    }
  }, [settings]);

  const handleOpenAddFacility = () => {
    setEditFacilityId(null);
    setFacilityFormData({ name: '', icon: 'meeting_room', desc: '' });
    setIsFacilityModalOpen(true);
  };

  const handleOpenEditFacility = (f: any) => {
    setEditFacilityId(f.id);
    setFacilityFormData({ name: f.name, icon: f.icon, description: f.description || '' });
    setIsFacilityModalOpen(true);
  };

  const handleDeleteFacility = (id: number) => {
    if (confirm("Hapus fasilitas ini?")) {
      deleteFacility(id);
    }
  };

  const handleFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFacilityId) {
      updateFacility({ id: editFacilityId, ...facilityFormData });
    } else {
      createFacility(facilityFormData);
    }
    setIsFacilityModalOpen(false);
  };

  const handleSaveProfile = () => {
    saveSettings({
      mosque_name: profileData.name,
      year_established: profileData.year,
      address: profileData.address,
      land_area: profileData.landArea,
      build_area: profileData.buildArea
    }, {
      onSuccess: () => {
        setUiModal({ type: 'success', title: 'Profil Disimpan', message: 'Perubahan profil masjid berhasil disimpan ke dalam database sistem.' });
      }
    });
  };

  const handleMoreOptions = () => {
    setUiModal({ type: 'piket', title: 'Pengaturan Piket', message: '' });
  };

  const handleOpenMaps = () => {
    setUiModal({ type: 'maps', title: 'Google Maps API', message: '' });
  };

  const handleSaveMaps = () => {
    saveSettings({
      map_coords: mapCoords,
      map_embed: mapEmbed
    }, {
      onSuccess: () => {
        setUiModal({ type: 'success', title: 'Tersimpan', message: 'Pengaturan Google Maps berhasil diperbarui di database.' });
      }
    });
  };

  const handleAssetUpload = (type: string) => {
    setUploadType(type);
    setUiModal({ type: 'upload', title: `Upload ${type}`, message: '' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const res = await uploadAsset(file);
        // Save the setting URL based on uploadType
        const key = uploadType === 'Masjid Logo' ? 'logo_url' : 'banner_url';
        saveSettings({ [key]: res.url });
        
        setUiModal({ type: 'success', title: 'Berhasil Diunggah', message: `File berhasil diunggah dan disimpan ke ${key}.` });
      } catch (err) {
        setUiModal({ type: 'success', title: 'Gagal', message: 'Terjadi kesalahan saat upload.' }); // Reusing success modal for simple mock alert or you could add error type
      }
    }
  };

  const handleToggle24h = () => {
    const newVal = !isOpen24Hours;
    setIsOpen24Hours(newVal);
    saveSettings({ is_open_24h: String(newVal) });
  };

  return (
    <main className="pt-20 pb-24 md:pb-12 md:pt-10 px-container-margin space-y-stack-lg max-w-screen-md mx-auto w-full">
      {/* Header Visual Section */}
      <section className="relative h-48 rounded-xl overflow-hidden shadow-sm group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: settings?.banner_url ? `url(${settings.banner_url})` : "url('/gambar/image_from_https_wpmasjid.com_wp_content_uploads_2023_03_111_1_1200x550.webp.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="font-headline-md">Admin Dashboard</h2>
          <p className="font-body-sm opacity-90">Mosque Info &amp; Facility Settings</p>
        </div>
        <label className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full font-label-sm cursor-pointer hover:bg-white/40 transition-all">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined !text-[16px]">upload</span>
            Change Banner
          </span>
          <input className="hidden" type="file" />
        </label>
      </section>

      {/* Main Content Bento Layout */}
      <div className="space-y-stack-md">
        {/* Section 1: Edit Profile */}
        <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border border-mint-fresh/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-stack-md">
            <h3 className="font-headline-md text-emerald-deep flex items-center gap-2">
              <span className="material-symbols-outlined">mosque</span>
              Profil Masjid
            </h3>
            <button onClick={handleSaveProfile} className="bg-emerald-deep text-white px-4 py-2 rounded-lg font-label-lg shadow-md active:scale-95 transition-transform">Save Changes</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface-variant block">Nama Masjid</label>
              <input className="w-full bg-surface-container-low border border-transparent focus:border-emerald-deep focus:ring-2 focus:ring-emerald-deep/10 rounded-lg p-3 font-body-md outline-none transition-all" type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface-variant block">Tahun Berdiri</label>
              <input className="w-full bg-surface-container-low border border-transparent focus:border-emerald-deep focus:ring-2 focus:ring-emerald-deep/10 rounded-lg p-3 font-body-md outline-none transition-all" type="text" value={profileData.year} onChange={e => setProfileData({...profileData, year: e.target.value})} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-label-sm text-on-surface-variant block">Alamat Lengkap</label>
              <textarea className="w-full bg-surface-container-low border border-transparent focus:border-emerald-deep focus:ring-2 focus:ring-emerald-deep/10 rounded-lg p-3 font-body-md h-20 outline-none transition-all" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface-variant block">Luas Tanah (m²)</label>
              <input className="w-full bg-surface-container-low border border-transparent focus:border-emerald-deep focus:ring-2 focus:ring-emerald-deep/10 rounded-lg p-3 font-body-md outline-none transition-all" type="number" value={profileData.landArea} onChange={e => setProfileData({...profileData, landArea: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="font-label-sm text-on-surface-variant block">Luas Bangunan (m²)</label>
              <input className="w-full bg-surface-container-low border border-transparent focus:border-emerald-deep focus:ring-2 focus:ring-emerald-deep/10 rounded-lg p-3 font-body-md outline-none transition-all" type="number" value={profileData.buildArea} onChange={e => setProfileData({...profileData, buildArea: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Section 2: Direktori Digital */}
        <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)]">
          <div className="flex items-center justify-between mb-stack-md">
            <h3 className="font-headline-md text-emerald-deep flex items-center gap-2">
              <span className="material-symbols-outlined">category</span>
              Direktori Fasilitas
            </h3>
            <button onClick={handleOpenAddFacility} className="text-emerald-deep flex items-center gap-1 font-label-lg hover:underline transition-all">
              <span className="material-symbols-outlined !text-[18px]">add_circle</span>
              Add Facility
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <div key={f.id} className="bg-mint-fresh/20 p-4 rounded-xl border border-mint-fresh/50 flex flex-col justify-between hover:bg-mint-fresh/30 transition-colors">
                <div>
                  <span className="material-symbols-outlined text-emerald-deep mb-2">{f.icon}</span>
                  <h4 className="font-label-lg text-emerald-deep">{f.name}</h4>
                  <p className="font-body-sm text-on-surface-variant text-[11px] leading-tight mt-1">{f.description}</p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => handleOpenEditFacility(f)} className="p-1.5 rounded-full hover:bg-white/50 text-on-surface-variant"><span className="material-symbols-outlined !text-[18px]">edit</span></button>
                  <button onClick={() => handleDeleteFacility(f.id)} className="p-1.5 rounded-full hover:bg-red-50 text-error"><span className="material-symbols-outlined !text-[18px]">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Piket Schedule Settings */}
        <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border-l-4 border-gold-spiritual">
          <div className="mb-4">
            <h3 className="font-headline-md text-emerald-deep flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Jadwal Piket Harian
            </h3>
            <p className="font-body-sm text-on-surface-variant">Manage daily Imam &amp; Muadzin assignments.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
            <button className="bg-emerald-deep text-white px-4 py-2 rounded-full font-label-sm whitespace-nowrap">Monday</button>
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full font-label-sm whitespace-nowrap hover:bg-surface-variant">Tuesday</button>
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full font-label-sm whitespace-nowrap hover:bg-surface-variant">Wednesday</button>
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full font-label-sm whitespace-nowrap hover:bg-surface-variant">Thursday</button>
            <button className="bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-full font-label-sm whitespace-nowrap hover:bg-surface-variant">Friday</button>
          </div>
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-deep/10 flex items-center justify-center text-emerald-deep font-bold">I</div>
                <div>
                  <p className="font-label-lg text-emerald-deep">Imam Rawatib</p>
                  <p className="font-body-sm text-on-surface-variant">Ust. Ahmad Syarifuddin</p>
                </div>
              </div>
              <button onClick={handleMoreOptions} className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-deep/10 flex items-center justify-center text-emerald-deep font-bold">M</div>
                <div>
                  <p className="font-label-lg text-emerald-deep">Muadzin</p>
                  <p className="font-body-sm text-on-surface-variant">Bpk. H. Mansyur</p>
                </div>
              </div>
              <button onClick={handleMoreOptions} className="text-on-surface-variant"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          </div>
        </section>

        {/* Section 4 & 5: Operational & Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {/* Operational Hours */}
          <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)]">
            <h3 className="font-headline-md text-emerald-deep flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined">schedule</span>
              Operational &amp; Rules
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-on-surface">Open 24 Hours</span>
                <div 
                  className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${isOpen24Hours ? 'bg-emerald-deep' : 'bg-outline-variant'}`}
                  onClick={handleToggle24h}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOpen24Hours ? 'left-7' : 'left-1'}`}></span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-sm text-on-surface-variant">General Rules</label>
                <div className="p-3 bg-surface-container-low rounded-lg font-body-sm text-on-surface-variant">
                  1. Dilarang merokok di area masjid<br/>
                  2. Matikan handphone saat shalat<br/>
                  3. Menjaga ketenangan dan kebersihan
                </div>
              </div>
            </div>
          </section>

          {/* Map Location */}
          <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)] overflow-hidden flex flex-col">
            <h3 className="font-headline-md text-emerald-deep flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined">location_on</span>
              Map Location
            </h3>
            <div className="relative flex-grow rounded-lg overflow-hidden border border-mint-fresh/50 min-h-[150px]">
              <img className="w-full h-full object-cover" data-alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV0tAv-NjMOf5iselbOrEOGaJJU6m2oZ_bNO2HfvlNznAMwXfS9nUty3kifG9iw5AgxU8WUR_073MWBFAtj1HsWeiM8qSmotq-JAvFBf9RUFrMFo2Bgvoneg2Wi6c8ergyILmNsrIAHS8G_QjvxPN4p9oM2oVTgYA3utZiuKSKIcv17JXirQ6ranBXCeCefm49LVL6tcDGrY2kxISII3WfKfrHmuhWyUOO8aUqY2sn9FgF3XCTEbzuEeOEzS0rYd0ViGHEMNQpGA" />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-label-sm border border-outline-variant shadow-sm">
                Coordinates: {mapCoords}
              </div>
            </div>
            <button onClick={handleOpenMaps} className="mt-4 w-full py-2 bg-surface-container-low text-emerald-deep rounded-lg font-label-lg hover:bg-mint-fresh transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined !text-[18px]">map</span>
              Open Google Maps Settings
            </button>
          </section>
        </div>

        {/* Section 6: Assets Upload Section */}
        <section className="bg-surface-white rounded-xl p-6 shadow-[0_4px_20px_rgba(6,78,59,0.05)] border-2 border-dashed border-mint-fresh">
          <h3 className="font-headline-md text-emerald-deep flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined">cloud_upload</span>
            Branding Assets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div onClick={() => handleAssetUpload("Masjid Logo")} className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4 border border-transparent hover:border-emerald-deep/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-emerald-deep/40 !text-[32px]">image</span>
              </div>
              <div>
                <p className="font-label-lg text-emerald-deep">Masjid Logo</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">PNG or SVG, max 2MB</p>
              </div>
            </div>
            <div onClick={() => handleAssetUpload("Slider Banners")} className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4 border border-transparent hover:border-emerald-deep/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-emerald-deep/40 !text-[32px]">video_library</span>
              </div>
              <div>
                <p className="font-label-lg text-emerald-deep">Slider Banners</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">1920x1080px recommended</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Facility Modal */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 bg-emerald-deep text-white">
              <h3 className="font-headline-md">{editFacilityId ? 'Edit Fasilitas' : 'Tambah Fasilitas'}</h3>
            </div>
            <form onSubmit={handleFacilitySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Nama Fasilitas</label>
                <input required type="text" value={facilityFormData.name} onChange={e => setFacilityFormData({...facilityFormData, name: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="e.g. Ruang Utama" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Material Icon (Google Fonts)</label>
                <input required type="text" value={facilityFormData.icon} onChange={e => setFacilityFormData({...facilityFormData, icon: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="e.g. meeting_room, water_drop" />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1">Deskripsi Singkat</label>
                <textarea required value={facilityFormData.description} onChange={e => setFacilityFormData({...facilityFormData, description: e.target.value})} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="e.g. Kapasitas 500 Jamaah"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-outline-variant/30">
                <button type="button" onClick={() => setIsFacilityModalOpen(false)} className="px-5 py-2.5 rounded-xl font-label-lg text-emerald-deep hover:bg-mint-fresh/20 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-label-lg bg-emerald-deep text-white hover:opacity-90 transition-opacity">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Settings Modals */}
      {uiModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className={`p-6 ${uiModal.type === 'success' ? 'bg-emerald-deep' : 'bg-surface-container-high'} flex justify-between items-center`}>
              <h3 className={`font-headline-md ${uiModal.type === 'success' ? 'text-white' : 'text-emerald-deep'}`}>{uiModal.title}</h3>
              <button onClick={() => setUiModal(null)} className={`p-2 rounded-full ${uiModal.type === 'success' ? 'text-white/80 hover:bg-white/20' : 'text-on-surface-variant hover:bg-surface-variant'}`}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6">
              {uiModal.type === 'success' && (
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-mint-fresh text-emerald-deep rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <p className="text-on-surface text-center text-body-lg">{uiModal.message}</p>
                </div>
              )}

              {uiModal.type === 'piket' && (
                <div className="space-y-2">
                  <button onClick={() => setUiModal(null)} className="w-full flex items-center gap-3 p-4 bg-surface-container-lowest hover:bg-mint-fresh/20 border border-outline-variant/20 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-emerald-deep">swap_horiz</span>
                    <div className="text-left"><p className="font-label-lg text-emerald-deep">Ganti Petugas</p><p className="text-xs text-on-surface-variant">Pilih pengganti untuk shift ini</p></div>
                  </button>
                  <button onClick={() => setUiModal(null)} className="w-full flex items-center gap-3 p-4 bg-surface-container-lowest hover:bg-red-50 border border-outline-variant/20 rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-error">event_busy</span>
                    <div className="text-left"><p className="font-label-lg text-error">Tandai Berhalangan</p><p className="text-xs text-on-surface-variant">Kosongkan jadwal piket</p></div>
                  </button>
                </div>
              )}

              {uiModal.type === 'maps' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Koordinat Latitude & Longitude</label>
                    <input type="text" value={mapCoords} onChange={e => setMapCoords(e.target.value)} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none" placeholder="-6.1751, 106.8272" />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant mb-1">Google Maps Embed URL (Iframe)</label>
                    <textarea value={mapEmbed} onChange={e => setMapEmbed(e.target.value)} className="w-full border border-outline-variant rounded-xl p-3 focus:ring-2 focus:ring-emerald-deep outline-none h-24" placeholder="<iframe src='...' ></iframe>"></textarea>
                  </div>
                  <button onClick={handleSaveMaps} className="w-full py-3 bg-emerald-deep text-white rounded-xl font-bold mt-2">Simpan Koordinat</button>
                </div>
              )}

              {uiModal.type === 'upload' && (
                <div 
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-mint-fresh rounded-xl bg-surface-container-low cursor-pointer hover:bg-mint-fresh/10 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-emerald-deep !text-[32px]">cloud_upload</span>
                  </div>
                  <p className="font-label-lg text-emerald-deep mb-1">Klik untuk Memilih File</p>
                  <p className="font-body-sm text-on-surface-variant">Max 2MB (PNG/JPG/SVG)</p>
                  <button className="mt-6 bg-emerald-deep text-white px-6 py-2 rounded-full font-label-sm opacity-0 group-hover:opacity-100 transition-opacity">Browse File</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
