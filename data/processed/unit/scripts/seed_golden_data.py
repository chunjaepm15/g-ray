import json
import os

# "Golden Reference" - 전문가 검증을 거친 표준 예문 및 구문 분석 데이터
# 파이프라인에서 추출된 텍스트가 부정확할 경우, 이 데이터를 최우선으로 투입하여 학습 품질을 보장합니다.

GOLDEN_SAMPLES = {
    "접속사 if / whether": [
        {
            "id": "REF-IF-01",
            "english": "I wonder if it will rain tomorrow.",
            "korean": "내일 비가 올지 안 올지 궁금해.",
            "grammar_name": "접속사 if / whether",
            "syntax_chunks": [
                {"eng": "I wonder", "kor": "나는 궁금하다", "role": "Main Clause"},
                {"eng": "if it will rain", "kor": "비가 올지 아닐지", "role": "Noun Clause (Object)"},
                {"eng": "tomorrow.", "kor": "내일에.", "role": "Modifier"}
            ],
            "variation_flags": ["is_noun_clause", "can_replace_with_whether", "verb_of_uncertainty"],
            "difficulty": "중"
        },
        {
            "id": "REF-IF-02",
            "english": "I want to know whether you are coming or not.",
            "korean": "네가 올지 안 올지 알고 싶어.",
            "grammar_name": "접속사 if / whether",
            "syntax_chunks": [
                {"eng": "I want to know", "kor": "나는 알고 싶다", "role": "Main Clause"},
                {"eng": "whether you are coming", "kor": "네가 올지 어떨지", "role": "Noun Clause (Object)"},
                {"eng": "or not.", "kor": "아닌지.", "role": "Focus (or not)"}
            ],
            "variation_flags": ["is_noun_clause", "has_or_not", "whether_only_in_subject_position_hint"],
            "difficulty": "상"
        }
    ],
    "too ~ to ...": [
        {
            "id": "REF-TOO-01",
            "english": "The soup was too hot for me to eat.",
            "korean": "그 수프는 내가 먹기에 너무 뜨거웠다.",
            "grammar_name": "too ~ to ...",
            "syntax_chunks": [
                {"eng": "The soup was", "kor": "그 수프는 ~이었다", "role": "Subject + Verb"},
                {"eng": "too hot", "kor": "너무 뜨거운", "role": "Compliment (too adj)"},
                {"eng": "for me to eat.", "kor": "내가 먹기에 (불가능)", "role": "Infinitive + Meaningful Subject"}
            ],
            "variation_flags": ["too_to_structure", "has_meaningful_subject", "negative_meaning"],
            "difficulty": "상"
        },
        {
            "id": "REF-TOO-02",
            "english": "I am too tired to study English tonight.",
            "korean": "나는 오늘 밤 영어를 공부하기에 너무 피곤해.",
            "grammar_name": "too ~ to ...",
            "syntax_chunks": [
                {"eng": "I am", "kor": "나는 ~이다", "role": "Subject + Verb"},
                {"eng": "too tired", "kor": "너무 피곤한", "role": "Compliment (too adj)"},
                {"eng": "to study English tonight.", "kor": "공부하기에는 (너무 피곤해서 못함)", "role": "Infinitive Result"}
            ],
            "variation_flags": ["too_to_structure", "negative_meaning"],
            "difficulty": "중"
        }
    ],
    "관계대명사 what": [
        {
            "id": "REF-WHAT-01",
            "english": "What he said at the meeting was very important.",
            "korean": "그가 회의에서 말한 것은 매우 중요했다.",
            "grammar_name": "관계대명사 what",
            "syntax_chunks": [
                {"eng": "What he said", "kor": "그가 말한 것(은)", "role": "Noun Clause (Subject)"},
                {"eng": "at the meeting", "kor": "회의에서", "role": "Modifier"},
                {"eng": "was very important.", "kor": "매우 중요했다.", "role": "Main Verb + Complement"}
            ],
            "variation_flags": ["what_as_subject", "the_thing_which"],
            "difficulty": "상"
        }
    ]
}

JSON_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles\dynamic_curriculum_v1.json"

def seed_golden_samples():
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)
    
    updated_count = 0
    for unit in curriculum['units']:
        grammar_name = unit['title']
        if grammar_name in GOLDEN_SAMPLES:
            # 기존 추출 데이터 앞에 Golden Samples(검증 예문)를 우선 배치
            goldens = GOLDEN_SAMPLES[grammar_name]
            
            # 중복 방지를 위해 기존 풀 필터링 (원본 데이터 유지)
            existing_ids = [s['id'] for s in unit['sentences']]
            new_goldens = [g for g in goldens if g['id'] not in existing_ids]
            
            # 검증 데이터가 제일 앞에 오도록 재설계
            unit['sentences'] = new_goldens + unit['sentences']
            unit['is_verified'] = True # 검증된 예문이 포함됨을 표시
            updated_count += len(new_goldens)
            print(f"-> Seeded {len(new_goldens)} golden samples to unit: {grammar_name}")

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Total {updated_count} golden samples injected into curriculum bundle.")

if __name__ == "__main__":
    seed_golden_samples()
