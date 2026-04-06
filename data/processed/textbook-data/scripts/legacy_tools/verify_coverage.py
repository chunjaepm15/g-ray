import csv
import re
import os

txt_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02.txt'
csv_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.csv'

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

with open(csv_file, 'r', encoding='utf-8') as f:
    csv_data = list(csv.DictReader(f))

csv_sentences_clean = [clean_text(row['english']) for row in csv_data if row.get('english')]

missing_lines = []

with open(txt_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    # Basic filter: only lines that look like English sentences (at least 5 words and finish with punctuation)
    # But text might be split across lines, so just checking lines >= 20 chars
    if len(line) < 30: continue
    # Ignore lines that are mostly korean
    if re.search(r'[가-힣]', line): continue
    
    c_line = clean_text(line)
    if not c_line: continue
    
    # Check if this line is a substring of any CSV sentence, or any CSV sentence is a substring of this line
    found = False
    for cs in csv_sentences_clean:
        if c_line in cs or cs in c_line:
            found = True
            break
            
    if not found:
        missing_lines.append(line)

print(f"Total potential missing english lines: {len(missing_lines)}")
print("--- Sample of missing lines ---")
for m in missing_lines[:20]:
    print(m)
