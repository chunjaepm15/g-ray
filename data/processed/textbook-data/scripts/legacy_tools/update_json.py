import json
import csv

csv_path = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson01\Lesson01_organized.csv'
json_path = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson01\Lesson01_organized.json'

def update_json():
    # Load JSON
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Gather existing IDs in JSON to avoid duplicates if run multiple times
    existing_ids = set()
    for sec in data.get('sections', []):
        for item in sec.get('items', []):
            existing_ids.add(item.get('id'))

    new_items = []
    
    # Load CSV
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['id'] not in existing_ids:
                new_items.append({
                    "id": row['id'],
                    "english": row['english'],
                    "korean": row['korean'],
                    "grammar": row['grammar_name']
                })

    if new_items:
        # Create a new section for these paragraph splits or append to the last one
        data['sections'].append({
            "section_name": "Paragraph Split Expressions",
            "items": new_items
        })
        
        # Save back to JSON
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Added {len(new_items)} new items to JSON.")
    else:
        print("No new items to add to JSON.")

if __name__ == '__main__':
    update_json()
