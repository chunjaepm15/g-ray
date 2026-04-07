# 중학 영어 문법 학습 AIDT 서비스 데이터 구조

이 디렉토리는 천재교육 중학 3학년 영어 교과서 데이터를 AIDT(AI Digital Textbook) 서비스 및 RAG 기반 챗봇에서 활용하기 위해 가공 및 정리한 파일들을 포함하고 있습니다. 현재 관리가 용이하도록 역할별로 폴더를 나누어 파일들을 정리해 두었습니다.

## 📂 파일 및 폴더 구성 안내

### 📝 docs (기획 및 설계 문서)
*   **`planning_doc.md`**: AIDT 문법 학습 서비스의 목표, 교수 전략, AI 챗봇 RAG 대응 방향을 정의한 기획 문서입니다. 프로젝트의 전체적인 맥락을 파악할 때 읽습니다.
*   **`textbook_erd_design.md`**: 단원(Unit)과 학습 문장(Sentences) 데이터를 담기 위한 통합 테이블 구조(ERD) 명세서입니다. DB 엔지니어 모델링 및 백엔드 개발 시 참조합니다.

### ⚙️ scripts (자동화 스크립트)
*   **`generate_sql.py`**: `textbook-data` 폴더 안에 있는 여러 저자(이재영, 정사열 등)의 CSV 파일을 읽어와 하나의 SQL파일로 변환해주는 파이썬 스크립트입니다. 데이터가 변경되면 `python scripts/generate_sql.py` 명령어로 재실행하여 SQL을 생성합니다.

### 🗄️ db (데이터베이스)
*   **`textbook_seed_data.sql`**: `generate_sql.py`를 통해 생성된 최종 SQL 파일입니다. 서비스 초기 론칭이나 DB 세팅 시 백엔드 단에서 이 SQL을 실행(인서트)하여 데이터베이스를 구축합니다.

### 📦 archive (보관용 / 원시 데이터)
*   **`cheonjae_grammar_26.json`**: 소영순, 이상기 저자의 단원별 핵심 문법과 공통 문법 정보를 담은 원시 JSON 데이터입니다. 추후 세부 지문 데이터 추가 시 참고할 보존 파일입니다.

---

## 🚀 사용 방법 (How to use)

1. **데이터베이스 구축 단계**:
   - `docs/textbook_erd_design.md`를 참고하여 실제 DB에 Table(books, units, sentences)을 생성합니다.
   - `db/textbook_seed_data.sql` 파일을 실행하여 200여 개의 이재영 & 정사열 단원 및 지문 데이터를 DB에 삽입합니다.
2. **텍스트 데이터 추가/업데이트 시**:
   - `textbook-data/` 하위 폴더들에 새로운 가공된 CSV 데이터가 업로드/수정될 경우,
   - 윈도우 PowerShell 단말기에서 커맨드를 실행합니다: `python scripts/generate_sql.py`
   - 업데이트된 `db/textbook_seed_data.sql` 파일이 다시 자동 갱신됩니다.
