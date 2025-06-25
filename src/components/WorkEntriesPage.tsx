import React, { useState } from 'react';
import { WorkEntry } from '../types';
import { Edit, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkEntriesPageProps {
  workEntries: WorkEntry[];
  updateWorkEntries: (entries: WorkEntry[]) => void;
}

const WorkEntriesPage: React.FC<WorkEntriesPageProps> = ({ workEntries, updateWorkEntries }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<WorkEntry>>({});

  const startEdit = (entry: WorkEntry) => {
    setEditingId(entry.id);
    setEditData({ ...entry });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };
  const saveEdit = () => {
    if (!editData.id || !editData.date || !editData.task || !editData.hours) return;
    updateWorkEntries(workEntries.map(e => e.id === editData.id ? (editData as WorkEntry) : e));
    setEditingId(null);
    setEditData({});
  };
  const deleteEntry = (id: string) => {
    if (window.confirm('Eliminare questa voce?')) {
      updateWorkEntries(workEntries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 rounded hover:bg-gray-100"><ArrowLeft className="h-6 w-6" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Gestione Ore Lavorate</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {workEntries.length === 0 && <div className="text-gray-500 text-center mt-8">Nessuna voce inserita</div>}
        <div className="space-y-4">
          {workEntries
            .sort((a, b) => b.date.localeCompare(a.date))
            .map(entry => (
            <div key={entry.id} className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm border">
              {editingId === entry.id ? (
                <>
                  <div className="flex gap-2 flex-wrap">
                    <input type="date" value={editData.date || ''} onChange={e => setEditData(d => ({ ...d, date: e.target.value }))} className="flex-1 px-2 py-1 border rounded" />
                    <input type="number" min="0" step="0.25" value={editData.hours || ''} onChange={e => setEditData(d => ({ ...d, hours: parseFloat(e.target.value) }))} className="w-20 px-2 py-1 border rounded" placeholder="Ore" />
                  </div>
                  <input type="text" value={editData.task || ''} onChange={e => setEditData(d => ({ ...d, task: e.target.value }))} className="w-full px-2 py-1 border rounded" placeholder="Task" />
                  <input type="text" value={editData.description || ''} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} className="w-full px-2 py-1 border rounded" placeholder="Note" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={cancelEdit} className="px-3 py-1 rounded bg-gray-200 text-gray-700">Annulla</button>
                    <button onClick={saveEdit} className="px-3 py-1 rounded bg-blue-600 text-white flex items-center gap-1"><Save className="h-4 w-4" />Salva</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <span className="font-semibold">{entry.date}</span>
                    <span className="text-sm text-gray-700">{entry.task}</span>
                    <span className="text-sm text-blue-700 font-bold">{entry.hours}h</span>
                  </div>
                  <div className="text-xs text-gray-500">{entry.description}</div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => startEdit(entry)} className="text-blue-600 hover:underline flex items-center gap-1"><Edit className="h-4 w-4" />Modifica</button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-red-500 hover:underline flex items-center gap-1"><Trash2 className="h-4 w-4" />Elimina</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkEntriesPage; 