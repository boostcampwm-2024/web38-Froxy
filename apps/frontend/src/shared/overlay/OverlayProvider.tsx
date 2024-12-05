import { Fragment, useCallback, useMemo, useState } from 'react';
import { OverlayContext } from './useOverlay';

export const OverlayProvider = ({ children }: { children: React.ReactNode }) => {
  const [overlays, setOverlays] = useState<Map<string, React.ReactNode>>(new Map());

  const mount = useCallback((id: string, overlay: React.ReactNode) => {
    setOverlays((prev) => {
      const cloned = new Map(prev);
      cloned.set(id, overlay);
      return cloned;
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setOverlays((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const value = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={value}>
      {children}
      {[...overlays.entries()].map(([id, overlay]) => {
        return <Fragment key={id}>{overlay}</Fragment>;
      })}
    </OverlayContext.Provider>
  );
};
