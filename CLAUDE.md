# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

강의 실습용 간단 쇼핑몰. 상품 목록과 상품 상세 조회만 제공하는 **프론트엔드 전용** Next.js 앱이다. 백엔드·DB·API 라우트·인증·장바구니·결제는 **의도적으로 범위에서 제외**되어 있으므로 새로 추가하지 말 것. 모든 상품 데이터는 하드코딩된 정적 배열에서 직접 import 한다.

**현재 상태**: 실습 시작 지점. 프로젝트 스캐폴드(Next.js + TypeScript + Tailwind 설정, 루트 레이아웃, 상품 이미지)와 PRD만 있고 **기능 코드는 아직 구현되어 있지 않다**. 아래 "구현할 구조"는 앞으로 만들어야 할 목표 구조다.

전체 사양은 `docs/prd/`에 정의되어 있다 (`README.md` = 공통 사양, `feature-01-*` = 상품 목록, `feature-02-*` = 상품 상세). 기능을 구현·변경할 때는 해당 PRD의 수용 기준을 기준으로 삼는다. 상품 6종의 이름·가격·설명 요지는 `docs/prd/README.md`의 "샘플 데이터" 표에 확정되어 있으므로 임의로 바꾸지 말 것.

## 브랜치 전략

이 저장소는 다음 세 가지 브랜치로 운영한다.

- **`main`** — 수강생과 함께 시작하는 **스캐폴드**. 상품 구현 코드는 절대 병합하지 않는다. PRD·에셋·공통 설정·문서만 유지한다.
- **`dev`** — 구현된 기능을 통합하는 브랜치. 모든 `feature/*` 브랜치가 병합되는 곳.
- **`feature/*`** — 기능 구현 브랜치. **항상 `dev`에서 분기**해 작업하고, 완료되면 `dev`에 병합한다.

### 작업 흐름

1. 작업할 기능은 `dev`에서 `feature/<기능명>` 브랜치를 새로 만든다.
2. 해당 브랜치에서 구현하고 커밋한다.
3. PR/병합으로 `dev`에 통합한다.
4. `main`에는 어떤 구현도 직접 올리지 않는다.

> CI는 `main`, `dev`, `feature/*` 브랜치에서 모두 실행된다 (`.github/workflows/ci.yml`).

## 이슈 라벨 (신호등)

이슈 라벨은 에이전트 루프가 읽는 신호다. 전체 규약은 **`docs/github-labels.md`**(SSOT)에 정의되어 있으며, 라벨을 붙이거나 바꿀 때는 이 규칙을 따른다.

- **진행 신호** — 한 이슈에 **동시에 하나만**. 바꿀 때는 이전 것을 떼고 새 것을 붙인다 (두 개가 같이 붙으면 루프가 중복 출발한다).
  `status: needs-triage`(새 이슈 접수) → `agent: ready`(Planner 다듬기 완료 · 반려 복귀 · 구현 루프 출발 신호) → `status: in-progress`(작업 중) → `status: in-review`(PR 올라감 · 코드 리뷰) → `status: in-security`(보안 검수) → `status: in-qa`(QA 검문) → `status: awaiting-approval`(승인 대기) → `status: done`(머지 완료)
- **검증은 한 방향** — 코드 리뷰 → 보안 → QA 순서로만 흐른다. 어느 검문소에서 반려되든 `agent: ready`로 돌아가고(Planner 재거치 없음), 다시 올라온 PR은 `status: in-review`부터 전 검문소를 다시 통과한다.
- **종류 스티커** — 여러 개 붙어도 됨: `type: bug` · `type: feature` · `type: polish`
- **Planner 루프**는 `status: needs-triage`를 `agent: ready`로 교체한다. **구현 루프**는 `agent: ready` → `status: in-progress` → PR 후 `status: in-review`로 교체한다(연결된 PR이 이미 있는 `agent: ready`는 반려 수정 — PR의 반려 댓글부터 읽는다). **코드 리뷰어**는 `status: in-review`, **보안 검수원**은 `status: in-security`, **QA**는 `status: in-qa`를 보고, 통과 시 다음 검문소로 넘긴다.
- 라벨 교체는 한 명령으로: `gh issue edit <번호> --add-label "<새 라벨>" --remove-label "<옛 라벨>"`

### 라벨 정의 (이름 · 색 · 설명)

저장소에 없으면 아래 값 그대로 만든다: `gh label create "<이름>" --color <HEX> --description "<설명>" --force`. 이름·색·설명을 임의로 바꾸지 말 것.

| 라벨 | 색 | 설명 |
|---|---|---|
| `status: needs-triage` | `E4A11B` | 새 이슈 접수됨 — Planner가 다듬을 차례 |
| `agent: ready` | `1D76DB` | 다듬기 완료·반려 복귀 — 구현 루프 출발 신호 |
| `status: in-progress` | `0E8A16` | 구현 루프가 작업 중 |
| `status: in-review` | `5319E7` | PR 올라감 — 코드 리뷰 대기 |
| `status: in-security` | `B60205` | 코드 리뷰 통과 — 보안 검수 대기 |
| `status: in-qa` | `D93F0B` | 보안 검수 통과 — QA 검문 대기 |
| `status: awaiting-approval` | `00B8D9` | 검증 루프 전원 통과 — 내 승인 대기 |
| `status: done` | `6B7280` | 머지 완료 — 끝 |
| `type: bug` | `D73A4A` | 버그 — 예상과 다르게 동작함 |
| `type: feature` | `A2EEEF` | 새 기능 |
| `type: polish` | `F9D0C4` | 다듬기·개선 |

### 라벨 이름 규칙

- **소문자 + 접두어**: 진행 상황은 `status:`, 종류는 `type:`. `agent: ready`만 출발 전용 신호라 `agent:` 접두어를 쓴다. 대소문자·하이픈 변형(`Status-Ready`)을 만들지 않는다.
- **설명 필수**: "이 라벨이 붙으면 무슨 일이 일어나는가" 한 줄.
- **색은 신호의 언어**: 노랑=접수 · 파랑=출발 · 초록=작업 중 · 보라=코드 리뷰 · 적갈색=보안 · 주황=QA · 하늘색=승인 대기 · 회색=끝.
- **새 라벨은 문서가 먼저**: `docs/github-labels.md`에 추가한 뒤에 GitHub에 만든다. 문서에 없는 라벨은 존재하지 않는 신호다.
- GitHub 기본 라벨(`documentation` · `enhancement` · `good first issue` · `help wanted` · `question`)은 그대로 둔다. 기본 `bug`는 `type: bug`로 대체하며, `duplicate` · `invalid` · `wontfix`는 쓰지 않는다.

## 명령어

패키지 매니저는 **pnpm**을 사용한다 (`pnpm-lock.yaml`, `pnpm-workspace.yaml` 존재).

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 (http://localhost:3000)
pnpm build         # 프로덕션 빌드
pnpm start         # 빌드 결과 실행
pnpm lint          # ESLint 검사
```

테스트 프레임워크는 설정되어 있지 않다.

## 아키텍처

Next.js **App Router** + TypeScript(strict) + **Tailwind CSS v4**.

### 지금 있는 것 (스캐폴드)

- `src/app/layout.tsx` — 루트 레이아웃. `<html lang="ko">`로 감싸고 `children`을 `<main>`에 렌더한다. 공통 `Header`는 구현하면서 여기에 붙인다.
- `src/app/globals.css` — Tailwind 지시어.
- `public/images/product-01.png` ~ `product-06.png` — 상품 6종 이미지 (PRD 샘플 데이터의 `imageUrl`과 1:1 대응).
- `next.config.ts` — `images.unoptimized: true`. 실습 중 같은 파일명으로 이미지를 교체해도 `next/image` 캐시 때문에 옛 이미지가 남는 문제를 피하려는 설정이다.
- **경로 별칭**: `@/*` → `src/*` (tsconfig).

### 구현할 구조 (PRD 기준)

- **데이터 흐름**: `src/data/products.ts`가 `Product` 타입과 6개 상품 배열을 export 하는 단일 진실 공급원(SSOT)이 된다. 페이지·컴포넌트는 이 배열을 직접 import 해서 렌더링한다. 서버에서 데이터를 가져오지 않으므로 fetch/API 로직이 없다.
- **라우팅**:
  - `src/app/page.tsx` — 홈(`/`)은 `redirect("/products")`만 수행.
  - `src/app/products/page.tsx` — 상품 목록(그리드).
  - `src/app/products/[id]/page.tsx` — 상품 상세. `params`는 **Promise 타입**이라 `await params`로 풀어야 한다(Next.js 16). `products.find`로 조회하고 없으면 `notFound()`(404). `generateStaticParams`로 6개 경로를 정적 생성한다.
- **컴포넌트**: `src/components/`에 `ProductCard`(목록 카드, 카드 전체가 상세 링크), `Header`(사이트명 "패캠 스토어" → `/products`).
- **유틸**: `src/lib/format.ts`의 `formatPrice()`.

> `src/app/page.tsx`가 아직 없으므로 `pnpm dev` 후 `/`는 404다. 상품 목록을 만들면서 함께 채운다.

## 이 코드베이스의 규칙 (PRD 기반)

- 사용자 노출 텍스트는 **모두 한글**.
- 가격 표시는 반드시 `src/lib/format.ts`의 `formatPrice()`를 사용한다 (`12,000원` 형식). 직접 포맷하지 말 것.
- 이미지는 **`next/image`**만 사용하고 `imageUrl`은 `/images/`로 시작하는 로컬 경로만. 모든 이미지에 `alt`(상품명) 필수.
- `any` 금지. 컴포넌트·데이터에 명시적 타입.
- 상품을 추가할 때는 `src/data/products.ts` 배열에 항목을 넣고 대응하는 이미지를 `public/images/`에 둔다. `id`는 고유 문자열, `price`는 정수(원).
