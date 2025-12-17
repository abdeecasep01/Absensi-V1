import React, { useState, useEffect } from 'react';
import { Clock } from './components/Clock';
import { Button } from './components/Button';
import { AttendanceList } from './components/AttendanceList';
import { Dashboard } from './components/Dashboard';
import { AttendanceRecord, AttendanceType } from './types';
import { generateMotivation } from './services/geminiService';
import { LayoutDashboard, UserCheck, School, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'dashboard'>('attendance');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  // Load from local storage on mount (simulating database)
  useEffect(() => {
    const saved = localStorage.getItem('attendanceRecords');
    if (saved) {
      const parsed = JSON.parse(saved).map((r: any) => ({
        ...r,
        timestamp: new Date(r.timestamp)
      }));
      setRecords(parsed);
    }
  }, []);

  // Save to local storage whenever records change
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('attendanceRecords', JSON.stringify(records));
    }
  }, [records]);

  const handleAttendance = async (type: AttendanceType) => {
    if (!name.trim()) {
      alert("Mohon isi nama Bapak/Ibu Guru terlebih dahulu.");
      return;
    }

    setLoading(true);
    setLastMessage(null);

    // AI Integration: Generate motivation message only for CHECK_IN for a positive start,
    // or a closing remark for CHECK_OUT.
    const isMorning = type === AttendanceType.CHECK_IN;
    let aiMsg = undefined;
    
    try {
        // Only fetch AI message if API key is present, otherwise skip gracefully
        if(process.env.API_KEY) {
            aiMsg = await generateMotivation(name, isMorning);
        }
    } catch (e) {
        console.log("AI skipped");
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      teacherName: name,
      type: type,
      timestamp: new Date(),
      aiMessage: aiMsg
    };

    setRecords(prev => [newRecord, ...prev]);
    
    if (aiMsg) {
      setLastMessage(aiMsg);
    } else {
        setLastMessage(type === AttendanceType.CHECK_IN ? "Selamat Datang! Absensi berhasil dicatat." : "Hati-hati di jalan! Absensi pulang berhasil.");
    }

    setLoading(false);
    setName(''); // Reset input

    // Auto-dismiss success message after 5 seconds
    setTimeout(() => setLastMessage(null), 8000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
      {/* Header */}
      <header className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <School size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">AbsenGuru</h1>
            <p className="text-xs text-slate-500 font-medium">Sistem Absensi Cerdas</p>
          </div>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`p-2 rounded-md transition-all ${activeTab === 'attendance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <UserCheck size={20} />
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutDashboard size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {activeTab === 'attendance' ? (
          <div className="space-y-8">
            <Clock />

            {/* Input Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Guru</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={() => handleAttendance(AttendanceType.CHECK_IN)}
                  disabled={loading || !name}
                  isLoading={loading}
                >
                  Masuk
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => handleAttendance(AttendanceType.CHECK_OUT)}
                  disabled={loading || !name}
                  isLoading={loading}
                >
                  Pulang
                </Button>
              </div>
            </div>

            {/* Success Message / AI Quote */}
            {lastMessage && (
              <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-10">
                   <Sparkles size={100} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-indigo-100 text-sm uppercase tracking-wider mb-1">
                    Pesan Harian
                  </h4>
                  <p className="text-lg font-medium leading-relaxed">
                    "{lastMessage}"
                  </p>
                </div>
              </div>
            )}

            <AttendanceList records={records} />
          </div>
        ) : (
          <Dashboard records={records} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-slate-50">
        &copy; {new Date().getFullYear()} AbsenGuru. Dibuat dengan React & Gemini.
      </footer>
    </div>
  );
}