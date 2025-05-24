#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Bully 채팅 서버 시작 중...${NC}"

# 현재 디렉토리 확인
echo -e "${YELLOW}📁 현재 디렉토리: $(pwd)${NC}"

# 패키지 설치 확인
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 패키지를 설치합니다...${NC}"
    npm install
fi

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo -e "${RED}⚠️  .env 파일이 없습니다. env.example을 참고하여 .env 파일을 생성해주세요.${NC}"
    echo -e "${YELLOW}📄 env.example 파일 내용:${NC}"
    cat env.example
    echo -e "${YELLOW}계속하려면 Enter를 누르세요...${NC}"
    read
    exit 1
fi

echo -e "${GREEN}🌐 서버를 포트 3006에서 시작합니다...${NC}"
echo -e "${CYAN}📊 Health Check: http://localhost:3006/health${NC}"
echo -e "${CYAN}📈 Stats: http://localhost:3006/stats${NC}"
echo -e "${YELLOW}🛑 서버를 중지하려면 Ctrl+C를 누르세요.${NC}"

# 서버 시작
npm run dev 