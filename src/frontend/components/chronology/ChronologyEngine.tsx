import React, { useState } from 'react';
import { ChronologyEngineProps } from './types';
import { motion } from 'framer-motion';
import { ChronologyData, ChronologyModule } from '@/shared/types/expression';
import { ChronologyHeader } from './ChronologyHeader';
import { TemporalZone } from './TemporalZone';
import { TimelineSlider } from './TimelineSlider';
import { LiveModuleView } from './LiveModuleView';
import { GrammarAtlasCTA } from './GrammarAtlasCTA';
import { AlertCircle } from 'lucide-react';

export const ChronologyEngine: React.FC<ChronologyEngineProps> = ({ data }) => {
  const [activeModule, setActiveModule] = useState<ChronologyModule | null>(
    data?.active?.presentSimple || null
  );

  if (!data) {
    return (
      <div className="p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Ready for Analysis</h3>
        <p className="text-white/40 max-w-md">
          This expression needs a quick check to build your personalized Grammar Guide.
        </p>
      </div>
    );
  }

  // Map active module to an accent color for the LiveView
  const getAccentColor = () => {
    if (!activeModule) return 'text-emerald-400';
    const tense = activeModule.tense.toLowerCase();
    if (tense.includes('past')) return 'text-orange-400';
    if (tense.includes('present')) return 'text-emerald-400';
    if (tense.includes('future')) return 'text-blue-400';
    return 'text-emerald-400';
  };

  return (
    <div className="space-y-12 pb-12">
      <ChronologyHeader />
      
      {/* Interactive Timeline Simulation Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-mono text-white/40 uppercase tracking-[0.3em]">
            Interactive_Timeline
          </span>
        </div>

        {activeModule && (
          <LiveModuleView 
            module={activeModule} 
            accentColor={getAccentColor()} 
          />
        )}

        <TimelineSlider 
          data={data} 
          activeModule={activeModule || data.active.presentSimple}
          onModuleChange={setActiveModule}
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        <TemporalZone 
          id="retrospective" 
          title="Past Timeline" 
          subtitle="Past & Historical Context"
          data={data.retrospective}
        />
        
        <TemporalZone 
          id="active" 
          title="Present Actions" 
          subtitle="Present Continuity"
          data={data.active}
        />
        
        <TemporalZone 
          id="projection" 
          title="Future Path" 
          subtitle="Future Trajectory"
          data={data.projection}
        />
      </div>

      <GrammarAtlasCTA />
      
      {/* Visual Footer Branding */}
      <div className="flex justify-between items-center opacity-20 font-mono text-sm tracking-[0.5em] pt-8 border-t border-white/5">
        <div>SYSTEM_IDENTIFIER: 0xCHRONO_V4</div>
        <div>STABLE_TEMPORAL_EQUILIBRIUM_DETECTED</div>
        <div>2026_LINGUISTIC_CORE</div>
      </div>
    </div>
  );
};
