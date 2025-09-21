// 환경변수 테스트 파일
console.log('=== Environment Variables Test ===')
console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME)
console.log('All VITE_ variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))
console.log('import.meta.env:', import.meta.env)

export const getAppName = () => {
  return import.meta.env.VITE_APP_NAME || '클밍여지도'
}