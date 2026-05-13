import React from 'react';
import { motion } from 'framer-motion';
import { ChronologyData } from '@/shared/types/expression';
import { ChronologyHeader } from './ChronologyHeader';
import { TemporalZone } from './TemporalZone';
import { TimelineVisualizer } from './TimelineVisualizer';
import { GrammarAtlasCTA } from './GrammarAtlasCTA';
import { AlertCircle } from 'lucide-react';

interface ChronologyEngineProps {
  data?: ChronologyData | null;
}

export const ChronologyEngine: React.FC<ChronologyEngineProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Temporal Data Not Calibrated</h3>
        <p className="text-white/40 max-w-md">
          This expression requires a fresh linguistic analysis to initialize the Visual Grammar Engine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <ChronologyHeader />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <TimelineVisualizer data={data} />
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <TemporalZone 
          id="retrospective" 
          title="Retrospective Zone" 
          subtitle="Past & Historical Context"
          data={data.retrospective}
        />
        
        <TemporalZone 
          id="active" 
          title="Active Flow" 
          subtitle="Present Continuity"
          data={data.active}
        />
        
        <TemporalZone 
          id="projection" 
          title="Projection Engine" 
          subtitle="Future Trajectory"
          data={data.projection}
        />
      </div>

      <GrammarAtlasCTA />
      
      {/* Visual Footer Branding */}
      <div className="flex justify-between items-center opacity-20 font-mono text-[8px] tracking-[0.5em] pt-8 border-t border-white/5">
        <div>SYSTEM_IDENTIFIER: 0xCHRONO_V4</div>
        <div>STABLE_TEMPORAL_EQUILIBRIUM_DETECTED</div>
        <div>2026_LINGUISTIC_CORE</div>
      </div>
    </div>
  );
};
