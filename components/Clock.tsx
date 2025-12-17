import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-6">
      <div className="text-4xl font-bold text-slate-800 tabular-nums tracking-tight">
        {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-slate-500 text-sm font-medium mt-1">
        {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
};