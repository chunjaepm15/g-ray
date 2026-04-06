import os
import json
import csv
import glob
from collections import defaultdict

# 이 스크립트는 원본 교과서 문장 풀(Sentence Pool)에서 특정 기준(예: common_grammar)에 따라 문장들을 동적으로 추출하여
# "학습용 유닛 번들(Unit Bundle)"을 유연하게 생성(재정렬)합니다. 앱 내에서 선생님이 규칙을 바꾸면 번들이 언제든 새로 만들어질 수 있는 아키텍처입니다.

TEXTBOOK_DATA_DIR = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data"
UNIT_ARCHIVE_FILE = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\archive\cheonjae_grammar_26.json"
OUTPUT_DIR = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles"

def load_sentence_pool():
    """모든 가공된 CSV에서 문장 데이터를 긁어와 거대한 단일 풀을 구성합니다."""
    pool = []
    csv_files = glob.glob(os.path.join(TEXTBOOK_DATA_DIR, "**", "*_organized.csv"), recursive=True)
    
    for file in csv_files:
        author = "이재영" if "이재영" in file else "정사열" if "정사열" in file else "기타"
        lesson_num = os.path.basename(os.path.dirname(file))
        
        with open(file, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 문법 태그 정리 (비어있거나 None인 경우 제외)
                g_str = row.get("grammar_name", "").strip()
                if not g_str:
                    continue

                # V2 Chunks parsing
                chunks_eng = [c.strip() for c in row.get('syntax_chunks_eng', '').split('|') if c.strip()]
                chunks_kor = [c.strip() for c in row.get('syntax_chunks_kor', '').split('|') if c.strip()]
                roles = [r.strip() for r in row.get('syntax_roles', '').split('|') if r.strip()]
                
                syntax_chunks = []
                if chunks_eng:
                    syntax_chunks = [
                        {"eng": e, "kor": k if i < len(chunks_kor) else "", "role": r if i < len(roles) else ""}
                        for i, (e, k, r) in enumerate(zip(chunks_eng, chunks_kor + ['']*(len(chunks_eng)-len(chunks_kor)), roles + ['']*(len(chunks_eng)-len(roles))))
                    ]

                v_flags = [f.strip() for f in row.get('variation_flags', '').split(',') if f.strip()]

                sentences_data = {
                    "id": row.get("id"),
                    "english": row.get("english"),
                    "korean": row.get("korean"),
                    "grammar_name": g_str,
                    "difficulty": row.get("difficulty", "중"),
                    "author": author,
                    "lesson": lesson_num,
                    "syntax_chunks": syntax_chunks,
                    "grammar_properties": {
                        "role_in_sentence": row.get('role_in_sentence', ''),
                        "trigger_word": g_str,
                        "target_pattern": row.get('structure', '')
                    },
                    "variation_flags": v_flags
                }
                pool.append(sentences_data)
    return pool

def is_matching_grammar(target_rule, sentence_grammar):
    """문장이 유닛 규칙에 부합하는지 휴리스틱 매칭"""
    t = target_rule.lower().replace(" ", "")
    s = sentence_grammar.lower().replace(" ", "")
    
    # 예외 매핑 테이블 (API나 CSV 생성 시 태그명 불일치 보정)
    mapping = {
        "관계대명사what": ["관계대명사","의문사구문","관계대명사what"],
        "현재완료진행(형)": ["현재완료", "현재분사", "완료시제"],
        "to부정사의의미상주어": ["to부정사"],
        "명사를수식하는분사": ["현재분사/동명사", "현재분사"],
        "접속사if/whether": ["조건의접속사", "if"],
        "가정법과거": ["if", "조건의접속사", "가정법"],
        "접속사sothat": ["접속사", "이유의접속사", "so", "that"],
        "too~to...": ["to부정사", "부사적용법"]
    }
    
    if t in s or s in t:
        return True
    
    # 맵핑 기반 확장 검색
    for key, aliases in mapping.items():
        if key in t:
            for alias in aliases:
                if alias in s:
                    return True
                    
    return False

def build_dynamic_curriculum():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("1. Loading Sentence Pool from all CSVs...")
    pool = load_sentence_pool()
    print(f"-> Loaded {len(pool)} total tagged sentences.")

    print("2. Loading Curriculum Rules (cheonjae_grammar_26.json)...")
    with open(UNIT_ARCHIVE_FILE, 'r', encoding='utf-8') as f:
        template = json.load(f)
    
    common_grammar = template.get("common_grammar", [])
    
    # 동적 커리큘럼 아키텍처: Curriculum 객체 안에 Configuration과 Bundled Data를 분리
    dynamic_curriculum = {
        "metadata": {
            "title": "공통 문법 마스터 과정 (앱 내 편집 가능)",
            "description": "선생님이 규칙(rule)을 수정하면 일괄적으로 문장 풀에서 실시간 재추출할 수 있도록 설계된 유동적 데이터 번들링 데이터입니다.",
            "type": "dynamic_rules"
        },
        "units": []
    }
    
    print("3. Bundling Sentences into Dynamic Units...")
    for idx, rule in enumerate(common_grammar, 1):
        target_grammar = rule["item"]
        unit_id = f"CG{idx:02d}"
        
        # 문장 매칭
        matched_sentences = []
        for s in pool:
            if is_matching_grammar(target_grammar, s["grammar_name"]):
                matched_sentences.append(s)
                
        # 최대 10개만 대표로 묶음 (또는 전부)
        limited_sentences = matched_sentences[:15]
        
        unit_block = {
            "unit_id": unit_id,
            "title": target_grammar,
            "origin_tags": [f"소영순 {rule.get('so_unit')}", f"이상기 {rule.get('lee_unit')}"],
            "rule_query": {"grammar_name_contains": target_grammar},
            "total_matches": len(matched_sentences),
            "sentences": limited_sentences
        }
        dynamic_curriculum["units"].append(unit_block)

    output_path = os.path.join(OUTPUT_DIR, "dynamic_curriculum_v1.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dynamic_curriculum, f, ensure_ascii=False, indent=2)
        
    print(f"-> Curriculum generation complete. Saved to: {output_path}")

if __name__ == "__main__":
    build_dynamic_curriculum()
