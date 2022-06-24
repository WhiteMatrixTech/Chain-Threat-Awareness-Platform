import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export function useDeviceSize(divider = 768) {
  const { width, height } = useWindowSize();

  const isSmallDevice = useMemo(() => {
    return width < divider;
  }, [divider, width]);

  return {
    width,
    height,
    isSmallDevice
  };
}
