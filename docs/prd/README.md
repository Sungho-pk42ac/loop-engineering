# PRD: 간단 쇼핑몰

강의 실습용 간단 쇼핑몰의 제품 요구사항 정의서(PRD)입니다.
**기능별로 파일이 분리**되어 있으며, 각 기능 문서는 이 공통 문서(`README.md`)의 규칙을 전제로 합니다.

## 문서 구성

| 파일 | 내용 |
|------|------|
| `README.md` (이 문서) | 공통 사양 — 개요, 기술 스택, 프로젝트 구조, 데이터 모델, 공통 UI, 유틸 |
| `feature-01-product-list.md` | 기능 1 — 상품 목록 (`/products`) |
| `feature-02-product-detail.md` | 기능 2 — 상품 상세 / 조회 (`/products/[id]`) |

> 각 기능 문서는 독립적으로 읽고 구현할 수 있도록, 필요한 데이터 모델·경로를 이 공통 문서에서 참조한다.

---

## 1. 개요

Next.js 기반의 간단한 쇼핑몰. 사용자는 **상품 목록을 보고**, **개별 상품의 상세 정보를 조회**할 수 있다. 강의 실습용으로 구조의 단순함과 명확함을 최우선으로 한다.

### 범위
- **포함**: 상품 목록 화면, 상품 상세 화면, 정적(하드코딩) 상품 데이터, localStorage 목업 인증(회원가입/로그인/로그아웃, 서버 없음)
- **제외**: 백엔드/DB/API 서버, 검색·필터·정렬, 장바구니·결제·주문, 관리자 기능, 상품 등록/수정/삭제

---

## 2. 기술 스택 (고정)

| 항목 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 데이터 | 프론트엔드 전용 · 하드코딩 배열 (`src/data/products.ts`) |
| 이미지 | 로컬 파일 (`public/images/*`) |

> 백엔드·DB·API 라우트는 사용하지 않는다. 모든 데이터는 정적 배열에서 직접 import 한다.

---

## 3. 프로젝트 구조

```
fastcampus-intro/
├── public/
│   └── images/
│       ├── product-01.png ~ product-06.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (공통 헤더 포함)
│   │   ├── page.tsx                # 홈 → /products 노출/리다이렉트
│   │   ├── globals.css             # Tailwind 지시어
│   │   └── products/
│   │       ├── page.tsx            # 기능 1: 상품 목록
│   │       └── [id]/
│   │           └── page.tsx        # 기능 2: 상품 상세
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   └── Header.tsx
│   ├── data/
│   │   └── products.ts             # 상품 데이터 + 타입
│   └── lib/
│       └── format.ts               # 가격 포맷 유틸
├── docs/prd/                       # 본 PRD 문서들
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 데이터 모델

`src/data/products.ts` 에 정의한다.

```ts
export interface Product {
  id: string;          // 고유 식별자. 라우팅(/products/[id])에 사용
  name: string;        // 상품명
  price: number;       // 가격 (단위: 원, 정수)
  imageUrl: string;    // 로컬 이미지 경로. 예: "/images/product-01.png"
  description: string; // 상세 설명 (2~4문장)
}

export const products: Product[] = [ /* 아래 표의 6개 상품 */ ];
```

### 규칙
- `id`는 문자열이며 고유. (예: `"1"` … `"6"`)
- `price`는 정수(원). 화면에서는 `formatPrice`로 `12,000원` 형식 표시.
- `imageUrl`은 반드시 `/images/`로 시작하는 로컬 경로.
- `products` 라는 이름의 `Product[]` 배열로 export.

### 샘플 데이터 (6개, 확정)

| id | name | price | imageUrl | description(요지) |
|----|------|-------|----------|-------------------|
| 1 | 미니멀 화이트 머그컵 | 12000 | /images/product-01.png | 군더더기 없는 300ml 세라믹 머그컵. 전자레인지·식기세척기 사용 가능. |
| 2 | 원목 도마 세트 | 29000 | /images/product-02.png | 아카시아 원목 대·소 2종 도마 세트. 자연스러운 나뭇결. |
| 3 | 코튼 캔버스 에코백 | 18000 | /images/product-03.png | 두툼한 12온스 캔버스 데일리 에코백. 안주머니 1개. |
| 4 | 아로마 소이 캔들 | 22000 | /images/product-04.png | 100% 천연 소이왁스 향초. 은은한 우디 향, 약 40시간 연소. |
| 5 | 스테인리스 텀블러 500ml | 25000 | /images/product-05.png | 이중 진공 단열. 6시간 보온·12시간 보냉. 누수 방지 뚜껑. |
| 6 | 리넨 룸슬리퍼 | 15000 | /images/product-06.png | 통기성 좋은 리넨 실내 슬리퍼. 논슬립 밑창. |

> `description`은 위 요지를 바탕으로 2~4문장의 자연스러운 한글 설명으로 완성한다.

---

## 5. 공통 UI

### 헤더 (`components/Header.tsx`)
- 모든 페이지 상단에 노출 (`layout.tsx`에 포함).
- 좌측에 사이트명 텍스트 **"패캠 스토어"**, 클릭 시 `/products`로 이동.

### 레이아웃
- 중앙 정렬 컨테이너 (예: `max-w-6xl mx-auto px-4`).
- 모바일 우선 반응형, Tailwind 기본 브레이크포인트.

---

## 6. 유틸리티

`src/lib/format.ts`:

```ts
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}
```

- 모든 가격 표시는 이 함수를 사용한다.

---

## 7. 비기능 요구사항 / 제약

- **언어**: 모든 사용자 노출 텍스트는 한글.
- **타입 안전성**: 모든 컴포넌트·데이터에 TypeScript 타입 명시. `any` 금지.
- **이미지**: `next/image` 사용, 로컬 경로만 사용. 모든 이미지에 `alt`(상품명) 지정.
- **에러 처리**: 없는 상품은 `notFound()`(404)로 처리.

---

## 8. 이미지 생성 프롬프트

아래 프롬프트로 이미지를 생성해 지정 경로에 저장한다. (사용자가 직접 생성)
공통 스타일: **밝은 배경, 부드러운 자연광, 1:1 정사각형, 제품 중앙 배치, 미니멀 이커머스 제품 사진**.

| 파일 경로 | 상품 | 프롬프트 |
|-----------|------|----------|
| `public/images/product-01.png` | 미니멀 화이트 머그컵 | A minimalist white ceramic mug, 300ml, soft neutral background, studio product photography, natural soft light, centered, 1:1 |
| `public/images/product-02.png` | 원목 도마 세트 | A set of two acacia wood cutting boards showing natural grain, light table, warm soft lighting, top-down, 1:1, minimal e-commerce |
| `public/images/product-03.png` | 코튼 캔버스 에코백 | A natural beige cotton canvas tote bag, thick 12oz fabric, plain light background, soft studio light, centered, 1:1 |
| `public/images/product-04.png` | 아로마 소이 캔들 | An aroma soy candle in a frosted glass jar, warm cozy glow, minimal light background, centered, 1:1 |
| `public/images/product-05.png` | 스테인리스 텀블러 500ml | A sleek stainless steel insulated tumbler with leak-proof lid, matte finish, clean light background, centered, 1:1 |
| `public/images/product-06.png` | 리넨 룸슬리퍼 | A pair of natural linen indoor slippers with non-slip soles, soft light background, cozy minimal, centered, 1:1 |

---

## 9. 완료(Done) 정의

- [ ] Next.js(App Router) + TypeScript + Tailwind 프로젝트가 실행된다.
- [ ] `src/data/products.ts`에 `Product` 타입과 6개 상품 배열이 존재한다.
- [ ] 기능 1(상품 목록) 수용 기준을 모두 만족한다. → `feature-01-product-list.md`
- [ ] 기능 2(상품 상세) 수용 기준을 모두 만족한다. → `feature-02-product-detail.md`
- [ ] 가격은 전 화면에서 `formatPrice`로 콤마 포맷 표시된다.
- [ ] 사용자 노출 텍스트가 모두 한글이다.
