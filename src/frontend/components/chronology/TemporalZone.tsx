import React from 'react';
import { TemporalZoneProps } from './types';
import { motion } from 'framer-motion';
import { ChronologyModule } from '@/shared/types/expression';
import { LucideIcon, Info, ChevronRight, History, Play, FastForward } from 'lucide-react';
import { TagChip } from '../ui/TagChip';
import { TagList } from '../ui/TagList';


const ZONE_CONFIG = {
  retrospective: {
    icon: History,
    color: 'from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-500/20',
    accentColor: 'text-red-400',
    glowColor: 'bg-red-500/5',
    label: 'COMPLETED_ACTIONS_DETECTOR',
    indicator: 'PAST → EARLIER PAST'
  },
  active: {
    icon: Play,
    color: 'from-blue-500/10 to-teal-500/10',
    borderColor: 'border-blue-500/20',
    accentColor: 'text-blue-400',
    glowColor: 'bg-blue-500/5',
    label: 'PRESENT_EFFECT_ENGINE',
    indicator: 'PAST ACTION → PRESENT EFFECT'
  },
  projection: {
    icon: FastForward,
    color: 'from-emerald-500/10 to-green-500/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
    glowColor: 'bg-emerald-500/5',
    label: 'FUTURE_TRAJECTORY_ENGINE',
    indicator: 'ACTION NOT REALIZED YET'
  }
};

export const TemporalZone: React.FC<TemporalZoneProps> = ({ id, title, subtitle, data }) => {
  const config = ZONE_CONFIG[id];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: id === 'retrospective' ? -20 : id === 'projection' ? 20 : 0 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-[2.5rem] bg-gradient-to-br ${config.color} border ${config.borderColor} backdrop-blur-xl overflow-hidden flex-1 group`}
    >
      {/* Background Aura */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${config.glowColor} blur-[120px] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000`} />
      
      {/* Zone Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${config.accentColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-1">{title}</h3>
            <p className="text-sm font-mono opacity-50 tracking-widest uppercase">{config.label}</p>
          </div>
        </div>
        <div className="text-sm font-mono opacity-40 bg-black/20 px-2 py-1 rounded">
          {config.indicator}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(data).map(([key, module], index) => (
          <TemporalModule key={key} module={module} accentColor={config.accentColor} index={index} />
        ))}
      </div>

      {/* Subtle Background Title */}
      <div className="absolute -bottom-4 -right-4 text-8xl font-black text-white/5 pointer-events-none select-none uppercase italic">
        {id.slice(0, 4)}
      </div>
    </motion.div>
  );
};

const TemporalModule: React.FC<{ module: ChronologyModule; accentColor: string; index: number }> = ({ module, accentColor, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-sm font-bold uppercase tracking-wider ${accentColor}`}>
          {module.tense}
        </h4>
        <TagList 
          tags={module.grammarTags || []} 
          limit={2} 
          tagClassName="text-sm font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-60"
          showCount={false}
        />
      </div>

      <div className="relative mb-4 p-4 rounded-xl bg-black/30 border border-white/5 group-hover:border-white/10 transition-colors">
        <p className="text-lg font-medium text-white italic leading-relaxed">
          "{module.example}"
        </p>
        <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
          <Info className="w-3 h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm text-white/70 leading-relaxed mb-2">
            {module.simpleExplanation}
          </p>
          <div className="flex items-center gap-2 text-sm font-mono text-white/30 uppercase tracking-tighter">
            <ChevronRight className="w-3 h-3" />
            {module.technicalExplanation}
          </div>
        </div>

        {module.visualIndicators && module.visualIndicators.length > 0 && (
          <TagList 
            tags={module.visualIndicators} 
            variant="glass" 
            className="pt-2 border-t border-white/5" 
          />
        )}
      </div>
    </motion.div>
  );
};
