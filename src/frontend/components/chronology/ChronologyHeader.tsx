import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Zap, Cpu } from 'lucide-react';

export const ChronologyHeader: React.FC = () => {
  return (
    <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden group">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-blue-500/20 transition-colors duration-1000" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">Chronology</h2>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                VGE v4.1
              </span>
            </div>
            <p className="text-blue-200/60 font-medium tracking-wide">Temporal Analysis • Visual Grammar Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-3">
          <StatusBadge icon={<Activity className="w-3 h-3" />} label="TEMPORAL_ENGINE_ACTIVE" color="emerald" />
          <StatusBadge icon={<Cpu className="w-3 h-3" />} label="TIMEFLOW_ANALYZER" color="blue" />
          <StatusBadge icon={<Zap className="w-3 h-3" />} label="GRAMMAR_STREAM_CONNECTED" color="amber" />
        </div>
      </div>

      {/* Decorative Scanline */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </div>
  );
};

const StatusBadge: React.FC<{ icon: React.ReactNode; label: string; color: 'emerald' | 'blue' | 'amber' }> = ({ icon, label, color }) => {
  const colors = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors[color]} font-mono text-[10px] tracking-tighter`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
      </span>
      {icon}
      {label}
    </motion.div>
  );
};
