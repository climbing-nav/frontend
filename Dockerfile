# React + Vite 개발서버용 Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json (또는 yarn.lock) 복사
COPY package*.json ./

# 의존성 설치 (개발 의존성 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# Vite 개발서버 포트 노출
EXPOSE 5173

# 개발서버 실행 (외부 접근 허용)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
