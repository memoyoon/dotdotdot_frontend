// Chrome beforeinstallprompt 이벤트 타입 (간단 버전)
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// iOS Safari 전용 속성 확장
export interface IOSNavigator extends Navigator {
  standalone?: boolean; // 존재하면 true/false
}