import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'from-green-400 to-emerald-500',
  size = 'md',
  showLabel = true
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
          <span>{current} of {total} completed</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;