# 교과서 데이터 초기 변환 및 검증 파이프라인 명세 (프롬프트 규칙)

본 문서는 원본 교과서(`Raw PDF/TXT`)에서 웹 서비스용 JSON, CSV 데이터베이스로 변환하는 자동화 스크립트를 도출하기 위해 사용된 **기준 프롬프트(Prompt)** 입니다. 

---

### 📌 프롬프트 원문

> 현재 이재영 > data 안에 있는 lesson01~lesson08까지 정사열 lesson01~lesson08 안에 파일 구조는 다똑같아. 
> 
> * `Lesson##.txt`: 폴더 raw>textbooks에 있는 저자에 맞는 pdf 원본에 각 단원별 모든 텍스트 추출 
> * `lesson##organized_with_translation.md`: lesson##별 영문과 내용 정리
> * `Lesson##_organized.csv`: Lesson##.txt텍스트 안에있는 모든 단문 [id, category, english, korean, grammar_id, grammar_name, structure, difficulty, page] 별로 추출
> * `Lesson##_organized.json`: 위에 내용 컴퓨터로 옮기기 쉽게 json data 화
> * `Lesson##_paragraphs.csv`: Lesson##.txt텍스트 안에있는 모든 긴 내용 단락 영문 [id, category, english, korean, grammar_id, grammar_name, structure, difficulty, page] 별로 추출
> 
> 각각 데이터 `Lesson##_paragraphs.csv`, `Lesson##_organized.json`, `Lesson##_organized.csv`가 `Lesson##.txt`에 있는 문장 전체다 변환시켰는지 검증하고 안에 빈 내용은 교과서내용 1차 없으면 검색으로 채춰줄것. 
> 
> 예시로 볼것은 이재영>data>lesson02에 모든 py구조 그런 과정을 도출하는 python파일이 textbook-data 단위로 필요하다. 항상 검증필수.

---

### 🛠️ 데이터 통합 파이프라인 개발 원칙
위 프롬프트에 따라 제정된 스크립트(`scripts/process_all_lessons.py`)는 항상 다음 원칙을 준수하여 작동합니다:

1. **상시 구조 검증 (Text-to-CSV)**: `csv` 내에 존재하지 않는 원본 문장이 남겨졌는지 `TXT`와 상시 대조 대조.
2. **단락/단문 완전 맵핑**: 긴 문장(Paragraphs)이 존재할 경우 단문(Organized)에 해체하여 추가.
3. **빈칸 자율 주입 (Auto-Fill)**: 비어있는 한글 번역, 문법 해설 칸은 AI 번역기 및 자체 검색 엔진 패턴 분석기를 통해 즉시 1차로 채워넣음.
4. **전역 자동화 (Textbook Data Level)**: 이재영, 정사열 등 여러 저자와 1~8단원을 한 번의 프로세스로 순회.
