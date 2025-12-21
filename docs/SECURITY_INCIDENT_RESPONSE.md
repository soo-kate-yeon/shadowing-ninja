# 🚨 보안 사고 대응 가이드

## 시나리오 1: 환경 변수를 Git에 올려버렸어요!

### 즉시 조치 (5분 이내)

#### 1단계: 피해 범위 확인

```bash
# 어떤 키가 노출되었는지 확인
git show HEAD:.env
# 또는
git log --all --full-history --source -- .env
```

#### 2단계: 즉시 키 무효화

**노출된 키별 대응**:

**Supabase 키**:
```
1. Supabase Dashboard → Settings → API
2. "Reset" 버튼 클릭 (service_role_key)
3. 새 키 복사
4. 모든 환경에 업데이트:
   - Vercel Environment Variables
   - 로컬 .env.local
   - GitHub Secrets (필요시)
```

**Google AI API 키**:
```
1. Google Cloud Console 접속
2. API & Services → Credentials
3. 노출된 키 삭제
4. 새 키 생성
5. 모든 환경에 업데이트
```

**Vercel Token**:
```
1. Vercel Account Settings → Tokens
2. 노출된 토큰 삭제
3. 새 토큰 생성
4. GitHub Secrets 업데이트
```

#### 3단계: Git 히스토리에서 완전 삭제

```bash
# ⚠️ 주의: 협업 중이라면 팀원들과 먼저 상의!

# 1. git-filter-repo 설치 (최초 1회)
brew install git-filter-repo
# 또는
pip install git-filter-repo

# 2. .env 파일 히스토리에서 완전 삭제
git filter-repo --path .env --invert-paths

# 3. 강제 푸시 (위험!)
git push origin --force --all
```

**또는 BFG Repo-Cleaner 사용**:
```bash
# 1. BFG 다운로드
brew install bfg

# 2. 저장소 클론 (bare)
git clone --mirror https://github.com/user/repo.git

# 3. 민감한 파일 삭제
bfg --delete-files .env repo.git

# 4. 정리 및 푸시
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push
```

---

### 예방 조치

#### .gitignore 강화

```bash
# .gitignore에 추가
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test

# 특정 키워드 포함 파일
*secret*
*private*
*credentials*
```

#### Pre-commit Hook 설정

```bash
# .git/hooks/pre-commit 생성
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

# .env 파일 커밋 차단
if git diff --cached --name-only | grep -E '\.env$|\.env\..*'; then
    echo "❌ ERROR: .env 파일을 커밋하려고 합니다!"
    echo "   환경 변수 파일은 커밋하면 안됩니다."
    exit 1
fi

# API 키 패턴 검사
if git diff --cached | grep -E 'AIzaSy[0-9A-Za-z_-]{33}'; then
    echo "❌ ERROR: Google API 키가 감지되었습니다!"
    exit 1
fi

if git diff --cached | grep -E 'eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'; then
    echo "❌ ERROR: JWT 토큰이 감지되었습니다!"
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

#### GitHub Secret Scanning

```
1. GitHub Repository → Settings → Security
2. "Secret scanning" 활성화
3. "Push protection" 활성화

→ 푸시 시 자동으로 비밀 정보 차단!
```

---

## 시나리오 2: API 키가 유출된 것 같아요

### 확인 방법

#### GitHub에서 검색
```
1. GitHub에서 저장소 검색
2. 검색어:
   - AIzaSy
   - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   - sbp_
   - sk_live_
```

#### 외부 노출 확인
```
1. https://github.com/search 접속
2. 검색: "your-api-key" OR "your-domain.com"
3. 본인 저장소가 검색되면 유출!
```

### 대응 방법

1. **즉시 키 무효화** (위의 2단계 참고)
2. **Git 히스토리 정리** (위의 3단계 참고)
3. **모니터링 강화**:
   ```
   - API 사용량 급증 확인
   - 비정상 접속 패턴 감지
   - 청구서 확인
   ```

---

## 시나리오 3: 프로덕션 키를 Preview에 노출했어요

### 문제
```
Vercel Preview 배포는 공개 URL
→ 누구나 접속 가능
→ SUPABASE_SERVICE_ROLE_KEY 같은 민감한 키가 노출되면 위험!
```

### 해결책

#### Vercel Environment Variables 재설정

```
1. Vercel → Settings → Environment Variables
2. 민감한 키 (SERVICE_ROLE_KEY 등):
   ✅ Production만 체크
   ❌ Preview 체크 해제
   ❌ Development 체크 해제

3. 공개 키 (NEXT_PUBLIC_* 등):
   ✅ Production 체크
   ✅ Preview 체크
   ✅ Development 체크
```

#### Preview 환경용 별도 키 사용

```
1. Supabase에서 Preview용 Project 생성
   (또는 개발용 키 사용)

2. Vercel Environment Variables:
   - Production: 실제 프로덕션 키
   - Preview: 개발/테스트용 키
```

---

## 보안 체크리스트

### 커밋 전 확인

```
☑ .env 파일이 .gitignore에 있는가?
☑ git status에 .env가 안 보이는가?
☑ 실제 키 값이 코드에 하드코딩되지 않았는가?
☑ console.log에 키 값이 없는가?
```

### 배포 전 확인

```
☑ GitHub Secrets 설정 완료?
☑ Vercel Environment Variables 설정 완료?
☑ SERVICE_ROLE_KEY는 Production만?
☑ Public 키와 Private 키 구분?
```

### 정기 점검 (월 1회)

```
☑ API 키 사용량 확인
☑ 청구서 이상 없는지 확인
☑ Git 히스토리에 키 노출 없는지
☑ 팀원들이 보안 수칙 준수하는지
```

---

## 비상 연락처

### 키가 유출되었다면:

1. **Supabase**: https://app.supabase.com/support
2. **Google Cloud**: https://cloud.google.com/support
3. **Vercel**: https://vercel.com/support
4. **GitHub**: https://github.com/contact

### 보고 절차

1. 팀 리더에게 즉시 알림
2. 영향 받은 서비스 확인
3. 키 무효화 완료 보고
4. 사후 보고서 작성

---

## 참고 자료

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Git 히스토리 정리](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

**기억하세요**:
- 키가 유출되면 즉시 무효화
- Git 히스토리는 공개 기록
- 예방이 최선의 방어
