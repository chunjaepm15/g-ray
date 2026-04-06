# 📖 Grammar Viewer v12-2 (천재교육 AIDT)

문법 투시경 v12-2는 중학교 3학년 교과서를 기반으로 AI 분석을 통한 5단계 스캐폴딩(Scaffolding) 학습을 제공하는 영어 교육 웹 애플리케이션입니다.

## 📂 폴더 및 파일 구조

```text
/grammar_viewer_v12/app/app-index2/
├── index-v2.html           # 메인 애플리케이션 (교사용/학생용 통합 UI 및 5단계 학습 시스템)
├── ai_processor.py         # Gemini API 연동: 교과서 PDF 분석 및 맞춤형 학습 데이터 생성
├── generate_curriculum.py  # 분석된 데이터를 EBS 기준 난이도로 분류 및 JS 변환
├── extract_data.py         # 교과서 원본 지문 및 문법 키워드 정규식 추출 유틸리티
├── implemented_v2.md       # 버전 기록, 변경 이유(Rationale) 및 상세 사양 기술 문서
├── README.md               # 프로젝트 구조 및 가이드 (현재 파일)
│
├── css/
│   └── local.css           # AIDT 프리미엄 디자인 시스템, 테마(Dark/Light), 빔 모드 스타일
│
├── js/
│   ├── app.js              # 학습 엔진 로직 (진단평가, 5단계 프로세스, 상태 관리, 빔 모드 제어)
│   ├── curriculum_data.js  # AI가 생성한 학습용 청크(Chunks), 힌트 및 정답 데이터베이스
│   ├── data.js             # 8대 대단원 및 세부 차시(1-1, 1-2 등) 아코디언 메뉴 정의
│   └── textbook_data.js    # 교과서 지문 원본에서 추출한 연습 문장 원형 데이터
│
├── components/             # (확장 예정) 공통 UI 컴포넌트 라이브러리
└── data/                   # (상위 참조) 교과서 PDF 및 원본 지문 저장소
```

## 🚀 핵심 기능 (Core Features)

### 1. AI 5단계 스캐폴딩 시스템
학생의 인지적 부담을 줄이고 점진적으로 문장을 내면화하는 5단계 흐름을 제공합니다.
- **0단계 읽기(X-ray)**: 문장 성분(S/V/O/C) 분석 및 목표 문법 하이라이트 제공.
- **1단계 자르기(Chop)**: EBS 기준 의미 단위(Chunk)로 문장 성분 분해 훈련.
- **2단계 재배열(Rearrange)**: 무작위 단어 카드 배치를 통한 어순 체화.
- **3단계 빈칸(Blank)**: 핵심 문법 요소를 직접 추론하여 입력.
- **4단계 직접쓰기(Writing)**: 한글 해석만 보고 전체 영어 문장 마스터.

### 2. 스마트 진단 및 개인화 복습
- **3지선다 진단평가**: 0단계를 마치고 학습을 시작하기 전, 이해도를 즉각 확인하는 객관식 관문.
- **실수 기반 AI 리뷰**: `wrongCount`를 분석하여 학습자가 취약한 패턴의 고난도 문장을 자동 배정.
- **학습 상태 저장 (Resume)**: 중단 시점의 단원과 단계를 정확히 기억하여 홈 화면에서 즉시 연결.

### 3. 교사 지원 도구 (Teacher's Kit)
- **빔 프로젝트 모드**: 대형 화면 투사에 최적화된 고대비 UI, 상단 집중 레이아웃 및 원격 제어용 X 버튼.
- **G-ray 분석기**: 외부 지문을 AI로 분석하여 EBS 기준 난이도와 구조적 특징 측정.
- **공지 및 과제 관리**: 학급 전체 공지 사항 전달 및 실시간 학습 성취 리포트 확인.

## 🛠 기술 및 환경
- **Frontend**: HTML5, Vanilla CSS (Variables), JavaScript (ES6+)
- **Data Engine**: Python 3.12 (PyMuPDF, Google Generative AI API)
- **Design Standard**: EBS 중학 3학년 교육 과정 및 AIDT 디자인 가이드라인 준수.

---
*Last Updated: 2026-04-01 | Antigravity AI*
