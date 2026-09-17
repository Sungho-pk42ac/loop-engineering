# 디자인 토큰 — 무신사 스토어

> **이 문서의 역할**: 프론트엔드가 색·글자·간격·라운드·모션을 **한 곳의 이름**으로 쓰게 하는 규약(SSOT).
> 토큰 정의 파일은 `src/styles/tokens.css`. 이 문서는 "왜 이 이름·이 값인가"와 "어떻게 쓰는가"를 설명한다.
>
> 참고: [KRDS 디자인 토큰](https://www.krds.go.kr/html/site/style/style_07.html)의 3계층 구조와 스타일 가이드(색상·타이포·형태·레이아웃), 무신사(musinsa.com) MDS 2.0 CSS에서 추출한 실제 값.

---

## 0. 한 문장 요약

> 컴포넌트는 **시멘틱 토큰만** 쓴다. 프리미티브(원색 값)는 시멘틱을 만들 때만 참조하고, 화면 코드에 HEX·px 를 직접 적지 않는다.

---

## 1. 3계층 구조 (KRDS 방식)

| 계층 | 위치 | 이름 규칙 | 예 | 누가 쓰나 |
|------|------|-----------|-----|-----------|
| **프리미티브** | `:root` 의 `--ms-*` | `--ms-{종류}-{단계}` | `--ms-gray-50`, `--ms-blue-60` | 시멘틱 정의 전용. 컴포넌트에서 금지 |
| **시멘틱** | `@theme` 의 `--color-*`, `--text-*`, `--radius-*` … | `--{속성}-{역할}-{변형}` | `--color-ink-secondary`, `--radius-md` | 모든 컴포넌트. Tailwind 유틸리티로 노출 |
| **컴포넌트** | 각 컴포넌트 파일 | `--{컴포넌트}--{속성}` (더블대시) | `--button--primary-bg: var(--color-brand)` | 해당 컴포넌트 내부만 |

- 프리미티브는 `@theme` 밖에 두었으므로 **Tailwind 유틸리티가 생성되지 않는다**. `bg-[--ms-gray-50]` 같은 임의값 우회도 리뷰에서 반려한다.
- `--color-*: initial` 로 Tailwind 기본 팔레트(`zinc`, `slate` …)를 지웠다. `bg-zinc-50` 은 컴파일되지 않는다. 이것이 "균일하게" 를 강제하는 장치다.

---

## 2. 색상

### 2.1 프리미티브 팔레트

무신사는 **블랙/화이트 무채색이 주역**이고, 유채색은 링크(블루)·세일(레드)·상태 표시에만 쓴다. KRDS 의 0~100 명도 단계에 무신사 그레이를 배치했다.

| 단계 | gray | 무신사 용례 |
|------|------|-------------|
| 0 | `#ffffff` | 페이지 배경 |
| 5 | `#f5f5f5` | 섹션·칩 배경 |
| 10 | `#f0f0f0` | 구분 영역 |
| 20 | `#ebebeb` | 옅은 선 |
| 30 | `#e0e0e0` | 기본 선 |
| 40 | `#cccccc` | 비활성 글자·품절 |
| 50 | `#8a8a8a` | 보조 글자(정가 취소선) |
| 60 | `#666666` | 보조 글자 |
| 70 | `#4a4a4a` | 부제 |
| 80 | `#2a2a2a` | 호버 블랙 |
| 90 | `#171717` | 다크 배경 |
| 100 | `#000000` | 본문·브랜드 |

유채색: blue 40/50/60 (`#37b0f4` `#3a6eff` `#245eff`), red 40/50/60 (`#f73c3b` `#f31110` `#b90000`), orange 50 `#ff5f00`, yellow 50 `#f7e74b`, green 50 `#00a651`, teal 40 `#64b4cc`(기획전 캠페인 배경).

### 2.2 시멘틱 색상 (컴포넌트가 쓰는 이름)

KRDS 분류(배경·텍스트·보더·아이콘·상태)에 커머스 전용(가격)을 더했다.

| 그룹 | 토큰 | 라이트 값 | 용도 |
|------|------|-----------|------|
| surface | `surface` | gray-0 | 페이지·카드 기본 배경 |
| | `surface-subtle` | gray-5 | 섹션 구분, 입력 배경 |
| | `surface-muted` | gray-10 | 스켈레톤, 비활성 영역 |
| | `surface-campaign` | teal-40 (다크 동일) | 기획전 섹션 전체 폭 캠페인 배경. 위 글자는 `ink`(다크 모드에서도 검정 — `dark:text-ink-inverse`), 흰 글자는 대비 미달이라 금지 |
| | `surface-campaign-action` | black 15% (다크 동일) | 캠페인 배경 위 반투명 버튼(기획전 '관련 세일 상품 더보기') |
| | `surface-campaign-chip` / `-chip-icon` / `-chip-active` | white 20% / white 60% / gray-0 (다크 동일) | 캠페인 배경 위 브랜드 칩 기본 배경 / 칩 로고 원 / 선택 칩 배경. 글자는 캠페인 배경 규칙대로 검정 |
| | `surface-sunken` | gray-20 (다크: gray-70) | 한 단계 더 내려간 띠(검색 결과 서브탭 줄) |
| | `surface-inverse` | gray-100 | 검정 버튼·헤더 |
| | `surface-overlay` | black 60% | 모달 뒤 딤, 이미지 위 딤·라벨(배너 딤, 라이브 방송 시각 배지) |
| ink | `ink` | gray-100 | 본문, 상품명 |
| | `ink-secondary` | gray-70 | 설명, 부제 |
| | `ink-tertiary` | gray-50 | 메타 정보, 정가 |
| | `ink-muted` | gray-60 (다크: gray-40) | 비선택 탭·결과 개수·카드 보조 설명·회색 밑줄 '더보기' 링크 — 회색 배경 위에서도 4.5:1 |
| | `ink-disabled` | gray-40 | 비활성 |
| | `ink-inverse` | gray-0 | 검정 배경 위 글자 |
| | `ink-link` | blue-60 | 텍스트 링크 |
| | `ink-promo-inverse` | red-50 (다크: red-60) | 반전 배경(검정 헤더) 위 기획전 강조 글자 — 두 모드 모두 4.5:1 |
| line | `line` / `line-subtle` / `line-strong` | gray-30 / 20 / 100 | 카드 테두리 / 리스트 구분선 / 선택 강조 |
| icon | `icon` / `icon-muted` / `icon-inverse` | gray-100 / 50 / 0 | |
| action | `brand` / `brand-hover` | gray-100 / 80 | 주 버튼(무신사 블랙 버튼) |
| | `accent` / `accent-hover` | blue-60 / 50 | 보조 CTA, 선택 상태 |
| status | `danger` `warning` `success` `info` | red-50, orange-50, green-50, blue-40 | 폼 오류, 안내 |
| price | `price` | gray-100 | 판매가 |
| | `price-sale` | red-50 | 할인율·세일가 |
| | `price-original` | gray-50 | 취소선 정가 |
| | `soldout` | gray-40 | 품절 라벨 |
| rank | `rank-up` / `rank-down` | red-50 / blue-60 | 검색어·랭킹 순위 상승 ▲ / 하락 ▼ (유지는 `ink-tertiary`) |

Tailwind 유틸리티: `bg-surface-subtle`, `text-ink-secondary`, `border-line`, `bg-brand hover:bg-brand-hover`, `text-price-sale`.

### 2.3 명도 대비 규칙 (KRDS 매직넘버)

- 본문 글자(`ink`, `ink-secondary`)는 배경 대비 **4.5:1 이상** (KRDS 매직넘버 50).
- 보조 글자(`ink-tertiary`)·선·아이콘은 **3:1 이상** (매직넘버 40). `ink-tertiary`(gray-50, #8a8a8a) 는 흰 배경에서 약 3.3:1 이므로 **본문에 쓰지 않는다**.
- `ink-disabled` 는 대비 기준 예외(비활성 상태 표시용).

### 2.4 선명한 화면 모드(다크)

`prefers-color-scheme: dark` 에서 **시멘틱만** 뒤집는다. 프리미티브는 그대로. KRDS 규칙대로 레이어가 쌓일수록 밝아진다(surface gray-100 → subtle gray-90 → muted gray-80). 상태색·세일색은 두 모드에서 동일.

---

## 3. 타이포그래피

### 3.1 서체

`--font-sans`: **Pretendard** → Pretendard Variable → Apple SD Gothic Neo → Noto Sans KR → system-ui. (무신사·KRDS 모두 Pretendard.) 웹폰트는 루트 레이아웃에서 jsDelivr 동적 서브셋으로 로딩한다.

### 3.2 타입 스케일

무신사 실측(11~16px 본문, 20~42px 제목)을 KRDS 역할 이름에 맞춘 9단계. `text-{이름}` 하나로 크기+행간이 같이 적용된다. 자간은 전부 0(무신사 기준).

| 토큰 | 크기 / 행간 | 굵기 권장 | 용도 |
|------|-------------|-----------|------|
| `display` | 42 / 52 | 700 | 프로모션 히어로 |
| `heading` | 32 / 42 | 700 | 페이지 제목(PC) |
| `title-lg` | 24 / 32 | 700 | 섹션 제목 |
| `title` | 20 / 28 | 600 | 상품 상세 이름, 가격 강조 |
| `title-sm` | 18 / 26 | 600 | 카드 그룹 제목 |
| `body-lg` | 16 / 24 | 400 | 상세 설명 |
| `body` | 14 / 20 | 400 | 기본 본문, 카드 상품명 |
| `label` | 13 / 18 | 500 | 버튼, 탭, 가격(카드) |
| `detail` | 12 / 16 | 400 | 메타, 브랜드명 |
| `caption` | 11 / 14 | 400 | 뱃지, 안내 문구 |

굵기: `font-regular`(400) `font-medium`(500) `font-semibold`(600) `font-bold`(700). 무신사는 상품명 400/500, 가격 600/700.

반응형: KRDS 처럼 모바일에서 `heading` → `title-lg`, `display` → `heading` 으로 한 단계 낮춘다. 예: `text-title-lg md:text-heading`.

---

## 4. 간격

**4px 베이스** (`--spacing: 4px`). Tailwind 숫자 유틸과 1:1.

| 유틸 | 값 | 무신사 용례 |
|------|----|-------------|
| `1` | 4px | 뱃지 내부, 아이콘-텍스트 사이 |
| `2` | 8px | 카드 내부 요소 간격 |
| `3` | 12px | 칩·버튼 좌우 패딩(소) |
| `4` | 16px | 카드 패딩, 그리드 거터(모바일), 화면 여백(모바일) |
| `6` | 24px | 섹션 내부 간격, 거터·화면 여백(PC) |
| `8` | 32px | 제목-본문 사이 |
| `10` | 40px | 섹션 사이 |
| `16` | 64px | 큰 영역 사이(KRDS 레이아웃 섹션) |

이 8개 이외의 값(5, 7, 9 …)은 쓰지 않는다. 홀수 픽셀 여백이 필요해 보이면 디자인이 그리드에서 벗어난 것이다.

이 규칙은 **여백·간격**(`p-*` `m-*` `gap-*` `space-*`)에만 적용된다. 컴포넌트 **크기**(`h-*` `w-*`)는 §5.1 라운드 표의 컨테이너 크기(버튼 32/40/48px, 헤더 56px 등)를 따르며, 4px 배수이면 된다.

---

## 5. 형태

### 5.1 라운드 (KRDS: 컨테이너 높이 × 0.125, 짝수 반올림)

| 토큰 | 값 | 대상 |
|------|----|------|
| `rounded-xs` | 2px | 뱃지, 할인율 라벨, 프로그레스 |
| `rounded-sm` | 4px | 칩, 체크박스, 태그, 작은 버튼 |
| `rounded-md` | 6px | 버튼(40~48px), 입력 |
| `rounded-lg` | 8px | 상품 카드 이미지(무신사 기본) |
| `rounded-xl` | 10px | 카드 컨테이너, 다이얼로그 |
| `rounded-2xl` | 12px | 배너, 바텀시트 (최대) |
| `rounded-full` | 9999px | 아바타, 토글, 원형 버튼 |

같은 크기의 컴포넌트가 나란히 놓이면 같은 라운드를 쓴다. `%` 는 완전한 원에만.

예외: 원본이 4px 로 둥근 **가로 캐러셀 카드**(라이브 편성표 카드 등, 테두리·그림자 없음)는 `rounded-xl` 대신 `rounded-sm` 을 쓴다(원본 실측).

예외: 캠페인 배경 위 **브랜드 칩**(기획전 필터, 원본 알약 radius 32)은 `rounded-sm` 대신 `rounded-full` 을 쓴다(원본 실측).

### 5.2 선 두께

1px 만 쓴다. 선택·포커스 강조는 두께가 아니라 색(`line-strong`)으로 표현한다(무신사 방식).

예외: 검색 결과 탭 줄처럼 **원본이 선택 탭 밑줄을 2px 로 쓰는 곳**은 `border-b-2 border-line-strong` 을 허용한다(원본 실측, 포커스 링 2px 선례). 그 밖의 선은 1px.

### 5.3 그림자

무신사는 거의 플랫이다. `shadow-sm`(호버 카드), `shadow-md`(드롭다운), `shadow-lg`(바텀시트·모달) 3단계만. 카드 기본 상태에는 그림자를 쓰지 않는다.

---

## 6. 레이아웃

KRDS 브레이크포인트 + 1200px 컨테이너.

| 토큰 | 뷰포트 | 상품 그리드 열 | 거터 | 화면 여백 |
|------|--------|----------------|------|-----------|
| (기본) | ~359px | 2 | 16px (`gap-4`) | 16px (`px-4`) |
| `sm` | 360px+ | 2 | 16px | 16px |
| `md` | 768px+ | 3 | 16px | 24px (`px-6`) |
| `lg` | 1024px+ | 4 | 24px (`gap-6`) | 24px |
| `xl` | 1280px+ | 5 | 24px | 24px |
| `2xl` | 1440px+ | 5 | 24px | 24px |

예외: 컨테이너(`max-w-page`) 밖에서 전체 폭으로 도는 **가로 캐러셀 섹션**(라이브 편성표 등)은 원본 실측대로 모든 폭에서 `px-4`(16px)를 쓰고, 스냅 여백도 `scroll-px-4` 로 맞춘다. 컨테이너 안 섹션은 위 표를 따른다.

컨테이너: `max-w-page mx-auto` (1200px). 상품 카드 이미지 비율은 **1:1**(`aspect-square`) — PRD 공통 사양 §8 이 이미지를 1:1 로 확정했고 `public/images/*.png` 도 400×400 이다(무신사는 3:4 세로형이지만 에셋을 따른다). 그리드 열 수는 PRD feature-01 수용 기준(모바일 1열/데스크톱 3열)이 우선하므로 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` 을 쓴다. `sm`(360px) 에서 2열로 늘리면 모바일 1열 기준을 어긴다.

---

## 7. 모션

| 토큰 | 값 | 용도 |
|------|----|------|
| `duration-fast` (기본) | 150ms | 호버·색 변화 (무신사 기본) |
| `duration-base` | 250ms | 드로어·바텀시트 |
| `ease-standard` (기본) | cubic-bezier(0.4, 0, 0.2, 1) | 대부분 |
| `ease-out` | cubic-bezier(0, 0, 0.2, 1) | 진입 애니메이션 |

`transition-colors` 만 써도 기본 150ms·standard 가 적용된다.

z-index 층: `z-sticky`(20, 헤더) < `z-dropdown`(30) < `z-overlay`(50, 딤) < `z-modal`(60) < `z-toast`(70). 이 다섯 값 외의 z-index 는 쓰지 않는다.

---

## 8. 컴포넌트 토큰 규칙 (정의만, 구현은 각 컴포넌트에서)

컴포넌트가 여러 곳에서 같은 시멘틱 조합을 반복하면, 그 컴포넌트 파일 맨 위에 컴포넌트 토큰을 선언하고 시멘틱을 참조한다. 이름은 KRDS 처럼 **컴포넌트명 + 더블대시 + 속성**, 좌우/상하 동일 값은 `-x`/`-y`.

```css
/* 예시 — ProductCard 를 구현할 때 이렇게 선언한다 */
.product-card {
  --product-card--radius: var(--radius-lg);
  --product-card--gap: --spacing(2);
  --product-card--name-color: var(--color-ink);
  --product-card--price-color: var(--color-price);
  --product-card--sale-color: var(--color-price-sale);
}
```

---

## 9. 사용 규칙 (코드 리뷰 체크리스트)

자동 검사: `pnpm design:lint [경로]` (`scripts/design-lint.mjs`) 가 아래 1~6번을 기계적으로 잡는다. 역할 오용까지 보려면 `/frontend-qa` 로 새 눈의 검수 에이전트(`.claude/agents/frontend-qa.md`)를 부른다. 검수 단위는 **작업 하나의 git 변경분**이다: 화면 작업 하나를 끝낼 때마다(커밋 전 또는 PR 직후) 부르고, 저장소 전체를 한 번에 검수하지 않는다.

- [ ] HEX·rgb·px 리터럴이 컴포넌트 코드에 없다. (`bg-[#000]`, `text-[13px]` 금지)
- [ ] `--ms-*` 프리미티브를 컴포넌트에서 직접 참조하지 않는다.
- [ ] 색은 시멘틱 이름으로만: `text-ink-secondary` ○, `text-gray-500` ×(컴파일 안 됨).
- [ ] 글자 크기는 `text-{역할}` 9단계만. 행간을 따로 지정하지 않는다.
- [ ] 간격은 4px 배수 8종만.
- [ ] 라운드는 7단계 토큰만.
- [ ] 가격은 `formatPrice()` + `text-price` / `text-price-sale`.
- [ ] 본문 글자는 4.5:1, 보조 글자·선·아이콘은 3:1 대비를 지킨다.

---

## 10. 적용 상태

| 항목 | 위치 | 상태 |
|------|------|------|
| 토큰 활성화 | `src/app/globals.css` 가 `tokens.css` 를 import, `@layer base` 에서 body 배경·글자·서체를 토큰으로 지정 | 적용됨 |
| Pretendard 로딩 | `src/app/layout.tsx` `<head>` 의 jsDelivr 동적 서브셋 CSS | 적용됨 |
| 루트 레이아웃 | body `bg-surface text-ink` (기존 `bg-zinc-50 text-zinc-900` 대체) | 적용됨 |
| 기초 프리미티브 | `src/components/ui/` — `Button`(primary/secondary/accent/ghost × sm/md/lg), `Badge`(neutral/sale/soldout/info), `Card` | 적용됨 |
| 포커스 링 | `:focus-visible` 에 `accent` 2px 아웃라인 | 적용됨 |

프리미티브는 시멘틱 토큰 클래스만 쓴다. `src/components/ui/ui.test.tsx` 가 HEX·px 리터럴·기본 팔레트 사용을 잡아낸다.

## 11. 값 출처 요약

| 항목 | 출처 |
|------|------|
| 그레이 12단계, 블루·레드·오렌지·그린 | 무신사 MDS 2.0 CSS 빈도 상위 색 |
| Pretendard, 자간 0, 굵기 400/500/600/700 | 무신사 MDS CSS |
| 폰트 크기 11~16 / 18~42, 행간 14~52 | 무신사 MDS CSS 실측 + KRDS 역할 명명 |
| 라운드 2/4/6/8/10/12 | KRDS 형태 가이드 5단계 + 무신사 8px |
| 150ms cubic-bezier(.4,0,.2,1) | 무신사 MDS CSS |
| 브레이크포인트, 1200px, 4/8pt 간격 | KRDS 레이아웃 가이드 |
| 3계층·네이밍·대비 매직넘버·다크 모드 규칙 | KRDS 디자인 토큰·색상 가이드 |
