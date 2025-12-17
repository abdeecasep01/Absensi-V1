import React from 'react';
import { AttendanceRecord, AttendanceType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users, LogIn, LogOut } from 'lucide-react';

interface DashboardProps {
  records: AttendanceRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  // Calculate Stats
  const checkIns = records.filter(r => r.type === AttendanceType.CHECK_IN).length;
  const checkOuts = records.filter(r => r.type === AttendanceType.CHECK_OUT).length;
  const uniqueTeachers = new Set(records.map(r => r.teacherName)).size;

  const data = [
    { name: 'Masuk', value: checkIns },
    { name: 'Pulang', value: checkOuts },
  ];

  const COLORS = ['#10b981', '#f97316'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full mb-2">
            <Users size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{uniqueTeachers}</span>
          <span className="text-xs text-slate-500">Guru Hadir</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full mb-2">
            <LogIn size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{checkIns}</span>
          <span className="text-xs text-slate-500">Total Masuk</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-full mb-2">
            <LogOut size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{checkOuts}</span>
          <span className="text-xs text-slate-500">Total Pulang</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Statistik Harian</h3>
        <div className="h-64 w-full">
          {checkIns + checkOuts > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
               Belum ada data untuk ditampilkan grafik
             </div>
          )}
        </div>
      </div>
    </div>
  );
};