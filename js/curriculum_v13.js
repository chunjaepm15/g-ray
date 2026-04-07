const CURRICULUM = {
  "metadata": {
<<<<<<< Updated upstream
    "title": "GrammarViewerPro Curriculum v13.1 (Refined)",
    "description": "2026-04-06: 10개 핵심 문법(관계대명사 what, 현재완료 진행형 등) 유닛당 4개씩, 총 40개의 엄선된 문장 데이터셋입니다. S/V/O/C/M 구문 분석과 한국어 라벨이 적용되었습니다.",
    "version": "13.1.0-final"
=======
    "title": "GrammarViewerPro Curriculum v13.1 (Refined & Optimized)",
    "description": "2026-04-06: 10개 핵심 문법 유닛당 4개씩, 총 40개의 최적화된 고정밀(REF) 데이터셋입니다. S/V/O/C/M 구문 분석과 AI 힌트 플래그가 적용되었습니다.",
    "version": "13.1.1-final-pro"
>>>>>>> Stashed changes
  },
  "units": [
    {
      "unit_id": "Unit 01",
      "title": "관계대명사 what",
<<<<<<< Updated upstream
      "total_matches": 4,
      "sentences": [
        {
          "id": "L04-11",
=======
      "origin_tags": ["관계대명사"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L04-11",
>>>>>>> Stashed changes
          "english": "The judge was impressed by what she said and finally gave her permission.",
          "korean": "판사는 그녀가 한 말에 감명받았고 마침내 그녀에게 허가를 내주었다.",
          "grammar": "관계대명사 what",
          "syntax_chunks": [
            { "eng": "The judge", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was impressed", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "by what she said and finally gave her permission.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "by what she said", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "and", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "finally", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "gave", "kor": "동사(V)", "role": "Verb" },
            { "eng": "her", "kor": "목적어(O)", "role": "Object" },
            { "eng": "permission.", "kor": "목적어(O)", "role": "Object" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
          "id": "REF-L04-12",
          "english": "That was what impressed me most in the movie.",
          "korean": "그것이 영화에서 나를 가장 감동시킨 것이었다.",
          "grammar": "관계대명사 what",
          "syntax_chunks": [
            { "eng": "That", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "what impressed me most", "kor": "보어(C)", "role": "Complement" },
            { "eng": "in the movie.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "what impressed me most in the movie.", "kor": "보어(C)", "role": "Complement" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
          "id": "REF-L04-15",
          "english": "That’s what I need to learn from her.",
          "korean": "그것이 내가 그녀로부터 배워야 할 점이다.",
          "grammar": "관계대명사 what",
          "syntax_chunks": [
            { "eng": "That’s", "kor": "주어(S)", "role": "Subject" },
<<<<<<< Updated upstream
            { "eng": "what I", "kor": "보어(C)", "role": "Complement" },
            { "eng": "need to learn", "kor": "동사(V)", "role": "Verb" },
            { "eng": "from her.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "what I need to learn from her.", "kor": "보어(C)", "role": "Complement" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-100",
=======
          "id": "REF-L04-100",
>>>>>>> Stashed changes
          "english": "I love what I do.",
          "korean": "나는 내가 하는 일을 사랑한다.",
          "grammar": "관계대명사 what",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "love", "kor": "동사(V)", "role": "Verb" },
            { "eng": "what I do.", "kor": "목적어(O)", "role": "Object" }
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        }
      ]
    },
    {
      "unit_id": "Unit 02",
<<<<<<< Updated upstream
      "title": "현재완료 진행형",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L02-158",
=======
      "title": "현재완료 진행(형)",
      "origin_tags": ["현재완료", "진행형"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L02-158",
>>>>>>> Stashed changes
          "english": "Jake has been sleeping all afternoon.",
          "korean": "Jake는 오후 내내 자고 있었다.",
          "grammar": "현재완료 진행형",
          "syntax_chunks": [
            { "eng": "Jake", "kor": "주어(S)", "role": "Subject" },
            { "eng": "has been sleeping", "kor": "동사(V)", "role": "Verb" },
            { "eng": "all afternoon.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L03-82",
=======
          "id": "REF-L03-82",
>>>>>>> Stashed changes
          "english": "I have been waiting for his call for two hours.",
          "korean": "나는 그의 전화를 두 시간 동안 기다렸다.",
          "grammar": "현재완료 진행형",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "have been waiting", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "for his call", "kor": "목적어(O)", "role": "Object" },
=======
            { "eng": "for his call", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "for two hours.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson03"
        },
        {
<<<<<<< Updated upstream
          "id": "L03-83",
=======
          "id": "REF-L03-83",
>>>>>>> Stashed changes
          "english": "I have been learning English since I was 10.",
          "korean": "나는 10살 때부터 영어를 배워왔습니다.",
          "grammar": "현재완료 진행형",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "have been learning", "kor": "동사(V)", "role": "Verb" },
            { "eng": "English", "kor": "목적어(O)", "role": "Object" },
            { "eng": "since I was 10.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson03"
        },
        {
<<<<<<< Updated upstream
          "id": "L08-079",
=======
          "id": "REF-L08-079",
>>>>>>> Stashed changes
          "english": "She has been studying wild chimpanzees in Africa since her twenties.",
          "korean": "그녀는 20대부터 아프리카에서 야생 침팬지를 연구해왔습니다.",
          "grammar": "현재완료 진행형",
          "syntax_chunks": [
            { "eng": "She", "kor": "주어(S)", "role": "Subject" },
            { "eng": "has been studying", "kor": "동사(V)", "role": "Verb" },
            { "eng": "wild chimpanzees", "kor": "목적어(O)", "role": "Object" },
            { "eng": "in Africa", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "since her twenties.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson08"
        }
      ]
    },
    {
      "unit_id": "Unit 03",
<<<<<<< Updated upstream
      "title": "to부정사 의미상주어",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L06-29",
          "english": "It is important for everyone to value the resources.",
          "korean": "모두가 자원을 소중히 여기는 것이 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "가주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for everyone to value", "kor": "의미상주어(S)+to부정사", "role": "Modifier" },
            { "eng": "the resources.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        },
        {
          "id": "L06-01",
          "english": "It is important for us to protect nature.",
          "korean": "우리가 자연을 보호하는 것은 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "가주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for us to protect", "kor": "의미상주어(S)+to부정사", "role": "Modifier" },
            { "eng": "nature.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        },
        {
          "id": "L06-02",
          "english": "It is necessary for us to reduce the amount of waste.",
          "korean": "우리가 쓰레기 양을 줄이는 것이 필요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "가주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "necessary", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for us to reduce", "kor": "의미상주어(S)+to부정사", "role": "Modifier" },
            { "eng": "the amount of waste.", "kor": "수식어(M)", "role": "Modifier" }
=======
      "title": "to부정사의 의미상 주어",
      "origin_tags": ["to부정사", "의미상주어"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L06-29",
          "english": "It is important for everyone to value the resources.",
          "korean": "모두가 자원을 소중히 여기는 것이 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for everyone", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to value the resources.", "kor": "진주어(S)", "role": "Subject" }
>>>>>>> Stashed changes
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        },
        {
<<<<<<< Updated upstream
          "id": "L06-94",
          "english": "It is important for senior citizens to exercise regularly.",
          "korean": "노인들이 규칙적으로 운동하는 것은 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "가주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for senior citizens to exercise", "kor": "의미상주어(S)+to부정사", "role": "Modifier" },
            { "eng": "regularly.", "kor": "수식어(M)", "role": "Modifier" }
=======
          "id": "REF-L06-01",
          "english": "It is important for us to protect nature.",
          "korean": "우리가 자연을 보호하는 것은 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for us", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to protect nature.", "kor": "진주어(S)", "role": "Subject" }
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        },
        {
          "id": "REF-L06-02",
          "english": "It is necessary for us to reduce the amount of waste.",
          "korean": "우리가 쓰레기 양을 줄이는 것이 필요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "necessary", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for us", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to reduce the amount of waste.", "kor": "진주어(S)", "role": "Subject" }
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        },
        {
          "id": "REF-L06-94",
          "english": "It is important for senior citizens to exercise regularly.",
          "korean": "노인들이 규칙적으로 운동하는 것은 중요하다.",
          "grammar": "to부정사 의미상주어",
          "syntax_chunks": [
            { "eng": "It", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "important", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for senior citizens", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to exercise regularly.", "kor": "진주어(S)", "role": "Subject" }
>>>>>>> Stashed changes
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        }
      ]
    },
    {
      "unit_id": "Unit 04",
<<<<<<< Updated upstream
      "title": "과거 완료",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L02-35",
=======
      "title": "과거완료",
      "origin_tags": ["과거완료"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L02-35",
>>>>>>> Stashed changes
          "english": "I was glad my dad had made me wear gloves.",
          "korean": "아버지가 나에게 장갑을 끼게 하셨던 것이 다행이었다.",
          "grammar": "과거 완료",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
<<<<<<< Updated upstream
            { "eng": "was glad", "kor": "동사(V)+보어(C)", "role": "Verb" },
            { "eng": "my dad had made me wear gloves.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
            { "eng": "glad", "kor": "보어(C)", "role": "Complement" },
            { "eng": "my dad had made me wear gloves.", "kor": "주어(S)", "role": "Subject" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L02-16",
=======
          "id": "REF-L02-16",
>>>>>>> Stashed changes
          "english": "He couldn’t open the door because he had lost his key.",
          "korean": "그는 열쇠를 잃어버렸었기 때문에 문을 열 수 없었다.",
          "grammar": "과거 완료",
          "syntax_chunks": [
            { "eng": "He", "kor": "주어(S)", "role": "Subject" },
            { "eng": "couldn’t open", "kor": "동사(V)", "role": "Verb" },
            { "eng": "the door", "kor": "목적어(O)", "role": "Object" },
            { "eng": "because he had lost his key.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "정사열",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L03-19",
=======
          "id": "REF-L03-19",
>>>>>>> Stashed changes
          "english": "Malala Yousafzai won the Nobel Prize because she had fought for children’s rights.",
          "korean": "말랄라 유사프자이는 아동 권리를 위해 싸웠기 때문에 노벨상을 받았다.",
          "grammar": "과거 완료",
          "syntax_chunks": [
            { "eng": "Malala Yousafzai", "kor": "주어(S)", "role": "Subject" },
            { "eng": "won", "kor": "동사(V)", "role": "Verb" },
            { "eng": "the Nobel Prize", "kor": "목적어(O)", "role": "Object" },
            { "eng": "because she had fought for children’s rights.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "정사열",
          "lesson": "Lesson03"
        },
        {
<<<<<<< Updated upstream
          "id": "L05-03",
=======
          "id": "REF-L05-03",
>>>>>>> Stashed changes
          "english": "Jake was late because he had missed the bus.",
          "korean": "제이크는 버스를 놓쳤었기 때문에 늦었다.",
          "grammar": "과거 완료",
          "syntax_chunks": [
            { "eng": "Jake", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
            { "eng": "late", "kor": "보어(C)", "role": "Complement" },
            { "eng": "because he had missed the bus.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson05"
        }
      ]
    },
    {
      "unit_id": "Unit 05",
<<<<<<< Updated upstream
      "title": "명사 수식 분사",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L02-03",
=======
      "title": "명사를 수식하는 분사",
      "origin_tags": ["분사", "명사수식"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L02-03",
>>>>>>> Stashed changes
          "english": "The man sitting under the tree is my uncle.",
          "korean": "나무 아래에 앉아 있는 남자는 저의 삼촌입니다.",
          "grammar": "명사 수식 분사",
          "syntax_chunks": [
            { "eng": "The man sitting under the tree", "kor": "주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "my uncle.", "kor": "보어(C)", "role": "Complement" }
          ],
          "author": "이재영",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L02-02",
=======
          "id": "REF-L02-02",
>>>>>>> Stashed changes
          "english": "The broken chair was fixed by my dad.",
          "korean": "부서진 의자는 우리 아빠에 의해 고쳐졌다.",
          "grammar": "명사 수식 분사",
          "syntax_chunks": [
            { "eng": "The broken chair", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was fixed", "kor": "동사(V)", "role": "Verb" },
            { "eng": "by my dad.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L02-05",
=======
          "id": "REF-L02-05",
>>>>>>> Stashed changes
          "english": "The girl reading a book in the corner is Nari.",
          "korean": "구석에서 책을 읽고 있는 소녀는 나리이다.",
          "grammar": "명사 수식 분사",
          "syntax_chunks": [
            { "eng": "The girl reading a book in the corner", "kor": "주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
            { "eng": "Nari.", "kor": "보어(C)", "role": "Complement" }
          ],
          "author": "이재영",
          "lesson": "Lesson02"
        },
        {
<<<<<<< Updated upstream
          "id": "L01-14",
=======
          "id": "REF-L01-14",
>>>>>>> Stashed changes
          "english": "A dog named Barney was sitting on the bench.",
          "korean": "바니라고 불리는 개가 벤치에 앉아 있었다.",
          "grammar": "명사 수식 분사",
          "syntax_chunks": [
            { "eng": "A dog named Barney", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was sitting", "kor": "동사(V)", "role": "Verb" },
            { "eng": "on the bench.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "정사열",
          "lesson": "Lesson01"
        }
      ]
    },
    {
      "unit_id": "Unit 06",
      "title": "분사구문",
<<<<<<< Updated upstream
      "total_matches": 4,
      "sentences": [
        {
          "id": "L04-09",
=======
      "origin_tags": ["분사구문"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L04-09",
>>>>>>> Stashed changes
          "english": "Hearing this, I felt really sorry for her.",
          "korean": "이 말을 듣고 나는 그녀에 대해 정말 안타까움을 느꼈다.",
          "grammar": "분사구문",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "Hearing this,", "kor": "분사구문(M)", "role": "Modifier" },
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "felt", "kor": "동사(V)", "role": "Verb" },
            { "eng": "really sorry", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for her.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "Hearing this,", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "felt", "kor": "동사(V)", "role": "Verb" },
            { "eng": "really sorry for her.", "kor": "보어(C)", "role": "Complement" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-16",
=======
          "id": "REF-L04-16",
>>>>>>> Stashed changes
          "english": "Watching this movie, I could learn how to face challenges in life.",
          "korean": "이 영화를 보면서 나는 인생의 도전에 맞서는 법을 배울 수 있었다.",
          "grammar": "분사구문",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "Watching this movie,", "kor": "분사구문(M)", "role": "Modifier" },
=======
            { "eng": "Watching this movie,", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "could learn", "kor": "동사(V)", "role": "Verb" },
            { "eng": "how to face challenges in life.", "kor": "목적어(O)", "role": "Object" }
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-17",
=======
          "id": "REF-L04-17",
>>>>>>> Stashed changes
          "english": "Walking on the street, he looked at the map.",
          "korean": "길을 걸으면서 그는 지도를 보았다.",
          "grammar": "분사구문",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "Walking on the street,", "kor": "분사구문(M)", "role": "Modifier" },
=======
            { "eng": "Walking on the street,", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "he", "kor": "주어(S)", "role": "Subject" },
            { "eng": "looked", "kor": "동사(V)", "role": "Verb" },
            { "eng": "at the map.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-101",
=======
          "id": "REF-L04-101",
>>>>>>> Stashed changes
          "english": "I feel proud, seeing people enjoy my dishes.",
          "korean": "사람들이 내 요리를 즐기는 것을 보며 자부심을 느낀다.",
          "grammar": "분사구문",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "feel", "kor": "동사(V)", "role": "Verb" },
            { "eng": "proud,", "kor": "보어(C)", "role": "Complement" },
<<<<<<< Updated upstream
            { "eng": "seeing people enjoy my dishes.", "kor": "분사구문(M)", "role": "Modifier" }
=======
            { "eng": "seeing people enjoy my dishes.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson04"
        }
      ]
    },
    {
      "unit_id": "Unit 07",
<<<<<<< Updated upstream
      "title": "명사절 if / whether",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L07-P-03",
=======
      "title": "접속사 if / whether",
      "origin_tags": ["명사절", "if", "whether"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L07-P-03",
>>>>>>> Stashed changes
          "english": "You also have to check if they are based on facts.",
          "korean": "당신은 또한 그것이 사실에 근거하고 있는지 확인해야 합니다.",
          "grammar": "명사절 if / whether",
          "syntax_chunks": [
            { "eng": "You", "kor": "주어(S)", "role": "Subject" },
<<<<<<< Updated upstream
            { "eng": "also have to check", "kor": "동사(V)", "role": "Verb" },
            { "eng": "if they are based on facts.", "kor": "목적어(O)", "role": "Object" }
          ],
=======
            { "eng": "also", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "have to check", "kor": "동사(V)", "role": "Verb" },
            { "eng": "if they are based on facts.", "kor": "목적어(O)", "role": "Object" }
          ],
          "variation_flags": ["is_noun_clause"],
>>>>>>> Stashed changes
          "author": "정사열",
          "lesson": "Lesson07"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-01",
=======
          "id": "REF-L04-01",
>>>>>>> Stashed changes
          "english": "I don’t know if it will rain tomorrow.",
          "korean": "내일 비가 올지 안 올지 모르겠어.",
          "grammar": "명사절 if / whether",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "don’t know", "kor": "동사(V)", "role": "Verb" },
            { "eng": "if it will rain tomorrow.", "kor": "목적어(O)", "role": "Object" }
          ],
          "variation_flags": ["is_noun_clause"],
          "author": "이재영",
          "lesson": "Lesson04"
        },
        {
          "id": "REF-L04-04",
          "english": "I’m curious whether she will come to the party.",
          "korean": "그녀가 파티에 올지 궁금해.",
          "grammar": "명사절 if / whether",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "’m", "kor": "동사(V)", "role": "Verb" },
            { "eng": "curious", "kor": "보어(C)", "role": "Complement" },
<<<<<<< Updated upstream
            { "eng": "whether she will come to the party.", "kor": "수식어(M)", "role": "Modifier" }
=======
            { "eng": "whether she will come to the party.", "kor": "목적어(O)", "role": "Object" }
>>>>>>> Stashed changes
          ],
          "variation_flags": ["is_noun_clause"],
          "author": "이재영",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-045",
=======
          "id": "REF-L04-045",
>>>>>>> Stashed changes
          "english": "I wonder whether there is any better way to discover another culture.",
          "korean": "다른 문화를 발견할 수 있는 더 좋은 방법이 있는지 궁금합니다.",
          "grammar": "명사절 if / whether",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "wonder", "kor": "동사(V)", "role": "Verb" },
            { "eng": "whether there is any better way to discover another culture.", "kor": "목적어(O)", "role": "Object" }
          ],
          "variation_flags": ["is_noun_clause"],
          "author": "이재영",
          "lesson": "Lesson04"
        }
      ]
    },
    {
      "unit_id": "Unit 08",
<<<<<<< Updated upstream
      "title": "too ~ to",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L07-14",
=======
      "title": "too ~ to ...",
      "origin_tags": ["too_to"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L07-14",
>>>>>>> Stashed changes
          "english": "If a story or a photo seems too good to be true, stop and think.",
          "korean": "만약 이야기나 사진이 믿기기 힘들 정도로 너무 좋다면, 멈춰서 생각해 보라.",
          "grammar": "too ~ to",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "If a story or a photo seems too good to be true,", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "stop", "kor": "동사(V)", "role": "Verb" },
            { "eng": "and think.", "kor": "수식어(M)", "role": "Modifier" }
          ],
=======
            { "eng": "If a story or a photo", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "seems", "kor": "동사(V)", "role": "Verb" },
            { "eng": "too good", "kor": "보어(C)", "role": "Complement" },
            { "eng": "to be true,", "kor": "주어(S)", "role": "Subject" },
            { "eng": "stop and think.", "kor": "동사(V)", "role": "Verb" }
          ],
          "variation_flags": ["too_to_structure"],
>>>>>>> Stashed changes
          "author": "정사열",
          "lesson": "Lesson07"
        },
        {
<<<<<<< Updated upstream
          "id": "L08-05",
=======
          "id": "REF-L08-05",
>>>>>>> Stashed changes
          "english": "Science is too difficult for me to finish my homework.",
          "korean": "과학은 나에게 너무 어려워 오늘 숙제를 다 끝낼 수 있을 것 같지 않아.",
          "grammar": "too ~ to",
          "syntax_chunks": [
            { "eng": "Science", "kor": "주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "too difficult for me to finish", "kor": "보어(C)", "role": "Complement" },
            { "eng": "my homework.", "kor": "목적어(O)", "role": "Object" }
          ],
=======
            { "eng": "too difficult", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for me", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to finish my homework.", "kor": "주어(S)", "role": "Subject" }
          ],
          "variation_flags": ["too_to_structure"],
>>>>>>> Stashed changes
          "author": "정사열",
          "lesson": "Lesson08"
        },
        {
<<<<<<< Updated upstream
          "id": "L08-90",
=======
          "id": "REF-L08-90",
>>>>>>> Stashed changes
          "english": "No, it’s too difficult for me to make food.",
          "korean": "아니, 음식 만드는 게 너무 힘들어.",
          "grammar": "too ~ to",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "It", "kor": "주어(S)", "role": "Subject" },
            { "eng": "’s", "kor": "동사(V)", "role": "Verb" },
            { "eng": "too difficult for me to make", "kor": "보어(C)", "role": "Complement" },
            { "eng": "food.", "kor": "목적어(O)", "role": "Object" }
          ],
=======
            { "eng": "No,", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "it", "kor": "주어(S)", "role": "Subject" },
            { "eng": "’s", "kor": "동사(V)", "role": "Verb" },
            { "eng": "too difficult", "kor": "보어(C)", "role": "Complement" },
            { "eng": "for me", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "to make food.", "kor": "주어(S)", "role": "Subject" }
          ],
          "variation_flags": ["too_to_structure"],
>>>>>>> Stashed changes
          "author": "정사열",
          "lesson": "Lesson08"
        },
        {
<<<<<<< Updated upstream
          "id": "L08-67",
=======
          "id": "REF-L08-67",
>>>>>>> Stashed changes
          "english": "When the day of the main tryouts came, she was too afraid to go.",
          "korean": "본선 시험 날이 왔을 때, 그녀는 가기가 너무 두려웠습니다.",
          "grammar": "too ~ to",
          "syntax_chunks": [
            { "eng": "When the day of the main tryouts came,", "kor": "수식어(M)", "role": "Modifier" },
            { "eng": "she", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "too afraid to go.", "kor": "보어(C)", "role": "Complement" }
          ],
=======
            { "eng": "too afraid", "kor": "보어(C)", "role": "Complement" },
            { "eng": "to go.", "kor": "주어(S)", "role": "Subject" }
          ],
          "variation_flags": ["too_to_structure"],
>>>>>>> Stashed changes
          "author": "이재영",
          "lesson": "Lesson08"
        }
      ]
    },
    {
      "unit_id": "Unit 09",
      "title": "가정법 과거",
<<<<<<< Updated upstream
      "total_matches": 4,
      "sentences": [
        {
          "id": "L05-18",
=======
      "origin_tags": ["가정법"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L05-18",
>>>>>>> Stashed changes
          "english": "If I had wings, I would fly in the sky.",
          "korean": "나에게 날개가 있다면 하늘을 날 수 있을 텐데.",
          "grammar": "가정법 과거",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "If I had wings,", "kor": "가정법조건절(M)", "role": "Modifier" },
=======
            { "eng": "If I had wings,", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "would fly", "kor": "동사(V)", "role": "Verb" },
            { "eng": "in the sky.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "정사열",
          "lesson": "Lesson05"
        },
        {
<<<<<<< Updated upstream
          "id": "L05-08",
=======
          "id": "REF-L05-08",
>>>>>>> Stashed changes
          "english": "If I got a letter from you, I would be very happy.",
          "korean": "당신에게서 편지를 받는다면 정말 행복할 거예요.",
          "grammar": "가정법 과거",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "If I got a letter from you,", "kor": "가정법조건절(M)", "role": "Modifier" },
=======
            { "eng": "If I got a letter from you,", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "would be", "kor": "동사(V)", "role": "Verb" },
            { "eng": "very happy.", "kor": "보어(C)", "role": "Complement" }
          ],
          "author": "정사열",
          "lesson": "Lesson05"
        },
        {
<<<<<<< Updated upstream
          "id": "L05-14",
=======
          "id": "REF-L05-14",
>>>>>>> Stashed changes
          "english": "I would be so happy if you were with me.",
          "korean": "당신이 나와 함께 있다면 정말 행복할 거예요.",
          "grammar": "가정법 과거",
          "syntax_chunks": [
            { "eng": "I", "kor": "주어(S)", "role": "Subject" },
            { "eng": "would be", "kor": "동사(V)", "role": "Verb" },
            { "eng": "so happy", "kor": "보어(C)", "role": "Complement" },
<<<<<<< Updated upstream
            { "eng": "if you were with me.", "kor": "가정법조건절(M)", "role": "Modifier" }
=======
            { "eng": "if you were with me.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson05"
        },
        {
<<<<<<< Updated upstream
          "id": "L06-03",
=======
          "id": "REF-L06-03",
>>>>>>> Stashed changes
          "english": "If she had a car, she would drive everywhere.",
          "korean": "그녀가 차가 있다면 어디든 운전해서 갈 텐데 말이죠.",
          "grammar": "가정법 과거",
          "syntax_chunks": [
<<<<<<< Updated upstream
            { "eng": "If she had a car,", "kor": "가정법조건절(M)", "role": "Modifier" },
=======
            { "eng": "If she had a car,", "kor": "수식어(M)", "role": "Modifier" },
>>>>>>> Stashed changes
            { "eng": "she", "kor": "주어(S)", "role": "Subject" },
            { "eng": "would drive", "kor": "동사(V)", "role": "Verb" },
            { "eng": "everywhere.", "kor": "수식어(M)", "role": "Modifier" }
          ],
          "author": "이재영",
          "lesson": "Lesson06"
        }
      ]
    },
    {
      "unit_id": "Unit 10",
<<<<<<< Updated upstream
      "title": "so ~ that",
      "total_matches": 4,
      "sentences": [
        {
          "id": "L05-38",
=======
      "title": "접속사 so that",
      "origin_tags": ["so_that"],
      "total_matches": 4,
      "sentences": [
        {
          "id": "REF-L05-38",
>>>>>>> Stashed changes
          "english": "The PCI lost so many seats that it almost seems dead.",
          "korean": "이탈리아 공산당은 의석을 너무 많이 잃어서 거의 사멸한 것 같습니다.",
          "grammar": "so ~ that",
          "syntax_chunks": [
            { "eng": "The PCI", "kor": "주어(S)", "role": "Subject" },
            { "eng": "lost", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "so many seats that it almost seems dead.", "kor": "목적어(O)", "role": "Object" }
=======
            { "eng": "so many seats", "kor": "목적어(O)", "role": "Object" },
            { "eng": "that it almost seems dead.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "정사열",
          "lesson": "Lesson05"
        },
        {
<<<<<<< Updated upstream
          "id": "L04-132",
=======
          "id": "REF-L04-132",
>>>>>>> Stashed changes
          "english": "The street food was so cheap and delicious that workers ate it.",
          "korean": "길거리 음식은 너무 저렴하고 맛있어서 직장인들이 그것을 먹었습니다.",
          "grammar": "so ~ that",
          "syntax_chunks": [
            { "eng": "The street food", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "so cheap and delicious that workers ate it.", "kor": "보어(C)", "role": "Complement" }
=======
            { "eng": "so cheap and delicious", "kor": "보어(C)", "role": "Complement" },
            { "eng": "that workers ate it.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "이재영",
          "lesson": "Lesson04"
        },
        {
<<<<<<< Updated upstream
          "id": "L08-113",
=======
          "id": "REF-L08-113",
>>>>>>> Stashed changes
          "english": "Dorothy was so good at that she was invited to join a men’s team.",
          "korean": "Dorothy는 일을 너무 잘해서 남자 팀에 합류하도록 초대받았습니다.",
          "grammar": "so ~ that",
          "syntax_chunks": [
            { "eng": "Dorothy", "kor": "주어(S)", "role": "Subject" },
            { "eng": "was", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "so good at that she was invited to join a men’s team.", "kor": "보어(C)", "role": "Complement" }
=======
            { "eng": "so good at (it)", "kor": "보어(C)", "role": "Complement" },
            { "eng": "that she was invited to join a men’s team.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "이재영",
          "lesson": "Lesson08"
        },
        {
<<<<<<< Updated upstream
          "id": "L03-006",
=======
          "id": "REF-L03-006",
>>>>>>> Stashed changes
          "english": "My hobby is so interesting that I spend most of my free time on it.",
          "korean": "나의 취미는 너무 재미있어서 나는 자유 시간의 대부분을 그것에 씁니다.",
          "grammar": "so ~ that",
          "syntax_chunks": [
            { "eng": "My hobby", "kor": "주어(S)", "role": "Subject" },
            { "eng": "is", "kor": "동사(V)", "role": "Verb" },
<<<<<<< Updated upstream
            { "eng": "so interesting that I spend most of my free time on it.", "kor": "보어(C)", "role": "Complement" }
=======
            { "eng": "so interesting", "kor": "보어(C)", "role": "Complement" },
            { "eng": "that I spend most of my free time on it.", "kor": "수식어(M)", "role": "Modifier" }
>>>>>>> Stashed changes
          ],
          "author": "이재영",
          "lesson": "Lesson03"
        }
      ]
    }
  ]
};