import React from 'react';
import { AttendanceRecord, AttendanceType } from '../types';
import { CheckCircle2, LogOut, MessageSquareQuote } from 'lucide-react';

interface AttendanceListProps {
  records: AttendanceRecord[];
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-slate-400">Belum ada data absensi hari ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-800 text-lg px-1">Riwayat Terbaru</h3>
      <div className="space-y-3">
        {records.map((record) => (
          <div 
            key={record.id} 
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-3 animate-fade-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${record.type === AttendanceType.CHECK_IN ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                  {record.type === AttendanceType.CHECK_IN ? <CheckCircle2 size={20} /> : <LogOut size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{record.teacherName}</h4>
                  <p className="text-xs text-slate-500 font-medium">{record.type === AttendanceType.CHECK_IN ? 'Masuk' : 'Pulang'}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                {record.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {record.aiMessage && (
              <div className="bg-indigo-50 p-3 rounded-lg flex gap-3 items-start">
                <MessageSquareQuote className="text-indigo-500 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-indigo-700 text-sm italic leading-relaxed">"{record.aiMessage}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};