/**
 * GRAMMAR DATA (v12-2)
 * Organized based on the 8 main units, with sub-units.
 */

const GRAMMAR_UNITS = [
  {
    id: 1,
    title: "1단원: 상관접속사 & 관계사",
    subUnits: [
      { id: "1-1", title: "1-1. not only ~ but also ...", grammar: "not only ~ but also" },
      { id: "1-2", title: "1-2. 관계대명사 what", grammar: "what" },
      { id: "1-3", title: "1-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 2,
    title: "2단원: 수동태 & 완료진행",
    subUnits: [
      { id: "2-1", title: "2-1. 조동사 + 수동태", grammar: "modal + passive" },
      { id: "2-2", title: "2-2. 현재완료 진행", grammar: "present perfect progressive" },
      { id: "2-3", title: "2-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 3,
    title: "3단원: 부정사 & 관계부사",
    subUnits: [
      { id: "3-1", title: "3-1. to부정사의 의미상 주어", grammar: "to-inf subject" },
      { id: "3-2", title: "3-2. 관계부사", grammar: "relative adverb" },
      { id: "3-3", title: "3-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 4,
    title: "4단원: 과거완료 & 분사",
    subUnits: [
      { id: "4-1", title: "4-1. 과거완료", grammar: "past perfect" },
      { id: "4-2", title: "4-2. 명사를 수식하는 현재분사", grammar: "present participle" },
      { id: "4-3", title: "4-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 5,
    title: "5단원: 분사구문 & 접속사",
    subUnits: [
      { id: "5-1", title: "5-1. 분사구문", grammar: "participle phrase" },
      { id: "5-2", title: "5-2. 접속사 if / whether", grammar: "conjunction" },
      { id: "5-3", title: "5-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 6,
    title: "6단원: too ~ to & 관계사",
    subUnits: [
      { id: "6-1", title: "6-1. too ~ to ...", grammar: "too ~ to" },
      { id: "6-2", title: "6-2. 계속적 용법의 관계대명사", grammar: "relative pronoun cont." },
      { id: "6-3", title: "6-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 7,
    title: "7단원: 가정법 & 접속사",
    subUnits: [
      { id: "7-1", title: "7-1. 가정법 과거", grammar: "subjunctive past" },
      { id: "7-2", title: "7-2. 접속사 so that", grammar: "so that" },
      { id: "7-3", title: "7-3. 연습 문제", grammar: "review" }
    ]
  },
  {
    id: 8,
    title: "8단원: 비교급 & 소유격",
    subUnits: [
      { id: "8-1", title: "8-1. the+비교급, the+비교급", grammar: "the more, the more" },
      { id: "8-2", title: "8-2. 소유격 관계대명사", grammar: "whose" },
      { id: "8-3", title: "8-3. 연습 문제", grammar: "review" }
    ]
  }
];

// Helper to find a sub-unit
function findSubUnit(subId) {
  for (const unit of GRAMMAR_UNITS) {
    const found = unit.subUnits.find(s => s.id === subId);
    if (found) return found;
  }
  return null;
}
