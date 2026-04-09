import csv
import re
import os

csv_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.csv'

def analyze_grammar(text):
    text_lower = text.lower()
    names = []
    structures = []
    
    # Heuristics for Middle School Grammar (Korean textbook standards)
    rules = [
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
        (r'\b(better|worse|more|less|[a-z]+er)\b', '비교급', 'Comparative'),
        (r'\b(best|worst|most|least|[a-z]+est)\b', '최상급', 'Superlative'),
        (r'\b(make|have|let)\s+[a-z]+\s+[a-z]+\b', '사역동사', 'make/have/let + O + V'),
        (r'\b(see|hear|watch|feel)\s+[a-z]+\s+[a-z]+(ing)?\b', '지각동사', 'see/hear + O + V(ing)'),
    ]
    
    for pattern, name, structure in rules:
        if re.search(pattern, text, re.IGNORECASE):
            names.append(name)
            structures.append(structure)
            
    if not names:
        return '일반 문장', '-'
    
    # deduplicate but keep order
    names = list(dict.fromkeys(names))
    structures = list(dict.fromkeys(structures))
    
    # limit to max 2 key grammars to keep it short
    target_names = names[:2]
    target_structures = structures[:2]
    
    return ' / '.join(target_names), ' / '.join(target_structures)

def main():
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_data = list(csv.DictReader(f))
        fieldnames = csv_data[0].keys() if csv_data else []

    updated_count = 0
    for row in csv_data:
        # We only update rows that currently have the generic '추가 학습 지문'
        if row.get('grammar_name') == '추가 학습 지문' or row.get('grammar_name') == '':
            english = row['english']
            g_name, g_struct = analyze_grammar(english)
            
            row['grammar_name'] = g_name
            row['structure'] = g_struct
            updated_count += 1
            
    print(f"Updated {updated_count} rows with heuristic grammar tags.")

    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(csv_data)

if __name__ == '__main__':
    main()
