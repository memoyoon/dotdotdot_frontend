import type { IOSNavigator } from '../../../types/pwa';
import { useMemo } from 'react';

export default function IOSAddToHomeHint() {
  // UA 체크 (간단 버전)
  const isIOS = useMemo(() => /iphone|ipad|ipod/i.test(navigator.userAgent), []);

  // 설치(standalone) 상태 감지: 표준 + iOS 전용 모두 지원
  const isStandalone = useMemo(() => {
    const byDisplayMode =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches;

    const byIOSStandalone =
      (navigator as IOSNavigator).standalone === true; // iOS Safari

    return Boolean(byDisplayMode || byIOSStandalone);
  }, []);

  if (!isIOS || isStandalone) return null;

  return (
    <div style={{ padding: 8, fontSize: 12, opacity: 0.7 }}>
      사파리 <strong>공유</strong> 버튼(📤)을 눌러 <strong>홈 화면에 추가</strong>를 선택하세요.
    </div>
  );
}
