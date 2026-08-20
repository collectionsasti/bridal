import { useState } from 'react';
import { Plus, Trash2, Pencil, X, Loader2, FolderPlus } from 'lucide-react';
import { useCollections } from '@/lib/useCollections';

export default function CollectionManager() {
  const { collections, loading, error, createCollection, updateCollection, deleteCollection } = useCollections();
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSort, setEditSort] = useState(0);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async () => {
    setFormError(null);
    if (!newLabel.trim()) return;
    setBusy(true);
    const { error } = await createCollection(newLabel.trim());
    setBusy(false);
    if (error) {
      setFormError(error);
      return;
    }
    setNewLabel('');
    setShowForm(false);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setFormError(null);
    setBusy(true);
    const { error } = await updateCollection(editId, editLabel.trim(), editSort);
    setBusy(false);
    if (error) {
      setFormError(error);
      return;
    }
    setEditId(null);
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"? Products in this collection will keep their current category.`)) return;
    setBusy(true);
    await deleteCollection(id);
    setBusy(false);
  };

  const startEdit = (id: string, label: string, sort: number) => {
    setEditId(id);
    setEditLabel(label);
    setEditSort(sort);
    setFormError(null);
  };

  return (
    <div className="rounded-sm border border-stone-200 bg-ivory-50 p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] tracking-luxe uppercase text-champagne-700/80 font-light">
          Collections
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 text-ink-600 hover:border-champagne-500 px-3 py-1.5 text-[10px] tracking-luxe uppercase font-light transition-colors"
        >
          {showForm ? <X size={12} /> : <FolderPlus size={12} />}
          {showForm ? 'Cancel' : 'Add Collection'}
        </button>
      </div>

      {formError && (
        <p className="text-xs text-wine-700 font-light bg-wine-900/5 border border-wine-700/20 rounded-sm px-3 py-2 mb-3">
          {formError}
        </p>
      )}

      {showForm && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Collection name (e.g. Mehndi, Barat, Walima)"
            className="flex-1 rounded-sm border border-stone-300 bg-ivory-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/50 focus:border-champagne-500 focus:outline-none focus:ring-1 focus:ring-champagne-500/40 transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-ivory-100 hover:bg-ivory-200 disabled:opacity-60 text-ink-900 px-4 py-2.5 text-[10px] tracking-luxe uppercase font-light transition-colors"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Add
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-ink-500 font-light">Loading collections…</p>
      ) : error ? (
        <p className="text-xs text-wine-700 font-light">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <div key={c.id}>
              {editId === c.id ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-champagne-500 bg-ivory-100 px-3 py-1.5">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-24 bg-transparent text-xs text-ink-900 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={editSort}
                    onChange={(e) => setEditSort(Number(e.target.value))}
                    className="w-10 bg-transparent text-xs text-ink-900 focus:outline-none"
                  />
                  <button onClick={handleUpdate} disabled={busy} className="text-champagne-700">
                    <Loader2 size={12} className={busy ? 'animate-spin' : 'hidden'} />
                    {!busy && <span className="text-[9px] uppercase tracking-luxe">Save</span>}
                  </button>
                  <button onClick={() => setEditId(null)} className="text-ink-500">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-ivory-100 px-3.5 py-1.5">
                  <span className="text-[10px] tracking-luxe uppercase text-ink-700 font-light">{c.label}</span>
                  <span className="text-[8px] text-ink-500/60">#{c.sort_order}</span>
                  <button
                    onClick={() => startEdit(c.id, c.label, c.sort_order)}
                    className="text-ink-500 hover:text-champagne-700"
                    aria-label="Edit collection"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.label)}
                    disabled={busy}
                    className="text-ink-500 hover:text-wine-700"
                    aria-label="Delete collection"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {collections.length === 0 && (
            <p className="text-xs text-ink-500 font-light italic">No collections yet. Add one above.</p>
          )}
        </div>
      )}
    </div>
  );
}
