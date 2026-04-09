# Grammar Data Architecture v2: Deep Syntax & Semantic Modeling

## [2026-04-05 16:28] 작성: AI 에이전트
### 목적: 원시 문장 데이터를 '심화 학습 제어(Constraints)'가 가능한 데이터로 고도화 (v10 로드맵)

---

### 1. 현재 데이터 구조 (v1) 의 한계점
현재 `LessonXX_organized.json`의 문장 데이터는 아래처럼 생겼습니다.
```json
{
  "id": "L01-15",
  "english": "Thanks to Antonio, the islanders could get what they needed.",
  "korean": "안토니오 덕분에 섬사람들은 자신들이 필요한 것을 얻을 수 있었다.",
  "grammar_name": "관계대명사 what"
}
```
*   **태깅의 단순성**: "어떤 문법이 존재하는가"만 명시되어 있습니다.
*   **불가능한 제어**: "if와 whether 중 문법적으로 whether만 들어가야 하는가?(or not의 보이지 않는 강제력 등)"와 같은 출제자의 세부 조건을 필터링할 수 없습니다.

### 2. 문법별 심화 학습 포인트 (Unit Analysis Examples)

**A. 접속사 if / whether (명사절)**
*   **분류해야 할 조건 (Variants)**: 
    *   `has_or_not`: 문장 끝에 'or not'이 명시되어 있는가?
    *   `is_subject_position`: 주어 자리에 쓰여서 'if'를 쓸 수 없는 구조인가?

**B. 관계대명사 what**
*   **분류해야 할 조건 (Variants)**: 
    *   what 절 내부가 주어가 빠진 불완전 구조인지, 목적어가 빠진 구조인지 분별.
*   **독해 끊어읽기(Chunking)**: 
    *   아이가 읽는 속도에 맞추어 `[주절] / [what이 이끄는 덩어리]`로 슬라이스 쳐진 데이터.

---

### 3. 고도화된 데이터 스키마 제안 (Data Schema v2)

AI와 NLP API를 이용해 향후 추출되어야 할 `v2` 모델입니다.

```json
{
  "id": "L02-137",
  "english": "I want to know if he will join the club or not.",
  "korean": "나는 그가 동아리에 가입할지 안 할지 알고 싶다.",
  "grammar_category": "접속사 if / whether",
  
  // 1. 구문 독해 및 직독직해 정보 (Chunking API 활용)
  "syntax_chunks": [
    { "eng": "I want to know", "kor": "나는 알고 싶다", "role": "Main Clause" },
    { "eng": "if he will join the club", "kor": "그가 동아리에 가입할지를", "role": "Noun Clause (Object)" },
    { "eng": "or not.", "kor": "혹은 아닐지.", "role": "Modifier" }
  ],

  // 2. 심층 문법 속성 (Deep Grammar Properties)
  "grammar_properties": {
    "role_in_sentence": "Object",
    "trigger_word": "if",
    "target_pattern": "verb + if + sentence"
  },

  // 3. 문제 출제를 위한 변형/제약 조건 (Variation Flags)
  "variation_flags": [
    "has_or_not_explicit", 
    "verb_of_uncertainty", 
    "cannot_be_subject_because_of_if"
  ]
}
```

### 💡 v2 데이터 설계 적용 시 이점
1. **정밀한 문제 출제 (Dynamic Extraction)**: 
   선생님이 "whether만 들어갈 수 있는 문제(예: 전치사 뒤, 혹은 목적격 자리)"만 골라 내고 싶다면 `variation_flags`나 `chunk` 요소로 필터링 즉각 가능.
2. **구문 독해 UI 연동 완벽화**:
   현재 시뮬레이션용 코드로 반으로 가르던 UI를, `syntax_chunks` 배열을 그대로 가져와 화면에 그리기만 하면 전문가 수준의 독해 강의 UI 구현 가능.
3. **오답 노트/해설 자동 생성**:
   학생의 오답 시, `variation_flags` 데이터를 바탕으로 "if는 뒤에 or not이 붙을 땐 쓸 수 없단다!" 등 교사 수준의 코멘트 자동 출력 가능.
