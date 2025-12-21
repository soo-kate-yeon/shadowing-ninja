# 빠른 배포 가이드

프로젝트를 5분 안에 배포하는 방법입니다.

## Vercel 배포 (권장)

### 1단계: GitHub 저장소 연결

1. [Vercel Dashboard](https://vercel.com/new) 접속
2. "Import Git Repository" 클릭
3. 이 저장소 선택
4. "Import" 클릭

### 2단계: 환경 변수 설정

다음 환경 변수를 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyxxx...
```

### 3단계: 배포

"Deploy" 버튼 클릭 → 자동 배포 시작!

---

## GitHub Actions 설정 (CI/CD)

### 1단계: Vercel Token 생성

1. [Vercel Account Settings](https://vercel.com/account/tokens)
2. "Create Token" 클릭
3. Token 복사

### 2단계: GitHub Secrets 설정

Repository → Settings → Secrets and variables → Actions

다음 secrets 추가:

```
VERCEL_TOKEN=<your-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
SUPABASE_ACCESS_TOKEN=<your-supabase-token>
SUPABASE_PROJECT_ID=<your-project-id>
```

**Vercel IDs 찾기:**

```bash
# 프로젝트 연결 후
cat .vercel/project.json
```

**Supabase Token 생성:**

1. [Supabase Access Tokens](https://app.supabase.com/account/tokens)
2. "Generate new token" 클릭

### 3단계: 푸시하면 자동 배포!

```bash
git push origin main  # → Production 배포
```

PR 생성 시 → Preview 배포 자동 생성

---

## Docker 로컬 실행

```bash
# 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# Docker Compose 실행
docker-compose up -d

# 앱 접속
open http://localhost:3000
```

---

## 트러블슈팅

### 빌드 실패
```bash
npm run build  # 로컬에서 테스트
```

### 환경 변수 누락
`.env.example` 파일 참고하여 모든 변수 설정 확인

### Health Check
```bash
curl http://localhost:3000/api/health
```

---

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.
