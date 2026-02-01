
export interface DiseaseAnalysis {
  cropName: string;
  status: 'Healthy' | 'Infected' | 'Warning';
  diseaseName?: string;
  confidence: number;
  description: string;
  treatment: string[];
  preventativeMeasures: string[];
}

export interface SensorData {
  timestamp: string;
  moisture: number;
  humidity: number;
  temperature: number;
  waterLevel: number;
}

export interface IrrigationState {
  isAutoMode: boolean;
  isPumpOn: boolean;
  threshold: number;
}

export type ThemeType = 
  | 'auto'
  | 'bio-synth' 
  | 'midnight' 
  | 'autumn' 
  | 'nordic' 
  | 'obsidian'
  | 'cyberpunk'
  | 'desert'
  | 'forest'
  | 'ocean'
  | 'sakura'
  | 'volcanic'
  | 'electric'
  | 'matcha'
  | 'solar'
  | 'mint';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
}
