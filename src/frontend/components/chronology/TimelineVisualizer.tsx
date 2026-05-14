import React from 'react';
import { TimelineVisualizerProps, TimelinePointProps } from './types';
import { motion } from 'framer-motion';
import { ChronologyData } from '@/shared/types/expression';
import { MousePointer2, ArrowRight, ArrowLeft } from 'lucide-react';


export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ data }) => {
  return (
    <div className="relative mb-12 p-10 rounded-3xl bg-black/40 border border-white/10 overflow-hidden group">
      {/* Timeline Rail */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />
      
      {/* Animated Flow Particles */}
      <div className="absolute top-1/2 left-0 w-full h-1 overflow-hidden -translate-y-1/2 opacity-30">
        <motion.div 
          animate={{ x: [0, 1000] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="flex gap-20"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-20 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          ))}
        </motion.div>
      </div>

      <div className="relative flex justify-between items-center h-48">
        {/* Past Markers */}
        <div className="flex gap-8 -translate-x-1/4">
          <TimelinePoint module={data.retrospective.pastPerfect} position="bottom" color="rose" />
          <TimelinePoint module={data.retrospective.pastSimple} position="top" color="orange" />
        </div>

        {/* Center Indicator (Present) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-white"
          />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              NOW_ACTIVE
            </span>
          </div>
        </div>

        {/* Present Markers */}
        <div className="flex gap-8">
          <TimelinePoint module={data.active.presentPerfect} position="bottom" color="teal" />
          <TimelinePoint module={data.active.presentSimple} position="top" color="emerald" />
        </div>

        {/* Future Markers */}
        <div className="flex gap-8 translate-x-1/4">
          <TimelinePoint module={data.projection.futureSimple} position="top" color="blue" />
        </div>
      </div>

      {/* Axis Labels */}
      <div className="flex justify-between mt-8 pt-8 border-t border-white/5 px-4 font-mono text-[9px] uppercase tracking-[0.2em] opacity-40">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3 h-3" />
          HISTORICAL_DATA_FLOW
        </div>
        <div>TEMPORAL_EQUILIBRIUM</div>
        <div className="flex items-center gap-2">
          PREDICTIVE_TRAJECTORY
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

const TimelinePoint: React.FC<TimelinePointProps> = ({ module, position, color }) => {
  const colorMap: Record<string, string> = {
    rose: 'bg-rose-500 shadow-rose-500/40',
    orange: 'bg-orange-500 shadow-orange-500/40',
    teal: 'bg-teal-500 shadow-teal-500/40',
    emerald: 'bg-emerald-500 shadow-emerald-500/40',
    blue: 'bg-blue-500 shadow-blue-500/40'
  };

  return (
    <div className={`relative flex flex-col items-center ${position === 'top' ? 'justify-end pb-4' : 'justify-start pt-4'}`}>
      <motion.div 
        whileHover={{ scale: 1.2 }}
        className={`w-3 h-3 rounded-full ${colorMap[color]} shadow-lg cursor-help transition-transform`}
      />
      
      <div className={`absolute ${position === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} w-32 text-center`}>
        <h5 className="text-[10px] font-bold text-white/80 uppercase tracking-tighter mb-1 leading-none">
          {module.tense}
        </h5>
        <p className="text-[8px] text-white/40 italic line-clamp-1">
          "{module.example}"
        </p>
      </div>

      {/* Connection Line */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-[1px] h-4 bg-gradient-to-${position === 'top' ? 't' : 'b'} from-white/20 to-transparent`} />
    </div>
  );
};
