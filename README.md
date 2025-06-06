# Bully 채팅 서버

Bully 웹사이트를 위한 실시간 채팅 서버입니다. Socket.io를 사용하여 실시간 메시지 전송을 지원합니다.

## 🚀 기능

- 실시간 채팅 메시지 전송
- Supabase 데이터베이스 연동
- 온라인 사용자 수 추적
- CORS 설정으로 보안 강화
- 메시지 히스토리 관리

## 📋 요구사항

- Node.js 16.0 이상
- npm 또는 yarn
- Supabase 계정 및 프로젝트

## 🛠 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env` 파일을 생성하고 다음 값들을 설정하세요:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3006
CORS_ORIGINS=http://localhost:3005,http://localhost:3000
```

### 3. Supabase 데이터베이스 설정

메인 프로젝트의 `chat_migration.sql` 파일을 Supabase SQL 에디터에서 실행하여 필요한 테이블을 생성하세요.

### 4. 서버 실행

개발 모드:
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

## 📡 API 엔드포인트

### Health Check
```
GET /health
```
서버 상태와 연결된 사용자 수를 확인할 수 있습니다.

### Stats
```
GET /stats
```
현재 연결된 사용자 목록과 통계를 확인할 수 있습니다.

## 🔌 Socket.io 이벤트

### 클라이언트 → 서버

- `register_user`: 사용자 등록
- `send_message`: 메시지 전송
- `get_messages`: 과거 메시지 요청

### 서버 → 클라이언트

- `new_message`: 새 메시지 브로드캐스트
- `messages_history`: 과거 메시지 히스토리
- `user_count`: 온라인 사용자 수 업데이트
- `error`: 오류 메시지

## 🚨 문제 해결

### 포트 충돌
기본 포트 3006이 사용 중이라면 `.env` 파일에서 다른 포트로 변경하세요.

### CORS 오류
메인 웹사이트의 도메인이 `CORS_ORIGINS`에 포함되어 있는지 확인하세요.

### Supabase 연결 오류
환경 변수의 Supabase URL과 키가 올바른지 확인하고, 테이블이 생성되었는지 확인하세요.

## 📝 로그

서버는 다음과 같은 정보를 콘솔에 로깅합니다:
- 새로운 사용자 연결/해제
- 메시지 전송 내역
- 오류 발생 시 상세 정보

## 🔒 보안

- Row Level Security (RLS)가 활성화된 Supabase 테이블 사용
- CORS를 통한 도메인 접근 제한
- 사용자 ID 검증

## 📈 모니터링

서버 상태는 다음 URL에서 확인할 수 있습니다:
- Health Check: `http://localhost:3006/health`
- Statistics: `http://localhost:3006/stats` #   l i v e c h a t _ k a y n e 
 
 