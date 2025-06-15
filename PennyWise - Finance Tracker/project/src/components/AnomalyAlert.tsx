import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { Expense } from '../types/expense';

interface AnomalyAlertProps {
  expense: Expense;
  anomaly: {
    reason: string;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  };
}

export function AnomalyAlert({ expense, anomaly }: AnomalyAlertProps) {
  const severityConfig = {
    low: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    medium: {
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    high: {
      icon: AlertOctagon,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  };

  const config = severityConfig[anomaly.severity];
  const Icon = config.icon;

  return (
    <div className={`mt-2 p-3 rounded-lg ${config.bg} ${config.border} border`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
        <div>
          <p className={`text-sm font-medium ${config.color}`}>
            {anomaly.reason}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {anomaly.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
}