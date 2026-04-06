/**
 * GRAMMAR DATA & DIFFICULTY LOGIC (v12)
 * 8 Units integrated from Lee Jae-young & Jung Sa-yeol Textbooks
 */

const GRAMMAR_UNITS = [
  {
    id: 1,
    title: "1단원: 상관접속사 & 관계사",
    concepts: ["not only ~ but also ...", "관계대명사 what"],
    sentences: [
      { en: "He is not only smart but also very kind.", ko: "그는 영리할 뿐만 아니라 매우 친절하다.", grammar: "not only ~ but also", textbook: "Lee" },
      { en: "Not only you but also I am responsible for the project.", ko: "너뿐만 아니라 나도 그 프로젝트에 책임이 있다.", grammar: "not only ~ but also", textbook: "Jung" },
      { en: "What I need is a warm cup of coffee.", ko: "내가 필요한 것은 따뜻한 커피 한 잔이다.", grammar: "what", textbook: "Lee" },
      { en: "Show me what you have in your bag.", ko: "네 가방 안에 무엇이 있는지 보여줘.", grammar: "what", textbook: "Jung" },
      { en: "She not only sings well but also dances perfectly.", ko: "그녀는 노래를 잘할 뿐만 아니라 춤도 완벽하게 춘다.", grammar: "not only ~ but also", textbook: "Lee" },
      { en: "This is what I wanted to tell you.", ko: "이것이 내가 너에게 말하고 싶었던 것이다.", grammar: "what", textbook: "Jung" },
    ]
  },
  {
    id: 2,
    title: "2단원: 수동태 & 완료진행",
    concepts: ["조동사 + 수동태", "현재완료 진행"],
    sentences: [
      { en: "The task must be finished by tomorrow.", ko: "그 작업은 내일까지 끝내야만 한다.", grammar: "modal + passive", textbook: "Lee" },
      { en: "The room can be cleaned easily.", ko: "그 방은 쉽게 청소될 수 있다.", grammar: "modal + passive", textbook: "Jung" },
      { en: "I have been reading this book for three hours.", ko: "나는 세 시간 동안 이 책을 읽고 있다.", grammar: "present perfect progressive", textbook: "Lee" },
      { en: "It has been raining since this morning.", ko: "오늘 아침부터 비가 내리고 있다.", grammar: "present perfect progressive", textbook: "Jung" },
      { en: "Great things will be achieved by you.", ko: "위대한 일들이 너에 의해 성취될 것이다.", grammar: "modal + passive", textbook: "Lee" },
      { en: "He has been playing the piano all day.", ko: "그는 하루 종일 피아노를 치고 있다.", grammar: "present perfect progressive", textbook: "Jung" },
    ]
  },
  {
    id: 3,
    title: "3단원: 부정사 & 관계부사",
    concepts: ["to부정사의 의미상 주어", "관계부사"],
    sentences: [
      { en: "It is important for us to protect nature.", ko: "우리가 자연을 보호하는 것은 중요하다.", grammar: "to-inf subject", textbook: "Lee" },
      { en: "It is difficult for him to solve the problem.", ko: "그가 그 문제를 푸는 것은 어렵다.", grammar: "to-inf subject", textbook: "Jung" },
      { en: "This is the city where I was born.", ko: "이곳은 내가 태어난 도시이다.", grammar: "where", textbook: "Lee" },
      { en: "I remember the day when we first met.", ko: "우리가 처음 만났던 날을 기억한다.", grammar: "when", textbook: "Jung" },
      { en: "It was kind of you to help me.", ko: "나를 도와주다니 당신은 참 친절하군요.", grammar: "to-inf subject", textbook: "Lee" },
      { en: "Tell me the reason why you were late.", ko: "네가 늦은 이유를 나에게 말해줘.", grammar: "why", textbook: "Jung" },
    ]
  },
  {
    id: 4,
    title: "4단원: 과거완료 & 분사",
    concepts: ["과거완료", "명사를 수식하는 현재분사"],
    sentences: [
      { en: "The train had already left when I arrived.", ko: "내가 도착했을 때 기차는 이미 떠나버렸다.", grammar: "past perfect", textbook: "Lee" },
      { en: "She had never seen a penguin before she went to the zoo.", ko: "그녀는 동물원에 가기 전에는 펭귄을 본 적이 없었다.", grammar: "past perfect", textbook: "Jung" },
      { en: "The girl singing on the stage is my sister.", ko: "무대 위에서 노래하고 있는 소녀는 내 여동생이다.", grammar: "present participle", textbook: "Lee" },
      { en: "Look at the boy running towards us.", ko: "우리 쪽으로 달려오고 있는 소년을 봐.", grammar: "present participle", textbook: "Jung" },
      { en: "I had finished my homework before dinner.", ko: "나는 저녁 식사 전에 숙제를 끝냈었다.", grammar: "past perfect", textbook: "Lee" },
      { en: "The man reading a newspaper is my uncle.", ko: "신문을 읽고 있는 남자는 우리 삼촌이다.", grammar: "present participle", textbook: "Jung" },
    ]
  },
  {
    id: 5,
    title: "5단원: 분사구문 & 접속사",
    concepts: ["분사구문", "접속사 if / whether"],
    sentences: [
      { en: "Walking along the street, I met an old friend.", ko: "길을 걷다가 옛 친구를 만났다.", grammar: "participle phrase", textbook: "Lee" },
      { en: "Not knowing what to do, she asked for help.", ko: "무엇을 해야 할지 몰라서 그녀는 도움을 요청했다.", grammar: "participle phrase", textbook: "Jung" },
      { en: "I wonder if it will rain tomorrow.", ko: "내일 비가 올지 궁금하다.", grammar: "if/whether", textbook: "Lee" },
      { en: "I don't know whether he will come or not.", ko: "그가 올지 안 올지 모르겠다.", grammar: "if/whether", textbook: "Jung" },
      { en: "Turning left, you will see the post office.", ko: "왼쪽으로 돌면 우체국을 보게 될 것이다.", grammar: "participle phrase", textbook: "Lee" },
      { en: "Let me know if you are free tonight.", ko: "오늘 밤 한가하다면 나에게 알려줘.", grammar: "if/whether", textbook: "Jung" },
    ]
  },
  {
    id: 6,
    title: "6단원: too ~ to & 관계사",
    concepts: ["too ~ to ...", "계속적 용법의 관계대명사"],
    sentences: [
      { en: "He was too tired to walk anymore.", ko: "그는 너무 피곤해서 더 이상 걸을 수 없었다.", grammar: "too ~ to", textbook: "Lee" },
      { en: "The coffee was too hot to drink.", ko: "그 커피는 마시기엔 너무 뜨거웠다.", grammar: "too ~ to", textbook: "Jung" },
      { en: "I gave him a book, which he liked very much.", ko: "나는 그에게 책을 한 권 주었는데, 그는 그것을 매우 좋아했다.", grammar: "relative pronoun (cont.)", textbook: "Lee" },
      { en: "They have a son, who is a famous doctor.", ko: "그들에게는 아들이 하나 있는데, 그는 유명한 의사이다.", grammar: "relative pronoun (cont.)", textbook: "Jung" },
      { en: "This box is too heavy for me to lift.", ko: "이 상자는 내가 들기엔 너무 무겁다.", grammar: "too ~ to", textbook: "Lee" },
      { en: "He said nothing, which made me angry.", ko: "그는 아무 말도 하지 않았는데, 그것은 나를 화나게 했다.", grammar: "relative pronoun (cont.)", textbook: "Jung" },
    ]
  },
  {
    id: 7,
    title: "7단원: 가정법 & 접속사",
    concepts: ["가정법 과거", "접속사 so that"],
    sentences: [
      { en: "If I were rich, I would buy a car.", ko: "내가 부자라면 차를 살 텐데.", grammar: "subjunctive past", textbook: "Lee" },
      { en: "If she knew his address, she would tell you.", ko: "그녀가 그의 주소를 안다면 너에게 말해줄 텐데.", grammar: "subjunctive past", textbook: "Jung" },
      { en: "I exercise every day so that I can stay healthy.", ko: "나는 건강을 유지할 수 있도록 매일 운동한다.", grammar: "so that", textbook: "Lee" },
      { en: "He worked hard so that his family could live well.", ko: "그는 가족이 잘 살 수 있도록 열심히 일했다.", grammar: "so that", textbook: "Jung" },
      { en: "If it were sunny today, we could go on a picnic.", ko: "오늘 날씨가 맑으면 소풍을 갈 수 있을 텐데.", grammar: "subjunctive past", textbook: "Lee" },
      { en: "Please speak loudly so that everyone can hear you.", ko: "모두가 들을 수 있도록 크게 말씀해 주세요.", grammar: "so that", textbook: "Jung" },
    ]
  },
  {
    id: 8,
    title: "8단원: 비교급 & 소유격",
    concepts: ["the + 비교급, the + 비교급", "소유격 관계대명사"],
    sentences: [
      { en: "The more I study, the more I know.", ko: "공부를 더 많이 할수록 더 많이 알게 된다.", grammar: "the + comparative", textbook: "Lee" },
      { en: "The higher we climb, the colder it becomes.", ko: "높이 올라갈수록 날씨가 더 추워진다.", grammar: "the + comparative", textbook: "Jung" },
      { en: "I have a friend whose father is a pilot.", ko: "나는 아버지가 조종사인 친구가 하나 있다.", grammar: "possessive relative", textbook: "Lee" },
      { en: "Look at the house whose roof is red.", ko: "지붕이 빨간 저 집을 봐.", grammar: "possessive relative", textbook: "Jung" },
      { en: "The sooner, the better.", ko: "빠를수록 좋다.", grammar: "the + comparative", textbook: "Lee" },
      { en: "She is a writer whose books are popular.", ko: "그녀는 책들이 인기 있는 작가이다.", grammar: "possessive relative", textbook: "Jung" },
    ]
  }
];

/**
 * Get dynamic difficulty for a sentence based on its position in the unit.
 * Logic: First 1/3 (Low), Next 1/3 (Mid), Last 1/3 (High)
 */
function getDifficultyLabel(index, total) {
  const ratio = (index + 1) / total;
  if (ratio <= 1/3) return "하";
  if (ratio <= 2/3) return "중";
  return "상";
}

/**
 * Enhanced sentence data with difficulty and training steps
 */
function getEnhancedSentences(unitId) {
  const unit = GRAMMAR_UNITS.find(u => u.id === unitId);
  if (!unit) return [];
  
  return unit.sentences.map((s, idx) => {
    const diff = getDifficultyLabel(idx, unit.sentences.length);
    
    // Grammatical Chunks (S/V/O/C/A) - Mock implementation based on unit-specific sentences
    const tokens = getGrammarTokens(s.en);
    
    return {
      ...s,
      idx: idx,
      difficulty: diff,
      // Steps logic
      steps: {
        initial: {
          question: `[교과서 예문 분석] 다음 중 '${s.grammar}' 문법이 가장 적절하게 쓰인 '중' 난이도 문장은?`,
          options: [
            s.en, 
            s.en.replace("not only", "not solely").replace("but also", "and furthermore"), // Mid distraction
            s.en.split(' ').reverse().join(' ') // Extreme distraction
          ],
          ans: 0
        },
        read: { en: s.en, ko: s.ko },
        chop: { tokens: tokens, hints: ["주어(S), 동사(V), 목적어(O) 등 문장 성분 단위로 끊어보세요."] },
        rearrange: { 
          tiles: tokens.map(t => ({ t, k: "bone" })),
          ans: tokens 
        },
        blank: { 
          sent: s.en.replace(tokens[Math.floor(tokens.length/2)], "____"), 
          ans: tokens[Math.floor(tokens.length/2)] 
        },
        write: { en: s.en, ko: s.ko }
      }
    };
  });
}

/**
 * Grammar Tokenizer (Simplified for AIDT Demo)
 * Groups words into S, V, O, C, etc.
 */
function getGrammarTokens(en) {
  const clean = en.replace(/[.,!?;]/g, '');
  // Example-based chunking for demonstration
  if (en.includes("not only")) {
    return ["He", "is", "not only smart", "but also very kind"];
  }
  if (en.includes("What I need")) {
    return ["What I need", "is", "a warm cup of coffee"];
  }
  if (en.includes("The task")) {
    return ["The task", "must be finished", "by tomorrow"];
  }
  if (en.includes("It is important")) {
    return ["It", "is", "important", "for us", "to protect nature"];
  }
  // Fallback: 2-3 word chunks
  const words = clean.split(' ');
  const result = [];
  for (let i = 0; i < words.length; i += 2) {
    result.push(words.slice(i, i + 2).join(' '));
  }
  return result;
}

