# GitHub Actions 설정 가이드

이 문서는 CI/CD 파이프라인을 위한 GitHub Secrets 설정 방법을 안내합니다.

## 필수 Secrets

Repository → Settings → Secrets and variables → Actions에서 다음 secrets를 추가하세요:

### Vercel 관련

| Secret Name | 설명 | 획득 방법 |
|------------|------|----------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Account Settings](https://vercel.com/account/tokens)에서 생성 |
| `VERCEL_ORG_ID` | Vercel Organization ID | `.vercel/project.json` 파일에서 확인 |
| `VERCEL_PROJECT_ID` | Vercel Project ID | `.vercel/project.json` 파일에서 확인 |

### Supabase 관련

| Secret Name | 설명 | 획득 방법 |
|------------|------|----------|
| `SUPABASE_ACCESS_TOKEN` | Supabase Access Token | [Supabase Access Tokens](https://app.supabase.com/account/tokens)에서 생성 |
| `SUPABASE_PROJECT_ID` | Supabase Project Reference | Supabase Dashboard → Settings → General → Reference ID |

---

## 단계별 설정

### 1. Vercel Token 생성

1. [Vercel Account Settings → Tokens](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. Token name 입력 (예: "GitHub Actions")
4. Scope: "Full Account" 선택
5. Expiration: "No Expiration" 또는 적절한 기간 선택
6. "Create Token" 클릭
7. 생성된 토큰 복사 (한 번만 표시됩니다!)

### 2. Vercel Project ID & Org ID 확인

프로젝트를 Vercel과 한 번 연결해야 합니다:

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 연결
vercel link

# Project IDs 확인
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxx"
}
```

### 3. Supabase Access Token 생성

1. [Supabase Access Tokens](https://app.supabase.com/account/tokens) 접속
2. "Generate new token" 클릭
3. Token name 입력 (예: "GitHub Actions")
4. "Generate token" 클릭
5. 생성된 토큰 복사

### 4. Supabase Project ID 확인

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. 프로젝트 선택
3. Settings → General → Reference ID 복사

### 5. GitHub Secrets 추가

1. GitHub 저장소 → Settings 탭
2. Secrets and variables → Actions 클릭
3. "New repository secret" 클릭
4. 각 secret을 하나씩 추가:
   - Name: `VERCEL_TOKEN`
   - Secret: (복사한 Vercel token)
   - "Add secret" 클릭
5. 나머지 secrets도 동일하게 추가

---

## 검증

모든 secrets를 추가한 후, 테스트 푸시를 해보세요:

```bash
git add .
git commit -m "test: CI/CD setup"
git push origin main
```

Actions 탭에서 워크플로우 실행 상태를 확인할 수 있습니다.

---

## 환경별 Secrets (선택사항)

프로덕션과 스테이징을 분리하려면:

### Environment Secrets 사용

1. Repository → Settings → Environments
2. "New environment" 클릭
3. Environment name: "production" 입력
4. "Configure environment" 클릭
5. Environment secrets 추가

워크플로우에서 사용:

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 보안 권장사항

1. **최소 권한 원칙**: 필요한 최소한의 권한만 부여
2. **토큰 만료 설정**: 가능하면 토큰에 만료일 설정
3. **정기적 갱신**: 3-6개월마다 토큰 갱신
4. **모니터링**: Actions 로그에서 비정상 활동 감시
5. **접근 제한**: Repository 접근 권한 관리

---

## 문제 해결

### "Invalid Vercel Token" 에러

- 토큰이 정확히 복사되었는지 확인
- 토큰이 만료되지 않았는지 확인
- Scope가 충분한지 확인

### "Project not found" 에러

- `VERCEL_PROJECT_ID`가 정확한지 확인
- `VERCEL_ORG_ID`가 정확한지 확인
- 프로젝트가 해당 organization에 속해있는지 확인

### Supabase 마이그레이션 실패

- `SUPABASE_ACCESS_TOKEN`이 유효한지 확인
- `SUPABASE_PROJECT_ID`가 정확한지 확인
- Supabase CLI 버전 확인

### Secrets가 적용되지 않음

- Secret 이름의 대소문자 확인
- 워크플로우 파일의 secret 참조 확인: `${{ secrets.SECRET_NAME }}`
- Repository secrets vs Environment secrets 확인

---

## 추가 리소스

- [GitHub Actions Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel CLI 문서](https://vercel.com/docs/cli)
- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
