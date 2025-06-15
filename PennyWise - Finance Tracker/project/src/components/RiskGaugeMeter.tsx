import React from 'react';
import { AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';

interface RiskGaugeMeterProps {
  monthlyIncome: number;
  totalExpenses: number;
}

export function RiskGaugeMeter({ monthlyIncome, totalExpenses }: RiskGaugeMeterProps) {
  const expenseRatio = totalExpenses / monthlyIncome;
  
  // Calculate risk level
  const getRiskLevel = () => {
    if (expenseRatio <= 0.5) return 'low';
    if (expenseRatio <= 0.8) return 'medium';
    return 'high';
  };

  const riskLevel = getRiskLevel();
  const percentage = Math.min(expenseRatio * 100, 100);

  const riskConfig = {
    low: {
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      icon: ShieldCheck,
      label: 'Low Risk',
      description: 'Your spending is well under control!'
    },
    medium: {
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      icon: AlertTriangle,
      label: 'Medium Risk',
      description: 'Consider reducing non-essential expenses.'
    },
    high: {
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      icon: AlertOctagon,
      label: 'High Risk',
      description: 'Urgent action needed to reduce expenses!'
    }
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-xl ${config.bgColor} ${config.borderColor} border`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
        </div>
        <span className={`text-sm ${config.color}`}>
          {percentage.toFixed(1)}% of income spent
        </span>
      </div>

      {/* Gauge Meter */}
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            riskLevel === 'low' ? 'bg-green-500' :
            riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
        {/* Threshold markers */}
        <div className="absolute top-0 left-1/2 h-full border-l border-gray-400 opacity-30" />
        <div className="absolute top-0 left-[80%] h-full border-l border-gray-400 opacity-30" />
      </div>

      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>80%</span>
        <span>100%</span>
      </div>

      <p className={`mt-4 text-sm ${config.color}`}>
        {config.description}
      </p>
    </div>
  );
}