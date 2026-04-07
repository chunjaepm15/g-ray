# [정사열] 중학 영어 3 교과서 - 데이터 구성 및 상세 분석 (v2.0)

본 문서는 정사열 중학 영어 3 교과서의 각 단원별 페이지 범위, 핵심 학습 문법, 그리고 전수 조사 및 가공된 데이터 파일 구조를 정리한 관리 문서입니다.

---

## 1. 단원별 학습 지도 데이터 (Curriculum Mapping)

| 단원 (Lesson) | 주요 주제 (Topic) | 핵심 문법 (Grammar Focus) | 페이지 범위 |
| :--- | :--- | :--- | :---: |
| **Lesson 01** | Express Your Feelings | 수동태, 관계대명사의 계속적 용법 | 10 - 29 |
| **Lesson 02** | Let's Make Our Town Better | 과거완료, 사역동사(make), 비교급 강조 | 30 - 51 |
| **Lesson 03** | Laugh First and Then Think | 상관접속사(Not only A but also B), enough to | 52 - 71 |
| **Lesson 04** | Dreaming of My Future | 분사구문, 관계대명사 what | 72 - 91 |
| **Lesson 05** | Pictures Speak a Thousand Words | 가정법 과거, 소유격 관계대명사 (whose) | 92 - 111 |
| **Lesson 06** | We Are All Makers | the + 비교급, It ~ that 강조구문 | 112 - 131 |
| **Lesson 07** | Fact, Opinion, or Fake | 명사절 접속사(if/whether), 간접 화법 | 132 - 151 |
| **Lesson 08** | Make Peace with Others | 부정대명사(Some/Others), order/tell + O + to V | 152 - 171 |

---

## 2. 데이터 가공 현황 및 파일 구조

### 2.1 파일 구성 원칙
모든 단원은 원본(`LessonXX.txt`) 전수 조사를 통해 다음 두 가지 파일로 표준화되었습니다.
- **`LessonXX_organized.csv`**: 단원별 듣기/본문/문법 예문 20개 이상 추출 (grammar_id 매핑 완료)
- **`LessonXX_paragraphs.csv`**: 본문 지문 전체를 의미 단위의 단락(Paragraph)으로 분리 가공

### 2.2 단원별 핵심 예시 (Key Sentences)

**[Lesson 01]**
> "People also use ROFL, which means “Rolling On the Floor Laughing.”" (관계대명사 계속적 용법)

**[Lesson 02]**
> "I was glad my dad had made me wear gloves." (과거완료 + 사역동사)

**[Lesson 03]**
> "Not only the winners’ fun studies but also the ceremony makes people laugh." (상관접속사)

**[Lesson 04]**
> "The judge was impressed by what she said and finally gave her permission." (관계대명사 what)

**[Lesson 05]**
> "I would be so happy if you were with me." (가정법 과거)

**[Lesson 06]**
> "It is this filtered water that you can drink." (It ~ that 강조구문)

**[Lesson 07]**
> "You also have to check if they are based on facts." (접속사 if)

**[Lesson 08]**
> "Some gave Corky angry looks, and others shouted at him." (부정대명사)

---
**최종 업데이트:** 2026-04-03
**교과서:** 중등 영어 3 정사열 (15개정) - 교과서 전권 데이터화 완료
**특이사항:** 레거시 병합 파일(`Lesson01-08_organized.csv` 등) 삭제 및 단원별 모듈화 완료
