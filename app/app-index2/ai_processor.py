import os
import json
import fitz  # PyMuPDF
import google.generativeai as genai
import re

# Gemini API Configuration
GEMINI_API_KEY = "AIzaSyBNRCmERDyBxuRDPNNXzPNRiGj-lvvHzMU"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Textbook paths
TEXTBOOK_FILES = [
    r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\raw\textbooks\중등_영어3_이재영(15개정)_교과서.pdf",
    r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\raw\textbooks\중등_영어3_정사열(15개정)_교과서.pdf"
]
OUTPUT_JS = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index2\js\curriculum_data.js"

# 8 Units - 24 Sub-units Grammar Mappings
CURRICULUM_RULES = [
    {"id": "1-1", "grammar": "not only A but also B", "desc": "상관접속사"},
    {"id": "1-2", "grammar": "관계대명사 what", "desc": "명사절"},
    {"id": "2-1", "grammar": "조동사 + 수동태", "desc": "수동태"},
    {"id": "2-2", "grammar": "현재완료 진행", "desc": "시제"},
    {"id": "3-1", "grammar": "to부정사의 의미상 주어", "desc": "준동사"},
    {"id": "3-2", "grammar": "관계부사", "desc": "관계사"},
    {"id": "4-1", "grammar": "과거완료", "desc": "시제"},
    {"id": "4-2", "grammar": "명사를 수식하는 현재분사", "desc": "분사"},
    {"id": "5-1", "grammar": "분사구문", "desc": "분사"},
    {"id": "5-2", "grammar": "접속사 if / whether", "desc": "명사절"},
    {"id": "6-1", "grammar": "too ~ to ...", "desc": "부정 구문"},
    {"id": "6-2", "grammar": "계속적 용법의 관계대명사", "desc": "관계사"},
    {"id": "7-1", "grammar": "가정법 과거", "desc": "가정법"},
    {"id": "7-2", "grammar": "접속사 so that", "desc": "부사절"},
    {"id": "8-1", "grammar": "the+비교급, the+비교급", "desc": "비교"},
    {"id": "8-2", "grammar": "소유격 관계대명사", "desc": "관계사"}
]

def extract_text_from_pdf(path):
    print(f"Extracting sample text from {os.path.basename(path)}...")
    text = ""
    try:
        doc = fitz.open(path)
        # Extract first 50 pages for sampling to avoid token limit
        for i in range(min(50, len(doc))):
            text += doc[i].get_text()
        doc.close()
    except Exception as e:
        print(f"Error reading {path}: {e}")
    return text

def process_with_gemini(raw_text, rule):
    prompt = f"""
    You are an AI English Education Expert. Analyze the following textbook text and find/generate 3 sentences that match the grammar rule: "{rule['grammar']} ({rule['desc']})".
    Target Level: Korean Middle School Grade 3 (EBS standards).
    
    Difficulty criteria:
    - Low (하): 5-6 words.
    - Mid (중): 5-7 words, often 5-form verbs or standard patterns.
    - High (상): 8+ words, complex structures.
    
    Output JSON format only:
    [
      {{
        "level": "하/중/상",
        "en": "English sentence",
        "ko": "Korean translation",
        "analysis": {{
          "structure": "Step-by-step breakdown (e.g. S + V + O)",
          "point": "Grammar core point explanation"
        }},
        "hints": ["Hint 1", "Hint 2", "Hint 3"],
        "tokens": ["Word1", "Word2", ...],
        "blank_word": "target grammar word for blank test"
      }}
    ]
    
    Textbook Content Sample:
    {raw_text[:2000]}
    """
    try:
        response = model.generate_content(prompt)
        # Parse JSON from response
        clean_json = re.sub(r'```json|```', '', response.text).strip()
        return json.loads(clean_json)
    except Exception as e:
        print(f"Gemini Error for rule {rule['id']}: {e}")
        return []

def run_pipeline():
    all_text = ""
    for path in TEXTBOOK_FILES:
        if os.path.exists(path):
            all_text += extract_text_from_pdf(path)
    
    final_data = {}
    for rule in CURRICULUM_RULES:
        print(f"Processing Unit {rule['id']}...")
        sentences = process_with_gemini(all_text, rule)
        final_data[rule['id']] = sentences
    
    # Save as JS
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(f"const CURRICULUM_DATA = {json.dumps(final_data, ensure_ascii=False, indent=2)};")
    print(f"Success! Data saved to {OUTPUT_JS}")

if __name__ == "__main__":
    run_pipeline()
