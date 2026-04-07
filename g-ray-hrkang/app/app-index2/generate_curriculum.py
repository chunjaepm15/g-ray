import os
import json
import re

# Textbook paths
TEXTBOOK_DIR = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\raw\textbooks"
OUTPUT_FILE = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index2\js\curriculum_data.js"

# 8 Units - 24 Sub-units
UNITS_CONFIG = [
    {"id": "1-1", "grammar": r"not only .* but also", "title": "not only ~ but also ..."},
    {"id": "1-2", "grammar": r"\bwhat\b", "title": "관계대명사 what"},
    {"id": "2-1", "grammar": r"(must|can|should|will|may) be [a-z]+ed", "title": "조동사 + 수동태"},
    {"id": "2-2", "grammar": r"have been [a-z]+ing", "title": "현재완료 진행"},
    {"id": "3-1", "grammar": r"for .* to ", "title": "to부정사의 의미상 주어"},
    {"id": "3-2", "grammar": r"\b(where|when|why|how)\b", "title": "관계부사"},
    {"id": "4-1", "grammar": r"had [a-z]+ed", "title": "과거완료"},
    {"id": "4-2", "grammar": r"\b[a-z]+ing\b", "title": "명사를 수식하는 현재분사"},
    {"id": "5-1", "grammar": r"^[A-Z][a-z]+ing", "title": "분사구문"},
    {"id": "5-2", "grammar": r"\b(if|whether)\b", "title": "접속사 if / whether"},
    {"id": "6-1", "grammar": r"too .* to ", "title": "too ~ to ..."},
    {"id": "6-2", "grammar": r", which", "title": "계속적 용법의 관계대명사"},
    {"id": "7-1", "grammar": r"if .* (were|would|could)", "title": "가정법 과거"},
    {"id": "7-2", "grammar": r"so that", "title": "접속사 so that"},
    {"id": "8-1", "grammar": r"the (more|less|better|higher|sooner) .*, the (more|less|better|higher|sooner)", "title": "the+비교급, the+비교급"},
    {"id": "8-2", "grammar": r"\bwhose\b", "title": "소유격 관계대명사"}
]

def get_difficulty(sentence):
    words = sentence.split()
    count = len(words)
    if count >= 8: return "상"
    if count >= 6: return "중"
    return "하"

def generate_curriculum():
    # In a real scenario, this would scan the large PDFs
    # For now, we generate/extract representative sentences for Middle School Grade 3
    
    curriculum = {}
    
    # Mocked extraction based on actual Middle 3 Textbook patterns
    RAW_SAMPLES = [
        {"sub": "1-1", "s": "He is not only smart but also very kind.", "k": "그는 똑똑할 뿐만 아니라 매우 친절하다."},
        {"sub": "1-1", "s": "Not only you but also I am responsible for this project.", "k": "너뿐만 아니라 나도 이 프로젝트에 책임이 있다."},
        {"sub": "1-1", "s": "The research project is not only long but also very complicated.", "k": "그 연구 프로젝트는 길 뿐만 아니라 매우 복잡하다."},
        {"sub": "1-2", "s": "What I need is a warm cup of coffee.", "k": "내가 필요한 것은 따뜻한 커피 한 잔이다."},
        {"sub": "1-2", "s": "This is exactly what I wanted to tell you.", "k": "이것이 정확히 내가 너에게 말하고 싶었던 것이다."},
        {"sub": "2-1", "s": "The task must be finished by tomorrow.", "k": "그 작업은 내일까지 끝나야만 한다."},
        {"sub": "2-2", "s": "I have been reading this book for three hours.", "k": "나는 세 시간 동안 이 책을 읽고 있다."},
        {"sub": "3-2", "s": "This is the city where I was born.", "k": "이곳은 내가 태어난 도시이다."},
        {"sub": "6-1", "s": "The box was too heavy for me to lift.", "k": "그 상자는 내가 들기엔 너무 무거웠다."}
    ]
    
    for item in RAW_SAMPLES:
        sub_id = item["sub"]
        if sub_id not in curriculum: curriculum[sub_id] = []
        
        sentence = item["s"]
        words = sentence.replace(",", "").replace(".", "").split()
        
        curriculum[sub_id].append({
            "en": sentence,
            "ko": item["k"],
            "level": get_difficulty(sentence),
            "tokens": words,
            "blank_idx": len(words) // 2
        })
        
    return curriculum

def save_js(data):
    js_content = f"const CURRICULUM_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};"
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Generated curriculum data at {OUTPUT_FILE}")

if __name__ == "__main__":
    data = generate_curriculum()
    save_js(data)
