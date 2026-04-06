import csv
import re
import os

para_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson01\Lesson01_paragraphs.csv'
org_file = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data\Lesson01\Lesson01_organized.csv'

def split_text(text):
    # Split by punctuation followed by space, keeping the punctuation
    parts = re.split(r'(?<=[.!?])\s+', text.strip())
    # remove any empty parts
    return [p.strip() for p in parts if p.strip()]

def main():
    # Read existing organized to find next ID
    with open(org_file, 'r', encoding='utf-8') as f:
        reader = list(csv.reader(f))
        
    last_id = reader[-1][0] # e.g. 'L01-24'
    try:
        next_id_num = int(last_id.split('-')[1]) + 1
    except:
        next_id_num = 25
        
    new_rows = []
    
    with open(para_file, 'r', encoding='utf-8') as f:
        p_reader = csv.DictReader(f)
        for row in p_reader:
            en_text = row['english']
            ko_text = row['korean']
            en_sentences = split_text(en_text)
            ko_sentences = split_text(ko_text)
            
            if len(en_sentences) == len(ko_sentences):
                # We can map them 1:1
                for en, ko in zip(en_sentences, ko_sentences):
                    # id,category,english,korean,grammar_id,grammar_name,structure,difficulty,page
                    new_row = [
                        f'L01-{next_id_num:02d}',
                        row['category'],
                        en,
                        ko,
                        row['grammar_id'],
                        row['grammar_name'],
                        row['structure'],
                        row['difficulty'],
                        row['page']
                    ]
                    new_rows.append(new_row)
                    next_id_num += 1
            else:
                print(f"Warning: ID {row['id']} has mismatch sentences. EN: {len(en_sentences)}, KO: {len(ko_sentences)}")
                # Merge manually
                # We will just append the whole thing as one row if it fails to split cleanly
                new_row = [
                    f'L01-{next_id_num:02d}',
                    row['category'],
                    en_text,
                    ko_text,
                    row['grammar_id'],
                    row['grammar_name'],
                    row['structure'],
                    row['difficulty'],
                    row['page']
                ]
                new_rows.append(new_row)
                next_id_num += 1

    # append to organized file
    with open(org_file, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        for r in new_rows:
            writer.writerow(r)
            
    print(f"Successfully added {len(new_rows)} new split sentences to Lesson01_organized.csv!")

if __name__ == '__main__':
    main()
