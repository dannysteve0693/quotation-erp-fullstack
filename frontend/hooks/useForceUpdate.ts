import { useCallback, useState } from 'react';

export function useForceUpdate() {
  const [, setUpdateCount] = useState(0);
  
  const forceUpdate = useCallback(() => {
    setUpdateCount(prev => prev + 1);
  }, []);
  
  return forceUpdate;
}

export function useStateWithForceUpdate<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const forceUpdate = useForceUpdate();
  
  const setStateWithUpdate = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
    forceUpdate();
  }, [forceUpdate]);
  
  return [state, setStateWithUpdate];
}