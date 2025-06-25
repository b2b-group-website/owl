import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppData } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

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
    <Dashboard 
      data={data} 
      updateData={setData} 
      onLogout={logout} 
    />
  );
}

export default App;