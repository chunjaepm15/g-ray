import csv
import re
import os
import json
import time
from deep_translator import GoogleTranslator

txt_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02.txt'
csv_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.csv'

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9]', '', str(text)).lower()

def build_page_map():
    with open(txt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    page_map = {}
    current_page = ""
    for line in lines:
        line = line.strip()
        
        match = re.search(r'\[Page\s+(\d+)\]', line)
        if match:
            current_page = match.group(1)
            continue
            
        c_text = clean_text(line)
        if len(c_text) > 10 and current_page:
            page_map[c_text] = current_page
            
    return page_map

def main():
    page_map = build_page_map()
    translator = GoogleTranslator(source='en', target='ko')
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_data = list(csv.DictReader(f))
        fieldnames = csv_data[0].keys() if len(csv_data) > 0 else []

    to_process = []
    
    for row in csv_data:
        korean_val = row.get('korean', '')
        if '해석필요' in korean_val or not korean_val.strip() or row.get('korean') == row.get('english'):
            en_clean = clean_text(row['english'])
            
            found_page = ""
            for k, p in page_map.items():
                if en_clean in k or k in en_clean:
                    found_page = p
                    break
            row['page'] = found_page
            to_process.append(row)
            
    print(f"Found {len(to_process)} rows to process. RAG Page matching completed.")
    
    for i, row in enumerate(to_process):
        english = row['english']
        try:
            korean_trans = translator.translate(english)
        except Exception as e:
            korean_trans = english
            print(f"Translation failed for: {english}")
            
        row['korean'] = korean_trans
        row['grammar_id'] = 'G0299'
        row['grammar_name'] = '추가 학습 지문'
        row['structure'] = '-'
        
        if i % 10 == 0:
            print(f"Translated {i}/{len(to_process)}")
            time.sleep(1) # tiny throttle for free api

    with open(csv_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(csv_data)
        
    print("CSV Update Complete!")

if __name__ == '__main__':
    main()
