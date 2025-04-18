export interface EdgeWeight {
    timeSpeedFactor: number; // used for Dijkstra
    baseDistance: number;    // original unmodified distance (optional for reference)
    weather?: string;
    timeOfDay?: string;
    accidentFactor?: number;
    affected?: boolean;      // for visual highlighting
  }