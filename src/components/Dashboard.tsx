import React, { useState } from 'react';
import { 
  Clock, 
  DollarSign, 
  FileText, 
  PlusCircle, 
  Calendar,
  TrendingUp,
  Users,
  LogOut,
  Settings,
  Menu
} from 'lucide-react';
import { AppData, WorkEntry, Note, Expense } from '../types';
import WorkEntryForm from './WorkEntryForm';
import NoteForm from './NoteForm';
import ExpenseForm from './ExpenseForm';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import SettingsPanel from './SettingsPanel';
import WorkHoursDrawer from './WorkHoursDrawer';

interface DashboardProps {
  data: AppData;
  updateData: (newData: AppData) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, updateData, onLogout }) => {
  const [activeModal, setActiveModal] = useState<
    | { type: 'work'; date?: string }
    | { type: 'note' }
    | { type: 'expense' }
    | { type: 'settings' }
    | null
  >(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalHours = data.workEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const estimatedEarnings = totalHours * data.settings.hourlyRate;
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netEarnings = estimatedEarnings - totalExpenses;

  const addWorkEntry = (entry: Omit<WorkEntry, 'id' | 'createdAt'>) => {
    const newEntry: WorkEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    updateData({
      ...data,
      workEntries: [...data.workEntries, newEntry],
    });
    setActiveModal(null);
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    updateData({
      ...data,
      notes: [...data.notes, newNote],
    });
    setActiveModal(null);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    updateData({
      ...data,
      expenses: [...data.expenses, newExpense],
    });
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="pt-2 pb-1">
            <h1 className="text-center text-xs font-bold text-gray-700 tracking-wide uppercase">Open Work Log</h1>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 py-2">
            <div className="flex items-center min-w-0 flex-1">
              <button onClick={() => setDrawerOpen(true)} className="mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Menu className="h-7 w-7 text-gray-700" />
              </button>
              <img src="/images/OWL_LOGO.svg" alt="OWL Logo" className="h-8 w-auto mr-2" />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
              <button
                onClick={() => setActiveModal({ type: 'settings' })}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Hours"
            value={totalHours.toFixed(1)}
            icon={Clock}
            color="blue"
            subtitle="this period"
          />
          <StatsCard
            title="Estimated Earnings"
            value={`${data.settings.currency}${estimatedEarnings.toFixed(2)}`}
            icon={TrendingUp}
            color="green"
            subtitle={`at ${data.settings.currency}${data.settings.hourlyRate}/hr`}
          />
          <StatsCard
            title="Total Expenses"
            value={`${data.settings.currency}${totalExpenses.toFixed(2)}`}
            icon={DollarSign}
            color="red"
            subtitle={`${data.expenses.length} entries`}
          />
          <StatsCard
            title="Net Earnings"
            value={`${data.settings.currency}${netEarnings.toFixed(2)}`}
            icon={Calendar}
            color={netEarnings >= 0 ? "green" : "red"}
            subtitle="after expenses"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveModal({ type: 'work' })}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Log Work Hours
            </button>
            <button
              onClick={() => setActiveModal({ type: 'note' })}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Add Note
            </button>
            <button
              onClick={() => setActiveModal({ type: 'expense' })}
              className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity data={data} />
      </div>

      {/* Modals */}
      {activeModal && activeModal.type === 'work' && (
        <WorkEntryForm
          onSubmit={addWorkEntry}
          onClose={() => setActiveModal(null)}
          tasks={data.settings.tasks}
          defaultDate={activeModal.date}
        />
      )}
      {activeModal && activeModal.type === 'note' && (
        <NoteForm
          onSubmit={addNote}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal && activeModal.type === 'expense' && (
        <ExpenseForm
          onSubmit={addExpense}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal && activeModal.type === 'settings' && (
        <SettingsPanel
          settings={data.settings}
          onSave={(newSettings) => {
            updateData({ ...data, settings: newSettings });
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
          onImportData={(imported) => updateData(imported)}
        />
      )}

      {/* Drawer laterale per gestione ore lavorate */}
      <WorkHoursDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default Dashboard;