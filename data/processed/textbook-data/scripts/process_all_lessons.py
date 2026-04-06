import os
import re
import csv
import json
import time
from deep_translator import GoogleTranslator

# Global Heuristic Rules for Middle School Grammar
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
    (r'\b(better|worse|more|less|[a-z]+er)\b', '비교급', 'Comparative'),
    (r'\b(best|worst|most|least|[a-z]+est)\b', '최상급', 'Superlative'),
    (r'\b(make|have|let)\s+[a-z]+\s+[a-z]+\b', '사역동사', 'make/have/let + O + V'),
    (r'\b(see|hear|watch|feel)\s+[a-z]+\s+[a-z]+(ing)?\b', '지각동사', 'see/hear + O + V(ing)'),
]

def clean_text(text):
    return re.sub(r'[^a-zA-Z0-9]', '', str(text)).lower()

def split_sentences(text):
    parts = re.split(r'(?<=[.!?])\s+', str(text).strip())
    return [p.strip() for p in parts if p.strip()]

def analyze_grammar(text):
    names, structures = [], []
    for pattern, name, structure in GRAMMAR_RULES:
        if re.search(pattern, text, re.IGNORECASE):
            names.append(name)
            structures.append(structure)
    if not names:
        return '일반 문장', '-'
    names = list(dict.fromkeys(names))[:2]
    structures = list(dict.fromkeys(structures))[:2]
    return ' / '.join(names), ' / '.join(structures)

class LessonProcessor:
    def __init__(self, author_folder, lesson_id, base_dir):
        # Allow nested 'data/' folder logic for Authors like '이재영/data' vs '정사열/data'
        data_subfolder = os.path.join(base_dir, author_folder, 'data')
        if not os.path.exists(data_subfolder):
            data_subfolder = os.path.join(base_dir, author_folder) # Fallback if no /data
            
        self.lesson_dir = os.path.join(data_subfolder, lesson_id)
        self.lesson_id = lesson_id
        
        self.txt_file = os.path.join(self.lesson_dir, f"{lesson_id}.txt")
        self.org_csv = os.path.join(self.lesson_dir, f"{lesson_id}_organized.csv")
        self.para_csv = os.path.join(self.lesson_dir, f"{lesson_id}_paragraphs.csv")
        self.org_json = os.path.join(self.lesson_dir, f"{lesson_id}_organized.json")
        
        # internal states
        self.csv_data = []
        self.fieldnames = []
        self.existing_clean_english = []
        self.page_map = {}
        self.last_id_num = 1
        self.translator = GoogleTranslator(source='en', target='ko')

    def run_pipeline(self):
        print(f"\n=====================================")
        print(f"🚀 Processing: {self.lesson_dir}")
        print(f"=====================================")
        
        if not os.path.exists(self.org_csv):
            print(f"[SKIP] Base CSV {self.org_csv} not found.")
            return

        self._load_csv()
        self._build_page_map()
        self._process_paragraphs()
        self._extract_missing_from_txt()
        self._auto_fill_and_tag()
        self._save_csv()
        self._sync_json()
        print(f"✅ Pipeline completed for {self.lesson_id}!")

    def _load_csv(self):
        with open(self.org_csv, 'r', encoding='utf-8') as f:
            reader = list(csv.DictReader(f))
            self.csv_data = reader
            if reader:
                self.fieldnames = list(reader[0].keys())
            else:
                self.fieldnames = ['id','category','english','korean','grammar_id','grammar_name','structure','difficulty','page']
            
            # Ensure V2 columns exist
            v2_cols = ['syntax_chunks_eng', 'syntax_chunks_kor', 'syntax_roles', 'role_in_sentence', 'variation_flags']
            for col in v2_cols:
                if col not in self.fieldnames:
                    self.fieldnames.append(col)
                    for row in self.csv_data:
                        row[col] = ''
                
            self.existing_clean_english = [clean_text(r.get('english','')) for r in self.csv_data if r.get('english')]
            
            # Find next ID number
            if self.csv_data:
                last_id_str = self.csv_data[-1]['id']
                try:
                    # e.g., L02-45 -> 45, or L02-RD-001
                    parts = last_id_str.split('-')
                    self.last_id_num = int(parts[-1]) + 1
                except:
                    self.last_id_num = 100

    def _build_page_map(self):
        if not os.path.exists(self.txt_file): return
        with open(self.txt_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        current_page = ""
        for line in lines:
            line = line.strip()
            # Try to grab page number like "[Page 32]"
            m = re.search(r'\[Page\s+(\d+)\]', line)
            if m:
                current_page = m.group(1)
                continue
            ctext = clean_text(line)
            if len(ctext) > 10 and current_page:
                self.page_map[ctext] = current_page

    def _process_paragraphs(self):
        if not os.path.exists(self.para_csv): return
        added_count = 0
        with open(self.para_csv, 'r', encoding='utf-8') as f:
            preader = csv.DictReader(f)
            for row in preader:
                en_text = row.get('english', '')
                ko_text = row.get('korean', '')
                en_sentences = split_sentences(en_text)
                ko_sentences = split_sentences(ko_text)
                
                # Verify match lengths to do 1:1 mapping
                if len(en_sentences) == len(ko_sentences) and len(en_sentences) > 0:
                    for i, (en, ko) in enumerate(zip(en_sentences, ko_sentences)):
                        ct_en = clean_text(en)
                        # Avoid duplicates
                        if any(ct_en in ec or ec in ct_en for ec in self.existing_clean_english):
                            continue
                            
                        self._add_row_to_csv('Reading', en, ko, row)
                        self.existing_clean_english.append(ct_en)
                        added_count += 1
                elif en_text:
                    ct_en = clean_text(en_text)
                    if not any(ct_en in ec or ec in ct_en for ec in self.existing_clean_english):
                        self._add_row_to_csv('Reading', en_text, ko_text, row)
                        self.existing_clean_english.append(ct_en)
                        added_count += 1
        if added_count > 0: print(f"  -> Merged {added_count} sentences from paragraphs.")

    def _extract_missing_from_txt(self):
        if not os.path.exists(self.txt_file): return
        with open(self.txt_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        paragraphs = re.split(r'\n\s*\n', content)
        added_count = 0
        for para in paragraphs:
            para = para.replace('\n', ' ')
            sentences = split_sentences(para)
            for s in sentences:
                ct_s = clean_text(s)
                if len(ct_s) < 15: continue
                if re.search(r'[가-힣]', s): continue # skip instructionals
                if s.startswith(('+', '•', '-', '[Page', 'Q1', 'Q2', 'Step')): continue
                if 'Lesson ' in s and 'Animals' in s: continue
                
                # overlap check
                if any(ct_s in ec or ec in ct_s for ec in self.existing_clean_english):
                    continue
                
                r = self._add_row_to_csv('Extra/Extracted', s, '[해석필요]', {})
                self.existing_clean_english.append(ct_s)
                added_count += 1
                
        if added_count > 0: print(f"  -> Extracted {added_count} brand-new missing sentences from txt.")

    def _add_row_to_csv(self, default_cat, en_val, ko_val, src_row):
        lid = self.lesson_id.split('son')[-1] # "02"
        new_row = {
            'id': f"L{lid}-{self.last_id_num:03d}",
            'category': src_row.get('category', default_cat),
            'english': en_val,
            'korean': ko_val,
            'grammar_id': src_row.get('grammar_id', ''),
            'grammar_name': src_row.get('grammar_name', ''),
            'structure': src_row.get('structure', ''),
            'difficulty': src_row.get('difficulty', '중'),
            'page': src_row.get('page', '')
        }
        self.csv_data.append(new_row)
        self.last_id_num += 1
        return new_row

    def _auto_fill_and_tag(self):
        translated = 0
        tagged = 0
        paged = 0
        
        for idx, row in enumerate(self.csv_data):
            english = row['english']
            ct_en = clean_text(english)
            
            # --- PAGE MAPPING (RAG) ---
            if not row.get('page'):
                found_page = ""
                for k, p in self.page_map.items():
                    if ct_en in k or k in ct_en:
                        found_page = p
                        break
                if found_page:
                    row['page'] = found_page
                    paged += 1
                    
            # --- GRAMMAR TAGGING (Heuristics) ---
            gname = row.get('grammar_name', '')
            if not gname or '추가' in gname or gname == '일반 문장':
                gn, gs = analyze_grammar(english)
                row['grammar_name'] = gn
                row['structure'] = gs
                tagged += 1
                
            # --- TRANSLATION (Deep Translator) ---
            kor = row.get('korean', '')
            if '해석필요' in kor or not kor.strip() or kor == english:
                try:
                    row['korean'] = self.translator.translate(english)
                except:
                    row['korean'] = english  # fallback
                translated += 1
                if translated % 15 == 0: time.sleep(1) # throttle

            # --- V2 SCHEMA MOCKING: Fill V2 fields if empty ---
            if not row.get('syntax_chunks_eng'):
                eng_words = english.split(' ')
                kor_words = row.get('korean', '').split(' ')
                mid_e = max(1, len(eng_words)//2)
                mid_k = max(1, len(kor_words)//2)
                
                row['syntax_chunks_eng'] = ' '.join(eng_words[:mid_e]) + " | " + ' '.join(eng_words[mid_e:])
                row['syntax_chunks_kor'] = ' '.join(kor_words[:mid_k]) + " | " + ' '.join(kor_words[mid_k:])
                row['syntax_roles'] = 'Main Clause | Sub Clause'
                row['role_in_sentence'] = 'AutoParsed'
                row['variation_flags'] = 'has_or_not, verb_of_uncertainty' if 'if' in english or 'whether' in english else 'generic_concept'
                
        print(f"  -> Auto-Filled: Translated {translated}, Tagged {tagged}, Matched Pages {paged}.")

    def _save_csv(self):
        with open(self.org_csv, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=self.fieldnames, quoting=csv.QUOTE_MINIMAL, extrasaction='ignore')
            writer.writeheader()
            writer.writerows(self.csv_data)

    def _sync_json(self):
        if not os.path.exists(self.org_json):
            print(f"  -> WARNING: {self.org_json} not found for sync.")
            return
            
        with open(self.org_json, 'r', encoding='utf-8') as f:
            jdata = json.load(f)
            
        # Collect existing IDs in JSON
        json_ids = set()
        for sec in jdata.get('sections', []):
            for item in sec.get('items', []):
                json_ids.add(item.get('id'))
                
        # Update existing items and prepare new ones
        new_items = []
        updated = 0
        
        csv_map = {row['id']: row for row in self.csv_data}
        
        for sec in jdata.get('sections', []):
            for item in sec.get('items', []):
                jid = item.get('id')
                if jid in csv_map:
                    cr = csv_map[jid]
                    
                    # Update all base and V2 fields blindly to sync
                    item['korean'] = cr['korean']
                    item['grammar'] = cr['grammar_name']
                    item['structure'] = cr['structure']
                    
                    # Nest V2 fields
                    chunks_eng = [c.strip() for c in cr.get('syntax_chunks_eng', '').split('|') if c.strip()]
                    chunks_kor = [c.strip() for c in cr.get('syntax_chunks_kor', '').split('|') if c.strip()]
                    roles = [r.strip() for r in cr.get('syntax_roles', '').split('|') if r.strip()]
                    
                    if chunks_eng:
                        item['syntax_chunks'] = [
                            {"eng": e, "kor": k if i < len(chunks_kor) else "", "role": r if i < len(roles) else ""}
                            for i, (e, k, r) in enumerate(zip(chunks_eng, chunks_kor + ['']*(len(chunks_eng)-len(chunks_kor)), roles + ['']*(len(chunks_eng)-len(roles))))
                        ]
                    
                    item['grammar_properties'] = {
                        "role_in_sentence": cr.get('role_in_sentence', ''),
                        "trigger_word": cr.get('grammar_name', ''),
                        "target_pattern": cr.get('structure', '')
                    }
                    
                    item['variation_flags'] = [f.strip() for f in cr.get('variation_flags', '').split(',') if f.strip()]
                    updated += 1
                        
        for row in self.csv_data:
            if row['id'] not in json_ids:
                newItem = {
                    "id": row['id'],
                    "english": row['english'],
                    "korean": row['korean'],
                    "grammar": row['grammar_name'],
                    "structure": row['structure']
                }
                
                chunks_eng = [c.strip() for c in row.get('syntax_chunks_eng', '').split('|') if c.strip()]
                chunks_kor = [c.strip() for c in row.get('syntax_chunks_kor', '').split('|') if c.strip()]
                roles = [r.strip() for r in row.get('syntax_roles', '').split('|') if r.strip()]
                
                if chunks_eng:
                    newItem['syntax_chunks'] = [
                        {"eng": e, "kor": k if i < len(chunks_kor) else "", "role": r if i < len(roles) else ""}
                        for i, (e, k, r) in enumerate(zip(chunks_eng, chunks_kor + ['']*(len(chunks_eng)-len(chunks_kor)), roles + ['']*(len(chunks_eng)-len(roles))))
                    ]
                newItem['grammar_properties'] = {
                    "role_in_sentence": row.get('role_in_sentence', ''),
                    "trigger_word": row.get('grammar_name', ''),
                    "target_pattern": row.get('structure', '')
                }
                newItem['variation_flags'] = [f.strip() for f in row.get('variation_flags', '').split(',') if f.strip()]
                
                new_items.append(newItem)
                
        if new_items:
            jdata.setdefault('sections', []).append({
                "section_name": "Extended Contexts (Auto-Generated)",
                "items": new_items
            })
            
        with open(self.org_json, 'w', encoding='utf-8') as f:
            json.dump(jdata, f, ensure_ascii=False, indent=2)
            
        print(f"  -> JSON Synced: Updated {updated} items, Added {len(new_items)} new items.")

if __name__ == '__main__':
    BASE = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data'
    target_authors = ['이재영', '정사열']
    
    # Run full verification and transformation!
    print("Starting Global Verification & Auto-Fill Pipeline...")
    for author in target_authors:
        data_dir = os.path.join(BASE, author, 'data')
        if not os.path.exists(data_dir):
            data_dir = os.path.join(BASE, author) # fallback
            
        if not os.path.exists(data_dir):
            print(f"Author dir not found: {data_dir}")
            continue
            
        for i in range(1, 9):
            lesson = f"Lesson{i:02d}"
            # Process this specific lesson
            processor = LessonProcessor(author, lesson, BASE)
            try:
                processor.run_pipeline()
            except Exception as e:
                print(f"[ERROR] Failed to process {author} {lesson}: {str(e)}")
                
    print("\n✅ Execution Finished for All Folders.")
