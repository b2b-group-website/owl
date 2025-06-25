import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppData } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/CalendarPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkEntriesPage from './components/WorkEntriesPage';
import CalculatorPage from './components/CalculatorPage';

const initialData: AppData = {
  workEntries: [],
  notes: [],
  expenses: [],
  settings: {
    hourlyRate: 25,
    currency: '$',
    tasks: [
      'Development',
      'Design',
      'Meeting',
      'Research',
      'Documentation',
      'Testing',
      'Support',
      'Admin'
    ],
  },
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [data, setData] = useLocalStorage<AppData>('openWorkLog_data', initialData);

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard data={data} updateData={setData} onLogout={logout} />} />
        <Route path="/work-entries" element={<WorkEntriesPage workEntries={data.workEntries} updateWorkEntries={entries => setData({ ...data, workEntries: entries })} />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/calendar" element={<CalendarPage workEntries={data.workEntries} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;