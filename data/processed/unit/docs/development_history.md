# Grammar Viewer Pro - Development History & Roadmap

## [2026-04-05 16:27] 현재 버전: v9 (Dynamic JSON Integrated App)

### 🚀 지금까지 성공한 단계 (Achievements)
1. **Raw 데이터 추출 및 가공 자동화 (Pipeline Stage)**
   * 교과서 원본 PDF/문서에서 영문장과 한글 번역, 문법 개념(`grammar_name`), 출처 등을 CSV 및 JSON 형태로 일괄 추출 파이프라인 완성 (`Lesson01_organized.json` 등).
   * 2,600개가 넘는 방대한 문장들을 `build_dynamic_curriculum.py` 스크립트를 통해 학습 가능한 Unit 묶음(Bundle)으로 자동 큐레이션 가능.

2. **단일 HTML 기반의 경량화된 UI 구현 (Grammar Viewer App v1 ~ v7)**
   * 서버 없이 독립 실행 가능한 모듈(`standalone_preview_vX.html`) 뼈대 완성.
   * `10분 학습 써머리`, `문장 구조 투시(SVG)`, `직접 해보기(드래그 앤 드롭)`와 같은 인터랙티브 모듈 개발.

3. **정적 하드코딩 탈피 및 동적 데이터 연동 (App v8 ~ v9 성공)**
   * `integrate_ui_v9.py` 스크립트를 통해 App UI와 백엔드 데이터 엔진 이음매 구축 완벽 달성.
   * 각 유닛(Unit) 클릭 시 하드코딩되었던 단어, 예문, 퀴즈가 해당 Unit에 맞는 문장들로 실시간 변환.
   * 단원 목표에 알맞은 **개념 정리 (Rule, Sub, Points)** 동적 변경 달성.
   * [심화] 비슷한 예문 풀어보기 단계(SIMILAR)에서 1번 문항(어순 배열), 2번 문항(빈칸 객관식), 3번 문항(문맥 속 직독직해 시뮬레이션 후 영작)에 걸쳐 각기 다른 예문을 동적으로 뿌려주는 로직과 애니메이션 완성.

---

### ⏳ 다음 단계 목표 (Next Steps: target v10+)
1. **문법 데이터 구조의 심화 고도화 (Deep NLP Parsing - v2 Schema Model)**
   * **과제**: "접속사 if/whether의 or not 생략 여부", "직독직해 기준 단위 슬라이스", "주어 자리 제약 조건" 등을 현재 데이터 태그로는 식별할 수 없음.
   * **개발 방향**: 교과서 내의 모든 문장 데이터 JSON을 NLP를 거쳐 `syntax_chunks`, `grammar_properties`, `variation_flags` 등의 필드를 보유한 하이퍼 정밀 데이터로 업데이트. (자세한 방향은 `v10_grammar_data_architecture.md` 참조)
2. **학생 학습 기록 저장 로직(LocalStorage / API 연결)**
   * 문장별 틀린 횟수(OTries 등)와 결과 로그를 JSON으로 묶어 서버로 쏘거나(LocalStorage에 남기거나) 하는 진단 실습 메커니즘을 실제 DB와 연동.
3. **교사용 대시보드(Teacher Mode) 기능 통합**
   * Rule Set (`dynamic_curriculum_v1.json`)을 교사가 웹 UI 화면에서 직접 제어하고, 변경 시 파이프라인 스크립트를 서버가 트리거하도록 프론트-백 엔드 컨테이너 통합 작업 진행.
