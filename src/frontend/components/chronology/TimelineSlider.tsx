import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { TimelineSliderProps } from './types';
import { ChronologyModule } from '@/shared/types/expression';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const TimelineSlider: React.FC<TimelineSliderProps> = ({ data, activeModule, onModuleChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Flatten data into ordered points
  const points = useMemo(() => [
    { module: data.retrospective.pastPerfect, label: 'Past Perfect', color: 'bg-red-500', zone: 'retrospective' },
    { module: data.retrospective.pastSimple, label: 'Past Simple', color: 'bg-orange-500', zone: 'retrospective' },
    { module: data.active.presentPerfect, label: 'Present Perfect', color: 'bg-blue-500', zone: 'active' },
    { module: data.active.presentSimple, label: 'Present Simple', color: 'bg-cyan-500', zone: 'active' },
    { module: data.projection.futureSimple, label: 'Future Simple', color: 'bg-emerald-500', zone: 'projection' },
  ], [data]);

  const activeIndex = points.findIndex(p => p.module.tense === activeModule.tense);
  
  // Calculate drag constraints and mapping
  const handleDrag = (_: unknown, info: PanInfo) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const x = info.point.x - containerRef.current.getBoundingClientRect().left;
    const progress = Math.min(Math.max(x / width, 0), 1);
    const index = Math.round(progress * (points.length - 1));
    
    if (points[index] && points[index].module.tense !== activeModule.tense) {
      onModuleChange(points[index].module);
    }
  };

  return (
    <div className="relative py-20 px-4 group">
      {/* Visual Labels */}
      <div className="flex justify-between mb-8 opacity-40 font-mono text-sm uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-3 h-3" />
          Retrospective
        </div>
        <div className="text-emerald-400">Live_Active</div>
        <div className="flex items-center gap-2">
          Projection
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      <div ref={containerRef} className="relative h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-visible">
        {/* Rail Markers */}
        <div className="absolute inset-0 flex justify-between items-center px-0">
          {points.map((point, i) => (
            <div 
              key={i} 
              className={`w-1 h-4 rounded-full transition-all duration-500 ${
                activeIndex === i ? 'bg-white scale-y-150 shadow-[0_0_10px_white]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Zone Indicators */}
        <div className="absolute -top-10 inset-x-0 flex justify-between pointer-events-none">
           {['PAST', 'PRESENT', 'FUTURE'].map((label, i) => (
             <span key={i} className="text-sm font-black tracking-[0.5em] opacity-20">{label}</span>
           ))}
        </div>

        {/* Draggable Cursor */}
        <motion.div
          drag="x"
          dragMomentum={false}
          dragElastic={0.05}
          dragConstraints={containerRef}
          onDrag={handleDrag}
          animate={{ x: `${(activeIndex / (points.length - 1)) * 100}%` }}
          className="absolute top-1/2 -mt-6 -ml-6 w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
        >
          {/* Outer Glow */}
          <motion.div 
            animate={{ 
              backgroundColor: points[activeIndex].color.replace('bg-', 'rgb('), // This is a hack, I'll use CSS vars
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 rounded-full opacity-20 blur-xl ${points[activeIndex].color}`}
          />
          
          {/* Main Cursor Handle */}
          <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center border-2 border-black/20">
            <div className={`w-2 h-2 rounded-full ${points[activeIndex].color}`} />
          </div>

          {/* Floating Tense Indicator */}
          <div className="absolute -top-8 whitespace-nowrap bg-white text-black text-sm font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter">
            {points[activeIndex].label}
          </div>
        </motion.div>

        {/* Active Track Highlight */}
        <motion.div 
          initial={false}
          animate={{ width: `${(activeIndex / (points.length - 1)) * 100}%` }}
          className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-transparent to-white/20`}
        />
      </div>
    </div>
  );
};
