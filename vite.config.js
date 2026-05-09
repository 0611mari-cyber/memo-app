import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // PWA設定：ホーム画面追加とオフライン動作を有効にする
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'メモ帳',
        short_name: 'メモ帳',
        description: 'シンプルなメモアプリ',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone', // ブラウザのバーを非表示にしてアプリ風に表示
        start_url: '/',
        lang: 'ja',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      // オフラインでも使えるようにアプリのファイルをキャッシュする
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    }),
  ],
})
