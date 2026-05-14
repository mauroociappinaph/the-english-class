import { ChronologyData, ChronologyModule } from '@/shared/types/expression';

export interface ChronologyEngineProps {
  data?: ChronologyData | null;
}

export interface TemporalZoneProps {
  id: 'retrospective' | 'active' | 'projection';
  title: string;
  subtitle: string;
  data: Record<string, ChronologyModule>;
}

export interface TimelineVisualizerProps {
  data: ChronologyData;
}

export interface TimelinePointProps {
  module: ChronologyModule;
  position: 'top' | 'bottom';
  color: string;
}
