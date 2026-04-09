import csv
import re
import os
import json

txt_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02.txt'
csv_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.csv'
json_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.json'

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def split_text(text):
    parts = re.split(r'(?<=[.!?])\s+', str(text).strip())
    return [p.strip() for p in parts if p.strip()]

def run():
    # 1. Load existing CSV sentences
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_data = list(csv.reader(f))
    
    headers = csv_data[0]
    existing_clean = [clean_text(row[2]) for row in csv_data[1:] if len(row) > 2]
    
    # Get last ID
    last_id = csv_data[-1][0] if len(csv_data) > 1 else 'L02-00'
    try:
        next_id_num = int(last_id.split('-')[1]) + 1
    except:
        next_id_num = 1
        
    # 2. Extract valid english sentences from TXT
    missing_sentences = []
    
    with open(txt_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove newlines that break sentences arbitrarily in the PDF dump
    # Replace single newlines with space, but keep double newlines (paragraphs)
    paragraphs = re.split(r'\n\s*\n', content)
    
    new_rows = []
    
    for para in paragraphs:
        # replace internal newlines with space
        para = para.replace('\n', ' ')
        # split by sentence endings
        sentences = split_text(para)
        
        for s in sentences:
            s_clean = clean_text(s)
            if not s_clean: continue
            if len(s_clean) < 15: continue # Too short, likely garbage
            if re.search(r'[가-힣]', s): continue # Skip instructional korean text
            if s.startswith(('+', '•', '-', '[Page', 'Q1', 'Q2', 'Q3', 'Q4', 'Step')): continue # Garbage lists
            if 'Lesson ' in s and 'Animals' in s: continue # Page headers
            
            # Check overlap
            found = False
            for exist in existing_clean:
                if s_clean in exist or exist in s_clean:
                    found = True
                    break
            
            if not found:
                # Add to new rows
                # id,category,english,korean,grammar_id,grammar_name,structure,difficulty,page
                new_row = [
                    f'L02-{next_id_num:02d}',
                    'Extra/Reading_for_Fun',
                    s,
                    '[원문단락 추출 - 해석필요]',  # Need manual translation
                    '',
                    '',
                    '',
                    '중',
                    ''
                ]
                new_rows.append(new_row)
                existing_clean.append(s_clean) # prevent duplicates being added
                next_id_num += 1

    # Append to CSV
    if new_rows:
        with open(csv_file, 'a', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
            for r in new_rows:
                writer.writerow(r)
        print(f"Added {len(new_rows)} extra missing sentences to CSV!")
        
        # Append to JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            jdata = json.load(f)
            
        json_items = []
        for r in new_rows:
            json_items.append({
                "id": r[0],
                "english": r[2],
                "korean": r[3],
                "grammar": ""
            })
            
        jdata.setdefault('sections', []).append({
            "section_name": "Extra Contents (Filled from Text)",
            "items": json_items
        })
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(jdata, f, ensure_ascii=False, indent=2)
            
        print(f"Added new Extra Contents section with {len(new_rows)} items to JSON!")
    else:
        print("No valid new missing sentences found to add.")

if __name__ == '__main__':
    run()
