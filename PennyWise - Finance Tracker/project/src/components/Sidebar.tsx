import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div 
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-white dark:bg-magenta-900 shadow-magenta-xl transition-transform duration-200 ease-in-out z-20`}
    >
      <div className="p-6 space-y-4">
        {isOpen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-magenta-50 dark:hover:bg-magenta-800 transition-colors"
          >
            <X className="w-5 h-5 text-magenta-600 dark:text-magenta-300" />
          </button>
        )}
        <Link 
          to="/" 
          className="block p-2 rounded-lg hover:bg-magenta-50 dark:hover:bg-magenta-800 text-magenta-800 dark:text-magenta-200"
          onClick={onClose}
        >
          Dashboard
        </Link>
        <Link 
          to="/expenses" 
          className="block p-2 rounded-lg hover:bg-magenta-50 dark:hover:bg-magenta-800 text-magenta-800 dark:text-magenta-200"
          onClick={onClose}
        >
          All Expenses
        </Link>
        <Link 
          to="/incomes" 
          className="block p-2 rounded-lg hover:bg-magenta-50 dark:hover:bg-magenta-800 text-magenta-800 dark:text-magenta-200"
          onClick={onClose}
        >
          All Incomes
        </Link>
      </div>
    </div>
  );
}