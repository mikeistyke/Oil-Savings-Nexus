import { useContext } from 'react';
import { ExecutiveCorruptionContext } from '../context/ExecutiveCorruptionContext';

export function useExecutiveCorruption() {
  const context = useContext(ExecutiveCorruptionContext);

  if (!context) {
    throw new Error('useExecutiveCorruption must be used within an ExecutiveCorruptionProvider');
  }

  return context;
}