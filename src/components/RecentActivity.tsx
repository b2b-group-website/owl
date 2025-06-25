import React from 'react';
import { Clock, FileText, DollarSign, Calendar } from 'lucide-react';
import { AppData } from '../types';

interface RecentActivityProps {
  data: AppData;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
  // Combine all activities and sort by date
  const allActivities = [
    ...data.workEntries.map(entry => ({
      ...entry,
      type: 'work' as const,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50',
      title: `${entry.hours}h - ${entry.task}`,
      subtitle: entry.description,
    })),
    ...data.notes.map(note => ({
      ...note,
      type: 'note' as const,
      icon: FileText,
      color: 'text-green-600 bg-green-50',
      title: note.title,
      subtitle: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
    })),
    ...data.expenses.map(expense => ({
      ...expense,
      type: 'expense' as const,
      icon: DollarSign,
      color: 'text-orange-600 bg-orange-50',
      title: `${data.settings.currency}${expense.amount.toFixed(2)} - ${expense.category}`,
      subtitle: expense.description,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  if (allActivities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activity yet. Start by logging your work hours!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {allActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500 truncate">{activity.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;