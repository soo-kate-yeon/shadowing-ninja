# 실전 배포 시나리오

실제로 자주 발생하는 상황들과 대응 방법을 단계별로 설명합니다.

## 📋 목차
1. [첫 배포하기](#시나리오-1-첫-배포하기)
2. [긴급 버그 수정](#시나리오-2-긴급-버그-수정)
3. [대규모 기능 추가](#시나리오-3-대규모-기능-추가)
4. [데이터베이스 스키마 변경](#시나리오-4-데이터베이스-스키마-변경)
5. [배포 중 에러 발생](#시나리오-5-배포-중-에러-발생)
6. [성능 저하 대응](#시나리오-6-성능-저하-대응)

---

## 시나리오 1: 첫 배포하기

### 상황
```
개발 완료 ✅
로컬 테스트 완료 ✅
이제 실제 서비스 오픈!
```

### 단계별 가이드

#### 1단계: Vercel 계정 및 프로젝트 생성 (5분)

**1.1 Vercel 가입**
```
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 연결
```

**1.2 프로젝트 import**
```
1. Dashboard → "Add New..." → "Project"
2. GitHub 저장소 선택
3. "Import" 클릭
```

---

#### 2단계: 환경 변수 설정 (3분)

**2.1 Supabase 정보 가져오기**
```
1. Supabase Dashboard 접속
2. Settings → API
3. 다음 값 복사:
   - Project URL
   - anon public key
   - service_role key (비밀!)
```

**2.2 Google AI API 키 생성**
```
1. https://makersuite.google.com/app/apikey
2. "Create API Key" 클릭
3. 키 복사
```

**2.3 Vercel에 환경 변수 추가**
```
Project Settings → Environment Variables

추가할 변수:
┌────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_SUPABASE_URL        │
│ Value: https://xxx.supabase.co        │
│ Environment: Production, Preview       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Name: NEXT_PUBLIC_SUPABASE_ANON_KEY   │
│ Value: eyJxxx...                      │
│ Environment: Production, Preview       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Name: SUPABASE_SERVICE_ROLE_KEY       │
│ Value: eyJxxx... (비밀!)              │
│ Environment: Production만 선택         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Name: GOOGLE_GENERATIVE_AI_API_KEY    │
│ Value: AIzaSyxxx...                   │
│ Environment: Production, Preview       │
└────────────────────────────────────────┘
```

**주의사항**:
```
⚠️ SERVICE_ROLE_KEY는 Preview에 추가하지 마세요!
   → 보안 위험
   → Production만 사용
```

---

#### 3단계: 첫 배포 실행 (2분)

**3.1 자동 배포 트리거**
```
Vercel이 자동으로 감지:
1. main 브랜치 코드 읽기
2. 빌드 시작
3. 배포 진행

실시간 로그 확인 가능!
```

**3.2 배포 진행 상황**
```
Vercel Dashboard → Deployments

표시되는 정보:
┌─────────────────────────────────────┐
│ 🔨 Building...                     │
│ ├─ Installing dependencies (1m)    │
│ ├─ Building pages (2m)             │
│ └─ Optimizing output (30s)         │
│                                     │
│ 🚀 Deploying...                    │
│ └─ Uploading to CDN (20s)          │
│                                     │
│ ✅ Deployment Complete!            │
│ 🌐 https://your-app.vercel.app     │
└─────────────────────────────────────┘
```

---

#### 4단계: 배포 확인 (5분)

**4.1 Health Check**
```bash
# 터미널에서 실행
curl https://your-app.vercel.app/api/health

# 예상 응답:
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

**4.2 주요 기능 테스트**
```
체크리스트:
☑ 메인 페이지 로딩
☑ 로그인/회원가입
☑ 영상 재생
☑ 데이터 저장/불러오기
☑ AI 기능 작동
```

**4.3 브라우저 콘솔 확인**
```
F12 → Console 탭

확인 사항:
✅ 에러 메시지 없음
✅ API 요청 성공 (200 상태)
✅ 리소스 로딩 완료
```

---

#### 5단계: 도메인 연결 (선택사항, 10분)

**5.1 커스텀 도메인 추가**
```
Vercel Project Settings → Domains

1. 도메인 입력 (예: shadowing.ninja)
2. DNS 설정 안내 확인
3. 도메인 제공업체에서 DNS 레코드 추가:

   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

4. 전파 대기 (수분~수시간)
```

---

#### 6단계: GitHub Actions 설정 (10분)

**6.1 Vercel Token 생성**
```
1. Vercel Account Settings → Tokens
2. "Create Token" 클릭
3. Name: "GitHub Actions"
4. Scope: "Full Account"
5. 생성된 토큰 복사
```

**6.2 GitHub Secrets 추가**
```
GitHub Repository → Settings → Secrets

추가할 Secrets:
- VERCEL_TOKEN: (방금 복사한 토큰)
- VERCEL_ORG_ID: (터미널에서 확인)
- VERCEL_PROJECT_ID: (터미널에서 확인)
```

**6.3 Project IDs 확인**
```bash
# 터미널에서 실행
cd your-project
vercel link

# .vercel/project.json 파일 생성됨
cat .vercel/project.json

# 출력:
{
  "orgId": "team_xxxx",  ← VERCEL_ORG_ID
  "projectId": "prj_xxx"  ← VERCEL_PROJECT_ID
}
```

**6.4 Supabase Access Token 생성**
```
1. Supabase Dashboard → Account → Access Tokens
2. "Generate new token" 클릭
3. Name: "GitHub Actions"
4. 생성된 토큰 복사
5. GitHub Secrets에 추가:
   - SUPABASE_ACCESS_TOKEN: (토큰)
   - SUPABASE_PROJECT_ID: (Project Reference ID)
```

---

#### 7단계: 첫 PR 테스트 (5분)

**7.1 테스트 브랜치 생성**
```bash
git checkout -b test/first-deployment
```

**7.2 간단한 변경**
```bash
# README.md 수정
echo "# Shadowing Ninja - 첫 배포 완료!" > README.md

git add README.md
git commit -m "docs: 첫 배포 완료 기념"
git push origin test/first-deployment
```

**7.3 PR 생성**
```
1. GitHub 저장소 접속
2. "Compare & pull request" 클릭
3. PR 제목: "첫 배포 테스트"
4. "Create pull request" 클릭
```

**7.4 자동화 확인**
```
GitHub PR 페이지에서 확인:

✅ CI / Lint and Type Check (30초)
✅ CI / Build (2분)
✅ CI / Security Scan (1분)
✅ Lighthouse CI (3분)
✅ Deploy Preview (2분)

총 소요 시간: ~9분

Preview URL 생성:
🌐 https://your-app-git-test-first-deployment.vercel.app
```

---

### 첫 배포 완료 체크리스트

```
☑ Vercel 프로젝트 생성 완료
☑ 환경 변수 설정 완료
☑ Production 배포 성공
☑ Health Check 통과
☑ 주요 기능 정상 작동
☑ GitHub Actions 설정 완료
☑ Preview 배포 테스트 완료
☑ 도메인 연결 (선택)

축하합니다! 🎉
이제 자동 배포 시스템이 작동합니다!
```

---

## 시나리오 2: 긴급 버그 수정

### 상황
```
⚠️ 긴급 상황!
사용자 보고: "로그인이 안돼요!"
영향: 모든 사용자
우선순위: 최고
```

### 빠른 대응 프로세스 (10분 이내)

#### Step 1: 문제 확인 (1분)

**1.1 에러 로그 확인**
```
Vercel Dashboard → 해당 프로젝트 → Logs

필터링:
- Level: Error
- Time: Last 1 hour

발견된 에러:
❌ TypeError: Cannot read property 'user' of null
   at login.tsx:42
```

**1.2 영향 범위 파악**
```
Vercel Analytics → Real-time

현재 상황:
- 활성 사용자: 127명
- 에러율: 78% ⚠️
- 영향받는 페이지: /login
```

---

#### Step 2: 즉시 조치 - Rollback (1분)

**Option A: Vercel Dashboard에서 롤백**
```
1. Vercel → Deployments
2. 정상 작동하던 이전 버전 찾기
3. 우측 메뉴 (···) → "Promote to Production"
4. 확인 클릭

⏱️ 소요 시간: 30초~1분
✅ 서비스 정상화
```

**확인**:
```
1. 사이트 접속 → 로그인 테스트
2. Vercel Analytics → 에러율 확인
3. 사용자에게 공지:
   "일시적 문제가 해결되었습니다"
```

---

#### Step 3: 근본 원인 파악 (3분)

**3.1 최근 변경사항 확인**
```bash
# Git 로그 확인
git log --oneline -n 10

# 출력:
abc1234 fix: typo in button
def5678 feat: add new login method  ← 의심!
```

**3.2 변경된 코드 검토**
```bash
git show def5678

# 변경 내용:
- const user = session?.user
+ const user = session.user  ← 버그!
```

**문제 발견**:
```typescript
// ❌ 문제 코드
const user = session.user
// session이 null일 때 에러 발생!

// ✅ 수정 코드
const user = session?.user
// null-safe 접근
```

---

#### Step 4: 긴급 수정 (2분)

**4.1 Hotfix 브랜치 생성**
```bash
# main 브랜치로 이동
git checkout main
git pull origin main

# hotfix 브랜치 생성
git checkout -b hotfix/login-null-error
```

**4.2 코드 수정**
```typescript
// src/app/login/page.tsx

// Before:
const user = session.user

// After:
const user = session?.user ?? null
```

**4.3 로컬 테스트**
```bash
# 빌드 테스트
npm run build

# 타입 체크
npm run type-check

# 로컬 실행
npm run dev

# 브라우저에서 테스트:
# - 로그인 (정상)
# - 로그아웃 후 재접속 (정상)
```

---

#### Step 5: 긴급 배포 (3분)

**5.1 커밋 및 푸시**
```bash
git add src/app/login/page.tsx
git commit -m "hotfix: null 체크 추가하여 로그인 에러 수정

- session.user → session?.user로 변경
- null-safe 접근으로 런타임 에러 방지

Fixes: 로그인 페이지 접근 시 TypeError 발생"

git push origin hotfix/login-null-error
```

**5.2 PR 생성 (생략 가능)**
```
긴급 상황:
→ PR 없이 main에 직접 merge 가능

일반 상황:
→ PR 생성 후 빠른 리뷰
```

**5.3 Main에 Merge**
```bash
git checkout main
git merge hotfix/login-null-error
git push origin main

# 자동 배포 시작!
```

---

#### Step 6: 배포 모니터링 (2분)

**6.1 배포 진행 확인**
```
GitHub → Actions 탭

실행 중:
🔄 Deploy to Production
  ├─ ✅ Lint Check
  ├─ ✅ Type Check
  ├─ ✅ Build
  ├─ ✅ Security Scan
  └─ 🔄 Deploy (진행 중...)
```

**6.2 배포 완료 확인**
```
Vercel Dashboard

✅ Deployment Complete
🌐 https://your-app.vercel.app
📊 Build time: 2m 34s
```

**6.3 Health Check**
```bash
curl https://your-app.vercel.app/api/health

# 정상 응답 확인
```

---

#### Step 7: 사후 조치 (5분)

**7.1 기능 테스트**
```
체크리스트:
☑ 로그인 (다양한 시나리오)
  - 정상 로그인
  - 잘못된 비밀번호
  - 세션 만료 후 재로그인
☑ 회원가입
☑ 로그아웃
☑ 자동 로그인 (기억하기)
```

**7.2 모니터링**
```
Vercel Analytics (15분간 관찰)

확인 사항:
✅ 에러율: 0%
✅ 응답 시간: 정상
✅ 활성 사용자: 증가 추세
```

**7.3 사용자 공지**
```
공지 작성 예시:

제목: [해결] 로그인 오류 긴급 수정 완료

안녕하세요, Shadowing Ninja 팀입니다.

오늘 오후 2시~2시 10분 사이 로그인 오류가
발생했던 점 사과드립니다.

✅ 현재 상황: 완전 복구
⏱️ 중단 시간: 약 10분
🔧 조치 내용: null 체크 로직 추가

불편을 드려 죄송합니다.
```

**7.4 사후 분석 문서 작성**
```markdown
# Incident Report: 2025-01-15 로그인 오류

## 요약
- 발생 시간: 14:00 ~ 14:10 (10분)
- 영향: 모든 사용자의 로그인 불가
- 원인: session.user null-check 누락
- 조치: Rollback → 수정 → 재배포

## 타임라인
- 14:00: 배포
- 14:01: 에러 보고 접수
- 14:02: Rollback 실행
- 14:03: 서비스 복구
- 14:05: 근본 원인 파악
- 14:07: 수정 완료
- 14:10: 재배포 완료

## 재발 방지 대책
1. 로그인 관련 E2E 테스트 추가
2. Null-check 린트 규칙 강화
3. Canary 배포 도입 검토
```

---

### 긴급 수정 타임라인 요약

```
00:00 - 문제 발견
00:01 - Rollback 실행 (서비스 복구)
00:04 - 근본 원인 파악
00:06 - 코드 수정 및 로컬 테스트
00:09 - 긴급 배포
00:12 - 배포 완료 및 확인
00:15 - 모니터링 및 공지

총 소요 시간: 15분
다운타임: 1분 (Rollback으로 최소화)
```

---

## 시나리오 3: 대규모 기능 추가

### 상황
```
신규 기능: AI 발음 분석 기능
영향 범위:
- 프론트엔드: 새 페이지 추가
- 백엔드: 새 API 엔드포인트
- 데이터베이스: 새 테이블 추가
- 외부 API: Google Speech-to-Text 연동

개발 기간: 1주일
팀원: 3명
```

### 안전한 배포 전략

#### Phase 1: 기획 및 설계 (1일)

**1.1 기능 명세서 작성**
```markdown
# AI 발음 분석 기능

## 목적
사용자의 발음을 AI가 분석하여 피드백 제공

## 기능
1. 음성 녹음
2. 발음 분석 (Google Speech API)
3. 점수 및 피드백 표시
4. 분석 기록 저장

## 기술 스택
- Frontend: React, Web Audio API
- Backend: Next.js API Routes
- AI: Google Cloud Speech-to-Text
- DB: Supabase (pronunciation_analyses 테이블)
```

**1.2 데이터베이스 스키마 설계**
```sql
CREATE TABLE pronunciation_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  video_id TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT NOT NULL,
  accuracy_score INTEGER,
  feedback JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pronunciation_user
  ON pronunciation_analyses(user_id);
```

---

#### Phase 2: 브랜치 전략 (개발 시작)

**2.1 Feature 브랜치 생성**
```bash
git checkout -b feature/ai-pronunciation-analysis
```

**2.2 개발 중 Preview 배포**
```
매번 푸시할 때마다:
→ GitHub Actions 자동 실행
→ Preview 배포 생성
→ 팀원들이 실시간 확인 가능
```

---

#### Phase 3: 단계별 개발 (5일)

**Day 1: 데이터베이스**
```bash
# 마이그레이션 생성
npm run supabase:migration new add_pronunciation_table

# SQL 작성 (위의 스키마)

# 로컬 테스트
npm run supabase:start
npm run supabase:push

# 커밋
git add supabase/migrations/
git commit -m "feat(db): 발음 분석 테이블 추가"
git push origin feature/ai-pronunciation-analysis
```

**Preview 배포 확인**:
```
GitHub PR 자동 생성
→ Preview URL 생성
→ DB 마이그레이션은 아직 적용 안됨 (안전)
```

---

**Day 2-3: 백엔드 API**
```typescript
// src/app/api/pronunciation/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // 1. 인증 확인
  const { data: { user }, error: authError } =
    await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 2. 요청 데이터 파싱
  const { audioBlob, videoId, expectedText } =
    await request.json()

  // 3. Google Speech API 호출
  const analysis = await analyzePronunciation(
    audioBlob,
    expectedText
  )

  // 4. DB 저장
  const { data, error } = await supabase
    .from('pronunciation_analyses')
    .insert({
      user_id: user.id,
      video_id: videoId,
      transcript: analysis.transcript,
      accuracy_score: analysis.score,
      feedback: analysis.feedback
    })
    .select()

  return NextResponse.json({ data })
}
```

**커밋 및 푸시**:
```bash
git add src/app/api/pronunciation/
git commit -m "feat(api): 발음 분석 API 구현

- Google Speech API 연동
- DB 저장 로직
- 에러 핸들링"

git push origin feature/ai-pronunciation-analysis
```

---

**Day 4-5: 프론트엔드**
```typescript
// src/app/pronunciation/page.tsx

'use client'

import { useState } from 'react'
import { useRecording } from '@/hooks/useRecording'

export default function PronunciationPage() {
  const { isRecording, startRecording, stopRecording } =
    useRecording()

  const [result, setResult] = useState(null)

  const handleAnalyze = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    formData.append('videoId', videoId)
    formData.append('expectedText', expectedText)

    const res = await fetch('/api/pronunciation/analyze', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    setResult(data)
  }

  return (
    <div>
      <RecordButton
        isRecording={isRecording}
        onStart={startRecording}
        onStop={async (blob) => {
          stopRecording()
          await handleAnalyze(blob)
        }}
      />

      {result && (
        <AnalysisResult
          score={result.accuracy_score}
          feedback={result.feedback}
        />
      )}
    </div>
  )
}
```

---

#### Phase 4: 테스트 (1일)

**4.1 단위 테스트**
```typescript
// src/app/api/pronunciation/__tests__/analyze.test.ts

describe('POST /api/pronunciation/analyze', () => {
  it('인증되지 않은 요청은 401 반환', async () => {
    const res = await POST(mockRequest)
    expect(res.status).toBe(401)
  })

  it('정상 요청은 분석 결과 반환', async () => {
    const res = await POST(mockAuthRequest)
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('accuracy_score')
  })
})
```

**4.2 통합 테스트 (Preview에서)**
```
Preview URL:
https://your-app-git-feature-pronunciation.vercel.app

테스트 시나리오:
1. 로그인
2. 영상 페이지 접속
3. 녹음 버튼 클릭
4. 음성 녹음
5. 분석 시작
6. 결과 확인
7. 기록 저장 확인
```

**4.3 성능 테스트**
```bash
# Lighthouse 점수 확인
npm run lighthouse

# 응답 시간 측정
curl -w "@curl-format.txt" -o /dev/null -s \
  https://preview-url.vercel.app/api/pronunciation/analyze

# 목표:
# - 응답 시간: < 3초
# - 성능 점수: > 90
```

---

#### Phase 5: 코드 리뷰 (1일)

**5.1 PR 생성**
```
PR 제목:
feat: AI 발음 분석 기능 추가

PR 설명:
## 구현 내용
- ✅ Google Speech API 연동
- ✅ 발음 분석 알고리즘
- ✅ 결과 저장 및 히스토리
- ✅ UI/UX 구현

## 테스트
- ✅ 단위 테스트 통과
- ✅ 통합 테스트 완료
- ✅ Lighthouse 성능 > 90

## Preview
🌐 https://your-app-git-feature-pronunciation.vercel.app

## 스크린샷
[녹음 화면]
[분석 결과 화면]
[히스토리 화면]

## 체크리스트
- [x] 코드 품질 검사 통과
- [x] 타입 안정성 확인
- [x] 보안 검토 완료
- [x] 성능 최적화 완료
- [x] 문서 업데이트
```

**5.2 팀 리뷰**
```
리뷰어 1 (백엔드):
✅ API 로직 확인
✅ 에러 핸들링 적절
💬 Comment: "음성 파일 크기 제한 추가 필요"

리뷰어 2 (프론트엔드):
✅ UI/UX 적절
⚠️ Request Changes: "로딩 상태 표시 개선 필요"

리뷰어 3 (리더):
✅ 전체 구조 양호
💬 Comment: "환경 변수 문서 업데이트 필요"
```

**5.3 피드백 반영**
```bash
# 1. 음성 파일 크기 제한
# src/app/api/pronunciation/analyze/route.ts
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
if (audioBlob.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { error: 'File too large' },
    { status: 413 }
  )
}

# 2. 로딩 상태 개선
# src/app/pronunciation/page.tsx
const [isAnalyzing, setIsAnalyzing] = useState(false)
// ... 로딩 스피너 추가

# 3. 문서 업데이트
# .env.example
GOOGLE_SPEECH_API_KEY=your_api_key_here

git add .
git commit -m "refactor: 리뷰 피드백 반영

- 파일 크기 제한 추가 (10MB)
- 로딩 상태 UI 개선
- 환경 변수 문서화"

git push origin feature/ai-pronunciation-analysis
```

---

#### Phase 6: Staging 배포 (선택사항)

**6.1 Staging 환경 설정**
```
Vercel → New Project
- Project Name: "shadowing-ninja-staging"
- Git Branch: "staging"

환경 변수:
- Production 환경과 동일
- 단, DB는 Staging DB 사용
```

**6.2 Staging 배포**
```bash
git checkout staging
git merge feature/ai-pronunciation-analysis
git push origin staging

# 자동 배포
# 🌐 https://shadowing-ninja-staging.vercel.app
```

**6.3 Staging 테스트**
```
실제 사용자 환경과 동일:
- 실제 도메인과 유사
- Production DB 스키마와 동일
- 실제 API 키 사용

테스트:
☑ 전체 기능 플로우
☑ 다양한 사용자 시나리오
☑ 예외 상황 테스트
☑ 성능 부하 테스트
```

---

#### Phase 7: Production 배포

**7.1 최종 확인**
```
배포 전 체크리스트:
☑ PR 승인 완료
☑ 모든 CI 체크 통과
☑ Preview/Staging 테스트 완료
☑ Lighthouse 점수 > 90
☑ 보안 스캔 통과
☑ DB 마이그레이션 준비 완료
☑ 롤백 계획 수립
☑ 팀 공지 완료
```

**7.2 배포 시간 선택**
```
권장 시간:
- 평일 오후 2-4시 (사용자 적음)
- 금요일 오후 피하기
- 주말/휴일 피하기

이유:
- 문제 발생 시 즉시 대응 가능
- 팀원들이 모두 대기 중
```

**7.3 Main 브랜치에 Merge**
```bash
# GitHub에서 PR Merge 버튼 클릭
# 또는:
git checkout main
git merge feature/ai-pronunciation-analysis
git push origin main

# 자동 배포 시작!
```

**7.4 배포 모니터링**
```
GitHub Actions:
✅ Lint Check (30초)
✅ Type Check (30초)
✅ Build (2분)
✅ Security Scan (1분)
✅ Deploy (2분)
✅ DB Migration (30초)

Vercel Dashboard:
🔄 Deploying...
✅ Deployment Complete!

총 소요 시간: ~7분
```

---

#### Phase 8: 배포 후 모니터링

**8.1 즉시 확인 (5분)**
```
1. Health Check
curl https://yourdomain.com/api/health

2. 새 기능 테스트
- /pronunciation 페이지 접속
- 녹음 → 분석 → 결과 확인

3. 기존 기능 테스트 (Smoke Test)
- 로그인/로그아웃
- 영상 재생
- 학습 기록 저장
```

**8.2 실시간 모니터링 (1시간)**
```
Vercel Analytics:
- 에러율: 확인
- 응답 시간: 확인
- 활성 사용자: 확인

Supabase Logs:
- API 요청 수: 확인
- DB 쿼리 성능: 확인
- 에러 로그: 모니터링

Google Cloud Console:
- Speech API 사용량: 확인
- 에러율: 확인
- 비용: 모니터링
```

**8.3 사용자 피드백 수집 (1일)**
```
채널:
- 인앱 피드백 양식
- 이메일
- 소셜 미디어
- 고객 지원 티켓

모니터링 항목:
- 버그 보고
- 기능 사용률
- 만족도
- 개선 제안
```

---

### 대규모 기능 배포 타임라인

```
Week 1:
├─ Day 1: 기획 및 설계
├─ Day 2-3: 백엔드 개발
├─ Day 4-5: 프론트엔드 개발
├─ Day 6: 테스트
└─ Day 7: 코드 리뷰 및 피드백 반영

Week 2:
├─ Day 1: Staging 배포 및 테스트
├─ Day 2: 최종 확인
├─ Day 3: Production 배포 (화요일 오후 2시)
├─ Day 3-4: 집중 모니터링
└─ Day 5: 사후 분석 및 문서화
```

---

## 시나리오 4: 데이터베이스 스키마 변경

### 상황
```
요구사항: 사용자 프로필에 "학습 목표" 필드 추가
영향:
- users 테이블 스키마 변경
- 기존 사용자: 기본값 설정 필요
- 관련 API: 3개 수정 필요
```

### 안전한 DB 마이그레이션

#### Step 1: 마이그레이션 계획 (30분)

**1.1 변경 사항 명세**
```sql
-- 추가할 컬럼
ALTER TABLE users
ADD COLUMN learning_goal TEXT;

-- 기본값 설정 (기존 사용자용)
UPDATE users
SET learning_goal = '일상 회화 마스터하기'
WHERE learning_goal IS NULL;
```

**1.2 영향 분석**
```
영향받는 부분:
✅ users 테이블
✅ /api/profile/update
✅ /api/user/[id]
✅ /app/profile/page.tsx

영향 없는 부분:
⭕ 인증 시스템
⭕ 영상 재생
⭕ 학습 기록
```

**1.3 롤백 계획**
```sql
-- 롤백 시 실행할 SQL
ALTER TABLE users
DROP COLUMN learning_goal;
```

---

#### Step 2: 로컬 테스트 (1시간)

**2.1 마이그레이션 파일 생성**
```bash
npm run supabase:migration new add_learning_goal_to_users

# 생성된 파일:
# supabase/migrations/20250115_add_learning_goal.sql
```

**2.2 마이그레이션 SQL 작성**
```sql
-- supabase/migrations/20250115_add_learning_goal.sql

-- 컬럼 추가
ALTER TABLE users
ADD COLUMN learning_goal TEXT;

-- 기본값 설정
UPDATE users
SET learning_goal = '일상 회화 마스터하기'
WHERE learning_goal IS NULL;

-- 인덱스 추가 (선택사항)
CREATE INDEX idx_users_learning_goal
  ON users(learning_goal);
```

**2.3 로컬 Supabase에서 테스트**
```bash
# 로컬 Supabase 시작
npm run supabase:start

# 마이그레이션 적용
npm run supabase:push

# 확인
npm run supabase:db -- psql

# SQL 실행:
\d users
# learning_goal 컬럼 확인

SELECT learning_goal, COUNT(*)
FROM users
GROUP BY learning_goal;
# 기본값 적용 확인
```

---

#### Step 3: 코드 수정 및 테스트

**3.1 타입 정의 업데이트**
```typescript
// src/types/database.types.ts

export interface User {
  id: string
  email: string
  name: string
  learning_goal: string | null  // 추가
  created_at: string
  updated_at: string
}
```

**3.2 API 수정**
```typescript
// src/app/api/profile/update/route.ts

export async function POST(request: NextRequest) {
  const { name, learning_goal } = await request.json()

  const { data, error } = await supabase
    .from('users')
    .update({
      name,
      learning_goal  // 추가
    })
    .eq('id', userId)
    .select()

  return NextResponse.json({ data, error })
}
```

**3.3 프론트엔드 수정**
```typescript
// src/app/profile/page.tsx

export default function ProfilePage() {
  const [learningGoal, setLearningGoal] = useState('')

  const handleSave = async () => {
    await fetch('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify({
        name: username,
        learning_goal: learningGoal  // 추가
      })
    })
  }

  return (
    <div>
      <input
        value={learningGoal}
        onChange={(e) => setLearningGoal(e.target.value)}
        placeholder="학습 목표를 입력하세요"
      />
      <button onClick={handleSave}>저장</button>
    </div>
  )
}
```

---

#### Step 4: PR 및 Preview 배포

**4.1 커밋 및 푸시**
```bash
git add .
git commit -m "feat(db): 사용자 학습 목표 필드 추가

- users 테이블에 learning_goal 컬럼 추가
- 기본값 설정 마이그레이션
- API 및 UI 업데이트

Migration: 20250115_add_learning_goal.sql"

git push origin feature/add-learning-goal
```

**4.2 PR 생성**
```markdown
## DB 스키마 변경 사항

### 변경 내용
- `users` 테이블에 `learning_goal TEXT` 컬럼 추가

### 마이그레이션 전략
1. 컬럼 추가 (NULL 허용)
2. 기존 사용자에게 기본값 설정
3. 인덱스 추가

### 롤백 계획
```sql
ALTER TABLE users DROP COLUMN learning_goal;
```

### 테스트 완료
- ✅ 로컬 마이그레이션 성공
- ✅ 기존 데이터 영향 없음
- ✅ API 정상 작동
- ✅ UI 정상 표시

### Preview
🌐 https://your-app-git-feature-learning-goal.vercel.app

⚠️ 주의: Preview 환경은 별도 DB 사용
```

---

#### Step 5: Staging에서 마이그레이션 테스트

**5.1 Staging DB 백업**
```bash
# Supabase Dashboard
# Settings → Database → Backups
# "Create Backup" 클릭
```

**5.2 Staging 배포**
```bash
git checkout staging
git merge feature/add-learning-goal
git push origin staging

# GitHub Actions 자동 실행:
# 1. 빌드
# 2. 배포
# 3. 마이그레이션 ← 중요!
```

**5.3 마이그레이션 확인**
```bash
# Supabase Dashboard → SQL Editor

-- 컬럼 존재 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name = 'learning_goal';

-- 데이터 확인
SELECT id, name, learning_goal
FROM users
LIMIT 10;
```

**5.4 전체 기능 테스트**
```
Staging 사이트에서:
☑ 기존 사용자 로그인
  → learning_goal에 기본값 있는지 확인
☑ 프로필 수정
  → learning_goal 변경 가능한지 확인
☑ 새 사용자 회원가입
  → learning_goal NULL로 시작하는지 확인
☑ API 응답 확인
  → learning_goal 필드 포함되는지 확인
```

---

#### Step 6: Production 마이그레이션

**6.1 배포 전 최종 준비**
```
체크리스트:
☑ Staging 테스트 완료
☑ Production DB 백업 완료
☑ 롤백 계획 준비
☑ 팀 대기 (실시간 모니터링)
☑ 사용자 공지 (선택사항)
```

**6.2 Main 브랜치 Merge**
```bash
# PR 승인 후
git checkout main
git merge feature/add-learning-goal
git push origin main

# 자동 배포 시작!
```

**6.3 마이그레이션 실행 모니터링**
```
GitHub Actions 로그:

[Deploy to Production]
├─ ✅ Build (2m)
├─ ✅ Deploy (2m)
└─ 🔄 Migrate Database

[Migrate Database]
├─ Connecting to Supabase...
├─ Running migration: 20250115_add_learning_goal.sql
├─ ALTER TABLE users ADD COLUMN learning_goal TEXT
├─ UPDATE users SET learning_goal = '...'
├─ CREATE INDEX idx_users_learning_goal
└─ ✅ Migration complete

Total time: 15 seconds
```

**6.4 즉시 확인**
```bash
# Supabase Dashboard → SQL Editor

-- 마이그레이션 확인
SELECT COUNT(*) FROM users WHERE learning_goal IS NOT NULL;
-- 예상: 전체 사용자 수와 동일

-- 성능 확인
EXPLAIN ANALYZE
SELECT * FROM users WHERE learning_goal = '일상 회화 마스터하기';
-- 인덱스 사용 확인
```

---

#### Step 7: 모니터링 및 검증

**7.1 실시간 모니터링 (30분)**
```
Supabase Dashboard → Logs:

확인 사항:
✅ 쿼리 에러율: 0%
✅ 평균 응답 시간: 정상
✅ users 테이블 락: 없음
✅ 동시 접속 사용자: 영향 없음
```

**7.2 기능 테스트**
```
Production 사이트:
☑ 기존 사용자 로그인
☑ 프로필 페이지 접속
☑ 학습 목표 확인 및 수정
☑ 저장 후 재로그인
☑ 변경사항 유지 확인
```

**7.3 성능 확인**
```bash
# API 응답 시간 측정
curl -w "@curl-format.txt" \
  https://yourdomain.com/api/user/profile

# 예상 결과:
# time_total: < 200ms
# 변화: ±10ms (영향 미미)
```

---

### DB 마이그레이션 Best Practices

#### 안전한 마이그레이션 체크리스트

```
배포 전:
☑ 백업 완료
☑ 롤백 계획 수립
☑ Staging 테스트 완료
☑ 피크 시간대 피하기
☑ 팀 대기

마이그레이션 중:
☑ 실시간 모니터링
☑ 에러 로그 확인
☑ 성능 메트릭 확인

배포 후:
☑ 데이터 무결성 확인
☑ 기능 테스트 완료
☑ 성능 영향 확인
☑ 사용자 피드백 모니터링
```

#### 위험한 마이그레이션 패턴 (피하기!)

```sql
-- ❌ 위험: 즉시 NOT NULL 제약 추가
ALTER TABLE users
ADD COLUMN learning_goal TEXT NOT NULL;
-- → 기존 데이터 에러 발생!

-- ✅ 안전: 단계적 추가
-- Step 1: NULL 허용으로 추가
ALTER TABLE users
ADD COLUMN learning_goal TEXT;

-- Step 2: 기본값 설정
UPDATE users
SET learning_goal = '기본값'
WHERE learning_goal IS NULL;

-- Step 3: (선택) NOT NULL 제약 추가
-- (다음 마이그레이션에서)
```

---

## 시나리오 5: 배포 중 에러 발생

### 상황
```
배포 실행 중...
⏱️ 경과 시간: 2분
❌ 에러 발생!
Error: Module not found: '@/components/NewFeature'
```

### 즉시 대응 프로세스

#### Step 1: 배포 중단 (즉시)

**Option A: GitHub Actions 취소**
```
GitHub → Actions 탭
→ 실행 중인 워크플로우 선택
→ "Cancel workflow" 클릭

⏱️ 소요 시간: 5초
```

**Option B: Vercel Dashboard**
```
Vercel → Deployments
→ Building 상태인 배포 선택
→ "Cancel Deployment" 클릭

⏱️ 소요 시간: 5초
```

**중요**:
```
❗ 배포 중단 시:
→ 이전 버전이 계속 운영 ✅
→ 사용자에게 영향 없음 ✅
→ 새 버전은 배포 안됨 ✅
```

---

#### Step 2: 에러 원인 파악 (2분)

**2.1 에러 로그 확인**
```
GitHub Actions 로그:

[Build]
├─ Installing dependencies ✅
├─ Compiling TypeScript ✅
└─ Building pages ❌
    Error: Module not found: '@/components/NewFeature'
    at src/app/some-page/page.tsx:5:1
```

**2.2 코드 확인**
```typescript
// src/app/some-page/page.tsx
import { NewFeature } from '@/components/NewFeature'
//                          ^^^^^^^^^^^^^^^^^^^^^^^^
//                          파일이 존재하지 않음!
```

**2.3 문제 발견**
```
원인:
- 파일명 오타: NewFeature.tsx vs NewFeature.ts
- 파일이 커밋되지 않음
- import 경로 오류
```

---

#### Step 3: 긴급 수정 (5분)

**3.1 파일 확인**
```bash
# 파일 존재 여부 확인
ls src/components/

# 출력:
NewFeatures.tsx  ← 's' 추가로 오타!
```

**3.2 수정**
```typescript
// Option 1: import 경로 수정
import { NewFeature } from '@/components/NewFeatures'

// Option 2: 파일명 수정
mv src/components/NewFeatures.tsx \
   src/components/NewFeature.tsx
```

**3.3 로컬 테스트**
```bash
# 빌드 테스트
npm run build

# 출력:
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (15/15)
✓ Finalizing page optimization

Build completed in 2m 34s
```

---

#### Step 4: 재배포 (3분)

**4.1 커밋 및 푸시**
```bash
git add .
git commit -m "fix: 컴포넌트 import 경로 수정"
git push origin main

# 자동 배포 시작
```

**4.2 배포 모니터링**
```
GitHub Actions:
✅ Checkout code
✅ Install dependencies
✅ Build ← 이번엔 성공!
✅ Deploy
✅ Migration

Vercel:
✅ Deployment Complete
```

---

### 다양한 에러 시나리오별 대응

#### 시나리오 5-1: TypeScript 타입 에러

**에러**:
```
Error: Type 'string | undefined' is not assignable to type 'string'
```

**원인**:
```typescript
const userId: string = session?.user?.id
//                     ^^^^^^^^^^^^^^^^
//                     undefined 가능성 있음
```

**해결**:
```typescript
const userId = session?.user?.id ?? ''
// 또는
const userId = session?.user?.id || 'anonymous'
// 또는
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const userId: string = session.user.id
```

---

#### 시나리오 5-2: 환경 변수 누락

**에러**:
```
Error: GOOGLE_AI_API_KEY is not defined
```

**확인**:
```
Vercel Dashboard → Settings → Environment Variables

누락된 변수:
❌ GOOGLE_AI_API_KEY
```

**해결**:
```
1. 환경 변수 추가:
   - Name: GOOGLE_AI_API_KEY
   - Value: AIzaSy...
   - Environment: Production, Preview

2. Redeploy:
   Deployments → 최신 배포 → "Redeploy" 클릭

⏱️ 소요 시간: 2분
```

---

#### 시나리오 5-3: 패키지 의존성 충돌

**에러**:
```
Error: Cannot find module 'new-package'
```

**원인**:
```json
// package.json에 추가했지만
// package-lock.json이 업데이트 안됨
```

**해결**:
```bash
# 로컬에서 재설치
rm -rf node_modules package-lock.json
npm install

# package-lock.json 커밋
git add package-lock.json
git commit -m "fix: 의존성 lock 파일 업데이트"
git push origin main
```

---

#### 시나리오 5-4: 빌드 메모리 부족

**에러**:
```
Error: JavaScript heap out of memory
```

**원인**:
```
빌드 중 메모리 부족
(대용량 이미지, 복잡한 번들링)
```

**해결**:
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

**Vercel 설정**:
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

---

## 시나리오 6: 성능 저하 대응

### 상황
```
📊 모니터링 알림:
⚠️ 페이지 로딩 시간 3초 → 8초로 증가
⚠️ API 응답 시간 200ms → 2초로 증가
⚠️ Lighthouse 성능 점수 95 → 45로 하락
```

### 단계별 대응

#### Step 1: 문제 분석 (15분)

**1.1 Vercel Analytics 확인**
```
Vercel Dashboard → Analytics

발견 사항:
- 메인 페이지: 8.2초 (이전: 2.1초)
- /api/videos: 2.4초 (이전: 0.3초)
- 정적 에셋: 정상
```

**1.2 Lighthouse 리포트 확인**
```bash
npm run lighthouse -- --url=https://yourdomain.com

# 주요 지표:
Performance: 45/100 ⚠️
  - First Contentful Paint: 4.2s
  - Largest Contentful Paint: 8.1s
  - Total Blocking Time: 1,890ms

Diagnostics:
❌ Serve static assets with efficient cache policy
❌ Avoid enormous network payloads (15.2 MB)
❌ Minimize main-thread work (8.4s)
```

**1.3 네트워크 분석**
```
Chrome DevTools → Network 탭

발견:
❌ thumbnail-image.jpg: 12.5 MB ← 문제!
❌ bundle.js: 2.1 MB
⚠️ 총 56개 요청 (이전: 23개)
```

---

#### Step 2: 즉시 조치 (긴급)

**2.1 문제 파일 확인**
```bash
# 큰 이미지 찾기
find public -type f -size +1M -exec ls -lh {} \;

# 출력:
-rw-r--r--  12.5M  public/thumbnails/video1.jpg
-rw-r--r--  11.2M  public/thumbnails/video2.jpg
```

**2.2 임시 조치: 이미지 교체**
```bash
# 최적화된 이미지로 교체
# (이미 준비되어 있다면)
cp optimized/video1.jpg public/thumbnails/
cp optimized/video2.jpg public/thumbnails/

git add public/thumbnails/
git commit -m "hotfix: 대용량 이미지 최적화 버전으로 교체"
git push origin main

# 배포 (3분)
```

---

#### Step 3: 근본 해결 (1일)

**3.1 이미지 최적화**
```typescript
// next.config.ts에 이미지 최적화 설정 추가
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },
}
```

**3.2 Next.js Image 컴포넌트 사용**
```typescript
// Before: ❌
<img src="/thumbnails/video1.jpg" />

// After: ✅
import Image from 'next/image'

<Image
  src="/thumbnails/video1.jpg"
  alt="Video thumbnail"
  width={640}
  height={360}
  priority={false}
  loading="lazy"
/>
```

**3.3 번들 크기 최적화**
```bash
# 번들 분석
npm run analyze

# 발견:
# - lodash: 500KB (전체 import 중)
# - moment: 300KB (사용 안하는데 포함)
```

**수정**:
```typescript
// Before: ❌
import _ from 'lodash'
import moment from 'moment'

// After: ✅
import debounce from 'lodash/debounce'
import { formatDistanceToNow } from 'date-fns'
```

**3.4 Code Splitting**
```typescript
// Before: ❌
import HeavyComponent from './HeavyComponent'

// After: ✅
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false, // 클라이언트에서만 로드
})
```

---

#### Step 4: 캐싱 전략 개선

**4.1 API 응답 캐싱**
```typescript
// src/app/api/videos/route.ts

export async function GET(request: NextRequest) {
  // Before: 매번 DB 조회 ❌
  const videos = await supabase
    .from('curated_videos')
    .select('*')

  // After: 캐싱 추가 ✅
  return NextResponse.json(videos, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

**4.2 정적 페이지 생성**
```typescript
// src/app/videos/[id]/page.tsx

// 정적 생성 활성화
export const revalidate = 3600 // 1시간마다 재생성

export async function generateStaticParams() {
  const videos = await getVideos()
  return videos.map((video) => ({
    id: video.id,
  }))
}
```

---

#### Step 5: 데이터베이스 쿼리 최적화

**5.1 느린 쿼리 발견**
```
Supabase Dashboard → Logs → Slow Queries

발견:
❌ SELECT * FROM curated_videos
   LEFT JOIN transcripts ON ...
   → 2.4초 (!)
```

**5.2 인덱스 추가**
```sql
-- 마이그레이션 생성
-- supabase/migrations/20250116_add_indexes.sql

CREATE INDEX idx_transcripts_video_id
  ON transcripts(video_id);

CREATE INDEX idx_videos_created_at
  ON curated_videos(created_at DESC);
```

**5.3 쿼리 개선**
```typescript
// Before: ❌ 모든 컬럼 조회
const videos = await supabase
  .from('curated_videos')
  .select('*')

// After: ✅ 필요한 컬럼만
const videos = await supabase
  .from('curated_videos')
  .select('id, title, thumbnail_url, created_at')
  .order('created_at', { ascending: false })
  .limit(20)
```

---

#### Step 6: 성능 테스트 및 배포

**6.1 로컬 성능 테스트**
```bash
# Lighthouse 실행
npm run lighthouse

# 결과:
Performance: 92/100 ✅ (이전: 45)
  - First Contentful Paint: 1.2s ✅
  - Largest Contentful Paint: 2.1s ✅
  - Total Blocking Time: 120ms ✅
```

**6.2 번들 크기 확인**
```bash
npm run build

# 출력:
Route (app)                              Size     First Load JS
├ ○ /                                    5.2 kB   115 kB ✅
├ ○ /api/videos                         0 kB      0 kB
└ λ /videos/[id]                        12.4 kB   128 kB ✅

이전: First Load JS: 2.1 MB ❌
현재: First Load JS: 128 kB ✅
개선: 94% 감소!
```

**6.3 배포**
```bash
git add .
git commit -m "perf: 성능 최적화

- 이미지 최적화 및 Next/Image 적용
- 번들 크기 94% 감소
- API 응답 캐싱 추가
- DB 쿼리 최적화 및 인덱스 추가
- Code splitting 적용

성능 점수: 45 → 92"

git push origin main
```

---

#### Step 7: 모니터링 및 검증

**7.1 배포 후 성능 확인**
```
Vercel Analytics (1시간 후):

페이지 로딩 시간:
- 메인 페이지: 8.2초 → 1.8초 ✅
- /api/videos: 2.4초 → 0.2초 ✅

Lighthouse 점수:
- Performance: 45 → 92 ✅
- First Contentful Paint: 4.2s → 1.1s ✅
```

**7.2 사용자 피드백**
```
모니터링 (1주일):
- 이탈률: 45% → 12% ✅
- 평균 세션 시간: 2분 → 7분 ✅
- 페이지뷰: 30% 증가 ✅
```

---

### 성능 최적화 체크리스트

```
이미지 최적화:
☑ Next/Image 컴포넌트 사용
☑ WebP/AVIF 포맷
☑ 적절한 크기로 리사이징
☑ Lazy loading 적용

번들 최적화:
☑ Tree shaking
☑ Code splitting
☑ Dynamic imports
☑ 불필요한 라이브러리 제거

캐싱 전략:
☑ API 응답 캐싱
☑ 정적 페이지 생성
☑ CDN 활용

데이터베이스:
☑ 인덱스 추가
☑ 쿼리 최적화
☑ 필요한 컬럼만 조회

모니터링:
☑ Lighthouse 정기 실행
☑ Vercel Analytics 확인
☑ 번들 크기 추적
```

---

## 종합 요약

### 각 시나리오별 대응 시간

| 시나리오 | 즉시 대응 | 근본 해결 | 총 시간 |
|---------|---------|---------|---------|
| 1. 첫 배포 | - | 1시간 | 1시간 |
| 2. 긴급 버그 | 1분 (Rollback) | 10분 | 15분 |
| 3. 대규모 기능 | - | 1-2주 | 1-2주 |
| 4. DB 마이그레이션 | - | 2-3시간 | 반나절 |
| 5. 배포 에러 | 즉시 (취소) | 5-10분 | 10분 |
| 6. 성능 저하 | 10분 (임시 수정) | 1일 | 1일 |

### 핵심 교훈

```
1. 자동화가 핵심
   → CI/CD로 반복 작업 자동화
   → 휴먼 에러 최소화

2. 모니터링이 생명
   → 문제를 빨리 발견할수록 빨리 해결
   → 실시간 알림 설정

3. Rollback 계획 필수
   → 항상 이전 버전으로 복구 가능
   → 1분 안에 서비스 정상화

4. 단계적 배포
   → 로컬 → Preview → Staging → Production
   → 각 단계에서 검증

5. 팀 커뮤니케이션
   → 배포 전 공지
   → 문제 발생 시 즉시 공유
   → 사후 분석 문서화
```

이 시나리오 가이드로 대부분의 배포 상황에 대응할 수 있습니다! 🚀
