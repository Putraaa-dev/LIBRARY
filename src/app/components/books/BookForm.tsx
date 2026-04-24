import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { Book } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Book, 'id' | 'addedAt'>) => void;
  editBook?: Book | null;
}

const EMPTY_FORM = {
  title: '', author: '', isbn: '', category: 'Fiksi', publisher: '',
  year: new Date().getFullYear(), stock: 1, available: 1, description: '',
  pages: 1, language: 'Indonesia', rating: 4.0, cover: '',
};

export function BookForm({ isOpen, onClose, onSubmit, editBook }: BookFormProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editBook) {
      setForm({
        title: editBook.title, author: editBook.author, isbn: editBook.isbn,
        category: editBook.category, publisher: editBook.publisher, year: editBook.year,
        stock: editBook.stock, available: editBook.available, description: editBook.description,
        pages: editBook.pages, language: editBook.language, rating: editBook.rating,
        cover: editBook.cover || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editBook, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Judul buku wajib diisi';
    if (!form.author.trim()) e.author = 'Nama pengarang wajib diisi';
    if (!form.isbn.trim()) e.isbn = 'ISBN wajib diisi';
    if (!form.publisher.trim()) e.publisher = 'Penerbit wajib diisi';
    if (form.stock < 1) e.stock = 'Stok minimal 1';
    if (form.available < 0) e.available = 'Tersedia tidak boleh negatif';
    if (form.available > form.stock) e.available = 'Tersedia tidak boleh melebihi stok';
    if (form.pages < 1) e.pages = 'Jumlah halaman minimal 1';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, cover: form.cover || undefined });
    onClose();
  };

  const set = (field: string, value: string | number) => setForm(prev => ({ ...prev, [field]: value }));

  const inputClass = "w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs text-slate-600 dark:text-slate-300 mb-1.5" + " font-medium";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editBook ? 'Edit Buku' : 'Tambah Buku Baru'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Judul Buku *</label>
            <input className={inputClass} placeholder="Masukkan judul buku" value={form.title} onChange={e => set('title', e.target.value)} />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>
          <div>
            <label className={labelClass}>Pengarang *</label>
            <input className={inputClass} placeholder="Nama pengarang" value={form.author} onChange={e => set('author', e.target.value)} />
            {errors.author && <p className={errorClass}>{errors.author}</p>}
          </div>
          <div>
            <label className={labelClass}>ISBN *</label>
            <input className={inputClass} placeholder="978-xxx-xxx-xxx-x" value={form.isbn} onChange={e => set('isbn', e.target.value)} />
            {errors.isbn && <p className={errorClass}>{errors.isbn}</p>}
          </div>
          <div>
            <label className={labelClass}>Kategori</label>
            <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Penerbit *</label>
            <input className={inputClass} placeholder="Nama penerbit" value={form.publisher} onChange={e => set('publisher', e.target.value)} />
            {errors.publisher && <p className={errorClass}>{errors.publisher}</p>}
          </div>
          <div>
            <label className={labelClass}>Tahun Terbit</label>
            <input type="number" className={inputClass} value={form.year} onChange={e => set('year', parseInt(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Bahasa</label>
            <select className={inputClass} value={form.language} onChange={e => set('language', e.target.value)}>
              <option>Indonesia</option>
              <option>Inggris</option>
              <option>Arab</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Jumlah Halaman</label>
            <input type="number" min={1} className={inputClass} value={form.pages} onChange={e => set('pages', parseInt(e.target.value))} />
            {errors.pages && <p className={errorClass}>{errors.pages}</p>}
          </div>
          <div>
            <label className={labelClass}>Total Stok *</label>
            <input type="number" min={1} className={inputClass} value={form.stock} onChange={e => set('stock', parseInt(e.target.value))} />
            {errors.stock && <p className={errorClass}>{errors.stock}</p>}
          </div>
          <div>
            <label className={labelClass}>Tersedia</label>
            <input type="number" min={0} className={inputClass} value={form.available} onChange={e => set('available', parseInt(e.target.value))} />
            {errors.available && <p className={errorClass}>{errors.available}</p>}
          </div>
          <div>
            <label className={labelClass}>Rating (0–5)</label>
            <input type="number" min={0} max={5} step={0.1} className={inputClass} value={form.rating} onChange={e => set('rating', parseFloat(e.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>URL Cover (opsional)</label>
            <input className={inputClass} placeholder="https://..." value={form.cover} onChange={e => set('cover', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Deskripsi</label>
            <textarea rows={3} className={inputClass + ' resize-none'} placeholder="Deskripsi singkat buku..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
            Batal
          </button>
          <button type="submit" className="flex-1 py-2.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm" style={{ fontWeight: 500 }}>
            {editBook ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
