const CURRICULUM_DATA = {
  "1-1": [
    {
      "level": "하",
      "en": "He is not only smart but also kind.",
      "ko": "그는 똑똑할 뿐만 아니라 친절하다.",
      "analysis": { 
        "structure": "S + V + not only A but also B", 
        "point": "상관접속사 (not only A but also B)",
        "labels": ["주어 He", "동사 is", "상관보어 not only smart", "상관보어 but also kind"]
      },
      "hints": ["💡 힌트: 동사 뒤의 상관 덩어리를 묶어보세요.", "✅ 정답: He is / not only smart / but also kind."],
      "tokens": ["He is", "not only smart", "but also kind"], // EBS Standard Chunks
      "blank_word": "but",
      "highlight": "not only smart but also kind"
    }
  ],
  "1-2": [
    {
      "level": "하",
      "en": "What I need is a cup of coffee.",
      "ko": "내가 필요한 것은 커피 한 잔이다.",
      "analysis": {
        "structure": "[What + S + V] (명사절) + V + SC",
        "point": "관계대명사 what이 이끄는 명사절 주어",
        "labels": ["명사절 주어 What I need", "동사 is", "보어 a cup of coffee"]
      },
      "tokens": ["What I need", "is", "a cup of coffee"], // Chunked
      "blank_word": "What",
      "highlight": "What I need"
    }
  ],
  "3-1": [
    {
      "level": "중",
      "en": "It is difficult for me to solve it.",
      "ko": "내가 그것을 푸는 것은 어렵다.",
      "analysis": { 
        "structure": "It + is + adj + for O + to V", 
        "point": "to부정사 의미상 주어 (for O)",
        "labels": ["가주어 It", "동사 is", "보어 difficult", "의미상주어 for me", "진주어 to solve it"]
      },
      "hints": ["💡 힌트: 가주어/진주어 구문의 경계를 찾아보세요.", "✅ 정답: It is difficult / for me / to solve it."],
      "tokens": ["It is difficult", "for me", "to solve it"], // EBS/Chunked
      "blank_word": "for",
      "highlight": "for me to solve"
    }
  ]
};