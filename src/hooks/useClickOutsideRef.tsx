import { useEffect, useState } from 'react';

export default function useClickOutsideRef(ref: React.RefObject<HTMLElement>) {
  const [clickedOutside, setClickedOutside] = useState(false);
  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        setClickedOutside((prev) => !prev);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref]);
  return clickedOutside;
}
