import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 허용
    port: 5173,
    strictPort: true,
    // HMR WebSocket 설정 (Nginx가 SSL 처리)
    hmr: {
      protocol: 'wss',
      host: 'climbing-dev.kro.kr',
      port: 443,
      clientPort: 443
    },
    // 특정 호스트 명시적으로 허용
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'climbing-dev.kro.kr',
      'react-app-alb-1372513951.ap-northeast-2.elb.amazonaws.com',
      '.elb.amazonaws.com',  // 모든 ELB 도메인
      '.amazonaws.com',      // 모든 AWS 도메인
      '.kro.kr'              // 모든 kro.kr 도메인
    ],
    // 백엔드 API 프록시 설정
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          utils: ['axios', 'react-hook-form']
        }
      }
    }
  }
})
