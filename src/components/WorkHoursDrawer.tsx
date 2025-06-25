import React from 'react';
import { X, List, Calculator, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WorkHoursDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MENU = [
  { key: 'calendar', label: 'Calendario', icon: Calendar, to: '/calendar' },
  { key: 'work', label: 'Gestione Ore Lavorate', icon: List, to: '/work-entries' },
  { key: 'calc', label: 'Calcolatrice', icon: Calculator, to: '/calculator' },
];

const WorkHoursDrawer: React.FC<WorkHoursDrawerProps> = ({ open, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Menù</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {MENU.map(item => (
            <Link
              key={item.key}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-gray-700 hover:bg-blue-100"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default WorkHoursDrawer; 