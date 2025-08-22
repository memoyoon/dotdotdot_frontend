import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 새 버전 배포 시 SW 자동 업데이트
      registerType: 'autoUpdate',
      // SW 등록 스니펫을 자동 삽입 (main.tsx에 별도 코드 불필요)
      injectRegister: 'auto',
     // iOS 터치 아이콘/파비콘 등 정적 자산 포함
      includeAssets: [
        'icons/favicon-16.png',
        'icons/favicon-32.png',
        'icons/apple-touch-icon-76.png',
        'icons/apple-touch-icon-120.png',
        'icons/apple-touch-icon-152.png',
        'icons/apple-touch-icon-180.png'
      ],
       // 웹 앱 매니페스트
      manifest: {
        name: 'Memo Timetable (Local)',
        short_name: 'MemoLocal',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          // Android/Chrome PWA 기본 아이콘
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          // iOS 홈화면 아이콘 (겸용)
          { src: 'icons/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png', purpose: 'any maskable' }
        ]
      },
  
      // SPA 라우팅 오프라인 폴백
      workbox: {
        navigateFallback: '/index.html'
      }
    })
  ],
});
