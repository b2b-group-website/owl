import React from 'react';
import { WorkEntry } from '../types';
import CalendarView from './CalendarView';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CalendarPageProps {
  workEntries: WorkEntry[];
}

const CalendarPage: React.FC<CalendarPageProps> = ({ workEntries }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 rounded hover:bg-gray-100"><ArrowLeft className="h-6 w-6" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Calendario</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        <CalendarView workEntries={workEntries} onAddEntry={() => {}} />
      </main>
    </div>
  );
};

export default CalendarPage; 