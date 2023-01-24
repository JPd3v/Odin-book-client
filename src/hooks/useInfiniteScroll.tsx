import { useState, useEffect } from 'react';

export default function useInfiniteScroll(
  elementRef: React.MutableRefObject<HTMLDivElement | null>
) {
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

      setIsOnScreen(true);
      intersectionObserver.disconnect();
    });

    return () => {
      return intersectionObserver.disconnect();
    };
  }, [elementRef]);

  return isOnScreen;
}
