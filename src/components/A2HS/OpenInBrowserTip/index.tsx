export default function OpenInBrowserTip() {
  const ua = navigator.userAgent.toLowerCase();
  const isInApp =
    ua.includes('naver') || ua.includes('kakaotalk') || ua.includes('fbav') || ua.includes('line');

  if (!isInApp) return null;

  const openInChrome = () => {
    // Android 전용: 크롬으로 열기 (일부 환경에서만 동작)
    const url = location.href.replace(/^https?:\/\//, '');
    // intent://HOST/PATH#Intent;scheme=https;package=com.android.chrome;end
    location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <div style={{ padding: 8, fontSize: 12 }}>
      인앱 브라우저에서는 홈 화면 추가가 제한될 수 있어요.{' '}
      <button onClick={openInChrome}>Chrome에서 열기</button>
      <div style={{ opacity: 0.7, marginTop: 4 }}>
        iOS는 사파리로 열어 공유버튼 → <strong>홈 화면에 추가</strong>를 눌러주세요.
      </div>
    </div>
  );
}
