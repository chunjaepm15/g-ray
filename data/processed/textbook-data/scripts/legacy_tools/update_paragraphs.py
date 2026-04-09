import os
import re
import csv
import time
from deep_translator import GoogleTranslator

lesson_dir = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02'
txt_file = os.path.join(lesson_dir, 'Lesson02.txt')
para_csv = os.path.join(lesson_dir, 'Lesson02_paragraphs.csv')

GRAMMAR_RULES = [
    (r'\b(though|although|even though)\b', '양보의 접속사', 'Though + S + V'),
    (r'\b(since|because|as)\b', '이유의 접속사', 'Because/Since + S + V'),
    (r'\b(if|unless)\b', '조건의 접속사', 'If/Unless + S + V'),
    (r'\b(when|while|before|after|until|as soon as)\b', '시간의 접속사', 'When/While + S + V'),
    (r'\b(am|is|are|was|were)\s+[a-z]+(ed|en)\b', '수동태', 'be + p.p.'),
    (r'\b(have|has|had)\s+[a-z]+(ed|en)\b', '완료시제', 'have + p.p.'),
    (r'\bto\s+[a-z]+\b', 'to부정사', 'to + V'),
    (r'\b(which|who|whom|whose)\b', '관계대명사', 'Relative Pronoun'),
    (r'\bthat\b', '접속사/관계대명사 that', 'that + S + V / N + that'),
    (r'\b(what|how|why|where)\b', '의문사 구문', 'Wh-word'),
    (r'\b(can|could|will|would|should|must|may|might)\b', '조동사', 'Modal + V'),
    (r'\b[a-z]+ing\b', '현재분사/동명사', 'V-ing'),
]

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9]', '', str(text)).lower()

def analyze_grammar(text):
    names, structures = [], []
    for pattern, name, structure in GRAMMAR_RULES:
        if re.search(pattern, text, re.IGNORECASE):
            names.append(name)
            structures.append(structure)
    if not names: return '일반 문장', '-'
    names = list(dict.fromkeys(names))[:2]
    structures = list(dict.fromkeys(structures))[:2]
    return ' / '.join(names), ' / '.join(structures)

def main():
    # 1. Read existing paragraphs
    existing_en = []
    paragraphs_data = []
    fieldnames = ['id','category','english','korean','grammar_id','grammar_name','structure','difficulty','page']
    
    if os.path.exists(para_csv):
        with open(para_csv, 'r', encoding='utf-8') as f:
            reader = list(csv.DictReader(f))
            paragraphs_data = reader
            existing_en = [clean_text(r['english']) for r in reader]

    last_id = len(paragraphs_data) + 1

    # 2. Extract from TXT
    with open(txt_file, 'r', encoding='utf-8') as f:
        content = f.read()

    translator = GoogleTranslator(source='en', target='ko')
    raw_blocks = re.split(r'\n\s*\n', content)
    
    added = 0
    raw_blocks = re.split(r'\n\s*\n', content)
    
    for block in raw_blocks:
        # Strip metadata lines like [Page XX] or .indd
        clean_lines = []
        for line in block.split('\n'):
            if '[Page' in line or '.indd' in line or 'Lesson' in line:
                continue
            clean_lines.append(line)
        
        b = ' '.join(clean_lines).strip()
        sentences = re.split(r'(?<=[.!?])\s+', b)
        
        if len(sentences) >= 2 and len(b) > 40:
            # Recheck korean AFTER metadata stripped
            if re.search(r'[가-힣]', b): continue
            
            c_b = clean_text(b)
            if any(c_b in e or e in c_b for e in existing_en):
                continue
            
            gname, gstruct = analyze_grammar(b)
            try:
                kor = translator.translate(b)
            except:
                kor = b
                
            new_row = {
                'id': f"L02-P-{last_id:02d}",
                'category': 'Reading_Extracted',
                'english': b,
                'korean': kor,
                'grammar_id': 'G0299',
                'grammar_name': gname,
                'structure': gstruct,
                'difficulty': '중',
                'page': '' 
            }
            paragraphs_data.append(new_row)
            existing_en.append(c_b)
            last_id += 1
            added += 1
            time.sleep(1)

    print(f"Added {added} new paragraphs from TXT to CSV.")
    
    with open(para_csv, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(paragraphs_data)
        
if __name__ == '__main__':
    main()
