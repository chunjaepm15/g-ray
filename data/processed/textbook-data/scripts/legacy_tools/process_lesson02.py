import csv
import re
import os
import json

base_dir = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02'
para_file = os.path.join(base_dir, 'Lesson02_paragraphs.csv')
org_file = os.path.join(base_dir, 'Lesson02_organized.csv')
json_file = os.path.join(base_dir, 'Lesson02_organized.json')

def split_text(text):
    parts = re.split(r'(?<=[.!?])\s+', str(text).strip())
    return [p.strip() for p in parts if p.strip()]

def process_csv():
    if not os.path.exists(para_file):
        print(f"Skipping {para_file} - doesn't exist.")
        return

    with open(org_file, 'r', encoding='utf-8') as f:
        reader = list(csv.reader(f))
    
    last_id = reader[-1][0] if len(reader) > 1 else 'L02-00'
    try:
        next_id_num = int(last_id.split('-')[1]) + 1
    except:
        next_id_num = 1
        
    new_rows = []
    
    with open(para_file, 'r', encoding='utf-8') as f:
        p_reader = csv.DictReader(f)
        for row in p_reader:
            en_text = row.get('english', '')
            ko_text = row.get('korean', '')
            en_sentences = split_text(en_text)
            ko_sentences = split_text(ko_text)
            
            if len(en_sentences) == len(ko_sentences) and len(en_sentences) > 0:
                for en, ko in zip(en_sentences, ko_sentences):
                    new_row = [
                        f'L02-{next_id_num:02d}',
                        row.get('category', 'Reading'),
                        en,
                        ko,
                        row.get('grammar_id', ''),
                        row.get('grammar_name', ''),
                        row.get('structure', ''),
                        row.get('difficulty', ''),
                        row.get('page', '')
                    ]
                    new_rows.append(new_row)
                    next_id_num += 1
            else:
                if en_text:
                    new_row = [
                        f'L02-{next_id_num:02d}',
                        row.get('category', 'Reading'),
                        en_text,
                        ko_text,
                        row.get('grammar_id', ''),
                        row.get('grammar_name', ''),
                        row.get('structure', ''),
                        row.get('difficulty', ''),
                        row.get('page', '')
                    ]
                    new_rows.append(new_row)
                    next_id_num += 1

    if new_rows:
        with open(org_file, 'a', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
            for r in new_rows:
                writer.writerow(r)
        print(f"Successfully added {len(new_rows)} new split sentences to Lesson02 CSV!")
    else:
        print("No new split sentences added to CSV.")

def process_json():
    if not os.path.exists(json_file):
        print(f"Skipping JSON update - {json_file} doesn't exist.")
        return

    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    existing_ids = set()
    for sec in data.get('sections', []):
        for item in sec.get('items', []):
            existing_ids.add(item.get('id'))

    new_items = []
    
    with open(org_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Need to fallback for keys since CSV headers might vary slightly
            en = row.get('english') or row.get('en_text') or row.get('sentence')
            ko = row.get('korean') or row.get('ko_text') or row.get('translation')
            g_name = row.get('grammar_name') or row.get('grammar')
            
            if row['id'] not in existing_ids and en:
                new_items.append({
                    "id": row['id'],
                    "english": en,
                    "korean": ko or '',
                    "grammar": g_name or ''
                })

    if new_items:
        # Check if 'Paragraph Split Expressions' section already exists
        target_section = None
        for sec in data.get('sections', []):
            if sec.get('section_name') == "Paragraph Split Expressions":
                target_section = sec
                break
                
        if target_section:
            target_section['items'].extend(new_items)
        else:
            data.setdefault('sections', []).append({
                "section_name": "Paragraph Split Expressions",
                "items": new_items
            })
        
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Added {len(new_items)} new items to Lesson02 JSON.")
    else:
        print("No new items to add to Lesson02 JSON.")

if __name__ == '__main__':
    process_csv()
    process_json()
