import { useEffect, useRef } from 'react';
import { setupA2HSButton } from '../../../a2hs';

export default function InstallButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current) setupA2HSButton(ref.current);
  }, []);
  return <button ref={ref} style={{ display: 'none' }}>설치하기</button>;
}
