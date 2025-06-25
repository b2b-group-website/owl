import React, { useState } from 'react';
import { WorkEntry } from '../types';
import { Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, List, Calendar as CalendarIcon, X } from 'lucide-react';

interface CalendarViewProps {
  workEntries: WorkEntry[];
  onAddEntry: (date: string) => void;
  onEditEntry?: (entry: WorkEntry) => void;
  onDeleteEntry?: (entry: WorkEntry) => void;
  tasksColors?: Record<string, string>; // es: { 'Task1': '#f59e42' }
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}
function getWeekDays(date: Date) {
  // Restituisce i 7 giorni della settimana che contiene la data
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthNames = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];
const defaultColors = [
  '#2563eb', '#059669', '#f59e42', '#e11d48', '#a21caf', '#fbbf24', '#10b981', '#6366f1', '#f43f5e', '#0ea5e9'
];

const CalendarView: React.FC<CalendarViewProps> = ({ workEntries, onAddEntry, onEditEntry, onDeleteEntry, tasksColors }) => {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [mode, setMode] = useState<'month' | 'week'>('week');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Raggruppa le ore per giorno
  const entriesByDate: Record<string, WorkEntry[]> = {};
  workEntries.forEach(entry => {
    if (!entriesByDate[entry.date]) entriesByDate[entry.date] = [];
    entriesByDate[entry.date].push(entry);
  });

  // Task -> colore
  const allTasks = Array.from(new Set(workEntries.map(e => e.task)));
  const colorMap: Record<string, string> = {};
  allTasks.forEach((t, i) => {
    colorMap[t] = tasksColors?.[t] || defaultColors[i % defaultColors.length];
  });

  // Giorni da mostrare
  let days: Date[] = [];
  if (mode === 'month') {
    days = getMonthDays(view.year, view.month);
  } else {
    // settimana: mostra la settimana che contiene il primo giorno visibile del mese
    const first = new Date(view.year, view.month, 1);
    days = getWeekDays(first);
  }

  // Calcola padding per il primo giorno della settimana (solo vista mese)
  const firstDayOfWeek = days[0].getDay();
  const lastDayOfWeek = days[days.length - 1].getDay();

  // Navigazione
  const prevMonth = () => {
    setView(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  };
  const nextMonth = () => {
    setView(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  };
  const prevYear = () => setView(v => ({ year: v.year - 1, month: v.month }));
  const nextYear = () => setView(v => ({ year: v.year + 1, month: v.month }));

  // Settimana corrente (per navigazione)
  const prevWeek = () => {
    setView(v => {
      const d = new Date(v.year, v.month, 1);
      d.setDate(d.getDate() - 7);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextWeek = () => {
    setView(v => {
      const d = new Date(v.year, v.month, 1);
      d.setDate(d.getDate() + 7);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Popup dettagli giorno
  const selectedEntries = selectedDay ? entriesByDate[selectedDay] || [] : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      {/* Header calendario */}
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <div className="flex gap-1">
          <button onClick={prevYear} className="p-1 rounded hover:bg-gray-100"><ChevronsLeft className="h-4 w-4" /></button>
          <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
          <div className="text-lg font-semibold text-gray-900 px-2">
            {monthNames[view.month]} {view.year}
          </div>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
          <button onClick={nextYear} className="p-1 rounded hover:bg-gray-100"><ChevronsRight className="h-4 w-4" /></button>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setMode('month')} className={`p-1 rounded ${mode === 'month' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`} title="Vista mensile"><CalendarIcon className="h-5 w-5" /></button>
          <button onClick={() => setMode('week')} className={`p-1 rounded ${mode === 'week' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`} title="Vista settimanale"><List className="h-5 w-5" /></button>
        </div>
      </div>
      {/* Legenda task */}
      <div className="flex flex-wrap gap-2 mb-2">
        {allTasks.map(task => (
          <span key={task} className="flex items-center gap-1 text-xs"><span className="inline-block w-3 h-3 rounded-full" style={{ background: colorMap[task] }}></span>{task}</span>
        ))}
      </div>
      {/* Intestazione e celle settimana su due righe SOLO in vista settimanale */}
      {mode === 'week' ? (
        <div className="mb-2">
          {/* Prima riga: Monday-Thursday */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-gray-500 mb-1">
            {weekDays.slice(0,4).map((wd) => <div key={wd}>{wd}</div>)}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {days.slice(0,4).map((dateObj) => {
              const dateStr = dateObj.toISOString().split('T')[0];
              const entries = entriesByDate[dateStr] || [];
              const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              return (
                <div
                  key={dateStr}
                  className={`border rounded-lg p-4 min-h-[100px] flex flex-col items-center justify-between bg-gray-50 relative cursor-pointer transition-all
                    ${isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    ${isWeekend ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedDay(dateStr)}
                >
                  <div className="text-base font-bold mb-1">{dateObj.getDate()}</div>
                  <div className="flex flex-col gap-0.5 w-full">
                    {entries.map((e, i) => (
                      <div key={e.id} className="flex items-center gap-1 text-sm" style={{ color: colorMap[e.task] }}>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: colorMap[e.task] }}></span>
                        {e.hours}h
                      </div>
                    ))}
                    {totalHours === 0 && <span className="text-gray-300 text-xs">-</span>}
                  </div>
                  <button
                    className="absolute bottom-2 right-2 p-3 rounded-full hover:bg-blue-100 text-lg"
                    title="Aggiungi voce"
                    onClick={e => { e.stopPropagation(); onAddEntry(dateStr); }}
                  >
                    <Plus className="h-7 w-7 text-blue-500" />
                  </button>
                </div>
              );
            })}
          </div>
          {/* Seconda riga: Friday-Sunday */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-500 mb-1">
            {weekDays.slice(4).map((wd) => <div key={wd}>{wd}</div>)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {days.slice(4).map((dateObj) => {
              const dateStr = dateObj.toISOString().split('T')[0];
              const entries = entriesByDate[dateStr] || [];
              const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              return (
                <div
                  key={dateStr}
                  className={`border rounded-lg p-4 min-h-[100px] flex flex-col items-center justify-between bg-gray-50 relative cursor-pointer transition-all
                    ${isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    ${isWeekend ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedDay(dateStr)}
                >
                  <div className="text-base font-bold mb-1">{dateObj.getDate()}</div>
                  <div className="flex flex-col gap-0.5 w-full">
                    {entries.map((e, i) => (
                      <div key={e.id} className="flex items-center gap-1 text-sm" style={{ color: colorMap[e.task] }}>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: colorMap[e.task] }}></span>
                        {e.hours}h
                      </div>
                    ))}
                    {totalHours === 0 && <span className="text-gray-300 text-xs">-</span>}
                  </div>
                  <button
                    className="absolute bottom-2 right-2 p-3 rounded-full hover:bg-blue-100 text-lg"
                    title="Aggiungi voce"
                    onClick={e => { e.stopPropagation(); onAddEntry(dateStr); }}
                  >
                    <Plus className="h-7 w-7 text-blue-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-7 gap-2 sm:gap-1">
        {/* Padding inizio mese (solo vista mese) */}
        {mode === 'month' && Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={'pad-start-' + i}></div>)}
        {days.map((dateObj, idx) => {
          const dateStr = dateObj.toISOString().split('T')[0];
          const entries = entriesByDate[dateStr] || [];
          const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
          return (
            <div
              key={dateStr}
              className={`border rounded-lg p-2 min-h-[80px] sm:min-h-[60px] flex flex-col items-center justify-between bg-gray-50 relative cursor-pointer transition-all
                ${isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                ${isWeekend ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedDay(dateStr)}
            >
              <div className="text-xs font-bold mb-1">{dateObj.getDate()}</div>
              {/* Ore per task */}
              <div className="flex flex-col gap-0.5 w-full">
                {entries.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-1 text-xs" style={{ color: colorMap[e.task] }}>
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: colorMap[e.task] }}></span>
                    {e.hours}h
                  </div>
                ))}
                {totalHours === 0 && <span className="text-gray-300 text-xs">-</span>}
              </div>
              <button
                className="absolute bottom-2 right-2 p-2 sm:p-1 rounded-full hover:bg-blue-100 text-base sm:text-xs"
                title="Aggiungi voce"
                onClick={e => { e.stopPropagation(); onAddEntry(dateStr); }}
              >
                <Plus className="h-6 w-6 sm:h-4 sm:w-4 text-blue-500" />
              </button>
            </div>
          );
        })}
        {/* Padding fine mese (solo vista mese) */}
        {mode === 'month' && Array.from({ length: 6 - lastDayOfWeek }).map((_, i) => <div key={'pad-end-' + i}></div>)}
      </div>
      )}
      {/* Popup dettagli giorno */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setSelectedDay(null)}><X className="h-5 w-5" /></button>
            <h3 className="text-lg font-semibold mb-2">Dettaglio {selectedDay}</h3>
            {selectedEntries.length === 0 && <div className="text-gray-500">Nessuna voce</div>}
            <ul className="space-y-2">
              {selectedEntries.map(entry => (
                <li key={entry.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div>
                    <div className="font-semibold" style={{ color: colorMap[entry.task] }}>{entry.task}</div>
                    <div className="text-xs text-gray-500">{entry.hours}h - {entry.description}</div>
                  </div>
                  <div className="flex gap-1">
                    {onEditEntry && <button className="text-blue-500 hover:underline text-xs" onClick={e => { e.stopPropagation(); onEditEntry(entry); }}>Modifica</button>}
                    {onDeleteEntry && <button className="text-red-500 hover:underline text-xs" onClick={e => { e.stopPropagation(); onDeleteEntry(entry); }}>Elimina</button>}
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700" onClick={() => { setSelectedDay(null); onAddEntry(selectedDay); }}>Aggiungi voce</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 