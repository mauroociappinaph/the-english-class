export interface GraphNode {
  path: string;
  imports: string[];
  importedBy: string[];
  isExternal: boolean;
  ca?: number; // Afferent Coupling
  ce?: number; // Efferent Coupling
  i?: number;  // Instability
}
