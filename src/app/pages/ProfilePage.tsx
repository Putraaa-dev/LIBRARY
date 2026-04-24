import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Badge } from '../components/ui/Badge';
import { CATEGORY_COLORS } from '../data/mockData';

export function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const { loans } = useLibrary();
  const [editing, setEditing] = useState(false);
  const [changePw, setChangePw] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });

  if (!currentUser) return null;

  const myLoans = loans.filter(l => l.userId === currentUser.id);
  const activeLoans = myLoans.filter(l => l.status === 'approved');
  const pendingLoans = myLoans.filter(l => l.status === 'pending');
  const returnedLoans = myLoans.filter(l => l.status === 'returned');

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    petugas: 'Petugas Perpustakaan',
    user: 'Anggota Perpustakaan',
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Nama tidak boleh kosong.'); return; }
    updateProfile(form);
    setEditing(false);
    toast.success('Profil berhasil diperbarui!');
  };

  const handleChangePw = () => {
    const storedUsers = localStorage.getItem('perpus_users');
    let usersList: any[] = [];
    if (storedUsers) {
      usersList = JSON.parse(storedUsers);
      const me = usersList.find((u: any) => u.id === currentUser.id);
      if (me && me.password !== pwForm.current) { toast.error('Password saat ini salah.'); return; }
    }
    if (pwForm.newPw.length < 6) { toast.error('Password baru minimal 6 karakter.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Konfirmasi password tidak cocok.'); return; }
    // Update password in storage
    const idx = usersList.findIndex((u: any) => u.id === currentUser.id);
    if (idx !== -1) {
      usersList[idx].password = pwForm.newPw;
      localStorage.setItem('perpus_users', JSON.stringify(usersList));
    }
    setPwForm({ current: '', newPw: '', confirm: '' });
    setChangePw(false);
    toast.success('Password berhasil diubah!');
  };

  const initials = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const inputClass = "w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-800 relative" />
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-white dark:border-slate-800 flex items-center justify-center text-white shadow-lg"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem' }}
            >
              {initials}
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button onClick={() => { setEditing(true); setForm({ name: currentUser.name, phone: currentUser.phone, address: currentUser.address }); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm" style={{ fontWeight: 500 }}>
                  <Edit size={14} /> Edit Profil
                </button>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm" style={{ fontWeight: 500 }}>
                    <X size={14} /> Batal
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm" style={{ fontWeight: 500 }}>
                    <Save size={14} /> Simpan
                  </button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">Nama Lengkap</label>
                <input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">No. Telepon</label>
                <input className={inputClass} placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">Alamat</label>
                <input className={inputClass} placeholder="Alamat lengkap" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-slate-800 dark:text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem' }}>
                  {currentUser.name}
                </h2>
                <Badge status={currentUser.role} />
                <Badge status={currentUser.status} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{ROLE_LABELS[currentUser.role]}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: <Mail size={15} />, label: 'Email', value: currentUser.email },
                  { icon: <Phone size={15} />, label: 'Telepon', value: currentUser.phone || 'Belum diisi' },
                  { icon: <MapPin size={15} />, label: 'Alamat', value: currentUser.address || 'Belum diisi' },
                  { icon: <Calendar size={15} />, label: 'Bergabung', value: currentUser.memberSince },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-blue-500 mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{item.label}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300" style={{ fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sedang Dipinjam', value: activeLoans.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30' },
          { label: 'Menunggu', value: pendingLoans.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30' },
          { label: 'Dikembalikan', value: returnedLoans.length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border text-center`}>
            <p className={`${s.color}`} style={{ fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 }}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <button
          onClick={() => setChangePw(p => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Lock size={16} className="text-slate-500" />
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-700 dark:text-slate-200" style={{ fontWeight: 600 }}>Ubah Password</p>
              <p className="text-xs text-slate-400">Perbarui password akun Anda</p>
            </div>
          </div>
          <span className="text-slate-400">{changePw ? '▲' : '▼'}</span>
        </button>
        {changePw && (
          <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-700 pt-4">
            <div className="space-y-3 max-w-sm">
              {[
                { label: 'Password Saat Ini', key: 'current', placeholder: 'Password lama' },
                { label: 'Password Baru', key: 'newPw', placeholder: 'Min. 6 karakter' },
                { label: 'Konfirmasi Password Baru', key: 'confirm', placeholder: 'Ulangi password baru' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1.5 font-medium">{field.label}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder={field.placeholder}
                      className={inputClass + ' pr-10'}
                      value={pwForm[field.key as keyof typeof pwForm]}
                      onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))}
                    />
                    {field.key === 'newPw' && (
                      <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setChangePw(false); setPwForm({ current: '', newPw: '', confirm: '' }); }}
                  className="flex-1 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  Batal
                </button>
                <button onClick={handleChangePw} className="flex-1 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Loans */}
      {myLoans.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-slate-700 dark:text-slate-200" style={{ fontWeight: 600 }}>Riwayat Peminjaman</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {myLoans.slice(0, 6).map(loan => (
              <div key={loan.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className={`w-8 h-10 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[loan.bookCategory] || 'from-slate-400 to-slate-600'} flex items-center justify-center text-white text-xs flex-shrink-0`} style={{ fontWeight: 700 }}>
                  {loan.bookTitle[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1" style={{ fontWeight: 500 }}>{loan.bookTitle}</p>
                  <p className="text-xs text-slate-400">{loan.requestDate}</p>
                </div>
                <Badge status={loan.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
