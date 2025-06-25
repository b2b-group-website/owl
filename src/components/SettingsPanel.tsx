import React, { useState } from 'react';
import { X, Settings, Plus, Trash2 } from 'lucide-react';
import { Settings as SettingsType } from '../types';

interface SettingsPanelProps {
  settings: SettingsType;
  onSave: (settings: SettingsType) => void;
  onClose: () => void;
  onImportData?: (data: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave, onClose, onImportData }) => {
  const [formData, setFormData] = useState(settings);
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTask = () => {
    if (newTask.trim() && !formData.tasks.includes(newTask.trim())) {
      setFormData({
        ...formData,
        tasks: [...formData.tasks, newTask.trim()],
      });
      setNewTask('');
    }
  };

  const removeTask = (taskToRemove: string) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter(task => task !== taskToRemove),
    });
  };

  // Esporta dati
  const handleExport = () => {
    try {
      const allData = localStorage.getItem('openWorkLog_data');
      if (!allData) return alert('Nessun dato da esportare.');
      const blob = new Blob([allData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'openworklog-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Errore durante l\'esportazione.');
    }
  };

  // Importa dati
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (window.confirm('Importando sovrascriverai tutti i dati attuali. Continuare?')) {
          localStorage.setItem('openWorkLog_data', JSON.stringify(imported));
          if (onImportData) onImportData(imported);
          alert('Dati importati con successo!');
        }
      } catch {
        alert('File non valido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 border-b bg-blue-50 text-blue-900 text-sm rounded-t-lg">
          <b>Backup & Restore:</b> Puoi esportare tutti i tuoi dati in un file JSON per backup o trasferimento. L'importazione sovrascrive tutti i dati attuali. Conserva il file in un luogo sicuro!
        </div>

        {/* Pulsanti import/export subito sotto l'alert */}
        <div className="p-6 pt-4 flex gap-2 items-center">
          <button type="button" onClick={handleExport} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Esporta dati</button>
          <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Importa dati
            <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 pt-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">{formData.currency}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY (¥)</option>
              <option value="₹">INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasks/Projects
            </label>
            <div className="space-y-2 mb-3">
              {formData.tasks.map((task) => (
                <div key={task} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm text-gray-700">{task}</span>
                  <button
                    type="button"
                    onClick={() => removeTask(task)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add new task..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
              />
              <button
                type="button"
                onClick={addTask}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPanel;