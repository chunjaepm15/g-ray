import csv
import json
import os

csv_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.csv'
json_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson02\Lesson02_organized.json'

def main():
    # Load CSV grammar mapping
    grammar_map = {}
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_data = list(csv.DictReader(f))
        for row in csv_data:
            grammar_map[row['id']] = row['grammar_name']

    # Update JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        jdata = json.load(f)
        
    updated_count = 0
    for section in jdata.get('sections', []):
        for item in section.get('items', []):
            item_id = item.get('id')
            if item_id in grammar_map:
                if item.get('grammar') != grammar_map[item_id]:
                    item['grammar'] = grammar_map[item_id]
                    updated_count += 1
                    
    print(f"Updated {updated_count} items in JSON with new grammar tags.")
    
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(jdata, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
