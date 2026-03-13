import React, { createContext, useMemo } from 'react';
import {
  executiveCorruptionSections,
  executiveCorruptionSources,
  executiveCorruptionThesis,
  type ExecutiveCorruptionSection,
  type ExecutiveCorruptionSource,
} from '../content/executiveCorruption';

export interface ExecutiveCorruptionContextValue {
  thesis: string;
  sections: ExecutiveCorruptionSection[];
  sources: ExecutiveCorruptionSource[];
}

export const ExecutiveCorruptionContext = createContext<ExecutiveCorruptionContextValue | null>(null);

interface ExecutiveCorruptionProviderProps {
  children: React.ReactNode;
}

export function ExecutiveCorruptionProvider({ children }: ExecutiveCorruptionProviderProps) {
  const value = useMemo<ExecutiveCorruptionContextValue>(() => ({
    thesis: executiveCorruptionThesis,
    sections: executiveCorruptionSections,
    sources: executiveCorruptionSources,
  }), []);

  return (
    <ExecutiveCorruptionContext.Provider value={value}>
      {children}
    </ExecutiveCorruptionContext.Provider>
  );
}