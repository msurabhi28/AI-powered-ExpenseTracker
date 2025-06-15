import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationProps {
  onDelete: () => void;
  className?: string;
}

export function DeleteConfirmation({ onDelete, className = '' }: DeleteConfirmationProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete the selected item?')) {
      onDelete();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`p-2 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 ${className}`}
    >
      <Trash2 size={18} />
    </button>
  );
}