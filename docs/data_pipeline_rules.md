# 📊 데이터 파이프라인 정규화 규칙 (Data Pipeline Rules) v13

## 🏗️ 1. 데이터 추출 및 표준화 (Extraction)
- **ID 명명 규칙**: 각 문장은 `Lesson-ID` 형식을 가지며, 교과서(L01-L08)와 관계형 데이터베이스 매핑을 위한 고유 식별자를 생성합니다. (예: `L01-15`)
- **문법 카테고리화**: `Cheonjae-Grammar-26` 표준에 근거하여 10개의 공용 문법 단위(CG01-CG10)를 설정합니다.

## 📐 2. 구문 분석 및 청킹 (Chunking) Rule
- **EBS Standard**: 모든 분석 문장은 최소 4개(S, V, O/C, M)의 역할 단위로 묶여야 합니다.
- **연결어 처리**: 접속사와 관계대명사는 수식어 전후의 경계를 구분하고, 절 전체가 하나의 역할을 수행하는 경우 전체를 구문 덩어리(Chunk)로 정의합니다.

## 📁 3. JSON 구조 스펙 (JSON Schema)
- `unit_id`: 공통 문법 ID (예: CG01)
- `title`: 단원 제목
- `sentences`: 문장 객체의 배열
  - `english`: 원문
  - `korean`: 번역문
  - `syntax_chunks`: 분석된 청크 데이터의 배열 (`eng`, `kor`, `role`)
  - `grammar_properties`: 개별 문장의 상세 문법 특성

---
_최종 갱신일: 2026-04-06 16:40 (Antigravity AI)_
