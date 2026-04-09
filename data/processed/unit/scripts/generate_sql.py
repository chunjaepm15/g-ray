import csv
import glob
import os

def generate_sql():
    sql_header = """-- [SQL] 중학 영어 3 교과서 통합 데이터 (이재영 & 정사열) 전체 데이터 시딩
-- 이 파일은 분석된 모든 교과서 데이터를 포함합니다.

-- 1. 교과서 마스터 데이터 (Books)
INSERT INTO books (book_id, author, title, curriculum) VALUES
(1, '이재영', '중학 영어 3 (이재영)', '2015 개정'),
(2, '정사열', '중학 영어 3 (정사열)', '2015 개정')
ON CONFLICT (book_id) DO NOTHING;

-- 2. 단원 정보 데이터 (Units)
-- [이재영 저자 전체 단원 (1~8)]
INSERT INTO units (unit_id, book_id, lesson_num, title, topic, grammar_focus, page_start, page_end) VALUES
(11, 1, 1, 'What Matters to You?', '가치와 우선순위', '현재완료, 사역동사', 10, 29),
(12, 1, 2, 'Animals, Big and Small', '개미의 세계', '분사구문, 관계대명사 what', 30, 51),
(13, 1, 3, 'Be Positive, Be Happy', '스트레스 관리', '가정법 과거, 소유격 관계대명사', 52, 71),
(14, 1, 4, 'Opening a Window to the World', '세계의 시장', 'the+비교급, It~that 강조', 72, 93),
(15, 1, 5, 'Are You into Books?', '시인 윤동주', '과거완료, 사역동사', 94, 111),
(16, 1, 6, 'Together in Our Community', '공유지의 비극', '접속사 if/whether, 간접화법', 112, 133),
(17, 1, 7, 'Watch Out', '화산과 안전', '부정대명사, 명령문+and', 134, 151),
(18, 1, 8, 'All Your Dreams Are Worth Chasing', '꿈과 도전', 'should have p.p., worth ~ing', 152, 178)
ON CONFLICT (unit_id) DO NOTHING;

-- [정사열 저자 전체 단원 (1~8)]
INSERT INTO units (unit_id, book_id, lesson_num, title, topic, grammar_focus, page_start, page_end) VALUES
(21, 2, 1, 'Express Your Feelings', '감정 표현하기', '수동태, 관계대명사 계속적 용법', 10, 29),
(22, 2, 2, 'Let''s Make Our Town Better', '마을 개선', '과거완료, 사역동사(make), 비교급 강조', 30, 51),
(23, 2, 3, 'Laugh First and Then Think', '웃음의 의미', '상관접속사(Not only A but also B), enough to', 52, 71),
(24, 2, 4, 'Dreaming of My Future', '나의 미래 꿈', '분사구문, 관계대명사 what', 72, 91),
(25, 2, 5, 'Pictures Speak a Thousand Words', '사진과 이미지', '가정법 과거, 소유격 관계대명사(whose)', 92, 111),
(26, 2, 6, 'We Are All Makers', '제작자와 창의성', 'the+비교급, It~that 강조구문', 112, 131),
(27, 2, 7, 'Fact, Opinion, or Fake', '사실과 의견', '명사절 접속사(if/whether), 간접 화법', 132, 151),
(28, 2, 8, 'Make Peace with Others', '타인과의 화해', '부정대명사(Some/Others), order/tell+O+to V', 152, 171)
ON CONFLICT (unit_id) DO NOTHING;

-- 3. 문장 데이터 (Sentences)
"""
    sql_body = ""
    
    # Process Jung Sayeol CSVs
    jung_path = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\정사열'
    for lesson_num in range(1, 9):
        file_path = os.path.join(jung_path, f'Lesson{lesson_num:02d}', f'Lesson{lesson_num:02d}_organized.csv')
        if not os.path.exists(file_path):
            file_path = os.path.join(jung_path, f'Lesson{lesson_num:02d}_organized.csv') # fallback
        if os.path.exists(file_path):
            with open(file_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if not row.get('english'): continue
                    unit_id = 20 + lesson_num
                    en = row['english'].replace("'", "''")
                    ko = row.get('korean', '').replace("'", "''")
                    section = row.get('category', 'General')
                    grammar = row.get('grammar_name', '').replace("'", "''")
                    page = row.get('page', '0')
                    sql_body += f"INSERT INTO sentences (unit_id, section, en_text, ko_text, grammar_tag, page_num) VALUES ({unit_id}, '{section}', '{en}', '{ko}', '{grammar}', {page});\n"

    # Process Lee Jaeyoung CSVs
    lee_path = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\이재영\data'
    for lesson_num in range(1, 9):
        file_path = os.path.join(lee_path, f'Lesson{lesson_num:02d}', f'Lesson{lesson_num:02d}_organized.csv')
        if not os.path.exists(file_path):
            file_path = os.path.join(lee_path, f'Lesson{lesson_num:02d}_organized.csv') # fallback
        if os.path.exists(file_path):
            with open(file_path, newline='', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # check headers as they might differ
                    en = row.get('english') or row.get('en_text') or row.get('sentence')
                    if not en: continue
                    unit_id = 10 + lesson_num
                    en = en.replace("'", "''")
                    ko = (row.get('korean') or row.get('ko_text') or row.get('translation') or '').replace("'", "''")
                    section = row.get('category') or row.get('section') or 'General'
                    grammar = (row.get('grammar_name') or row.get('grammar') or '').replace("'", "''")
                    page = row.get('page') or row.get('page_num') or '0'
                    sql_body += f"INSERT INTO sentences (unit_id, section, en_text, ko_text, grammar_tag, page_num) VALUES ({unit_id}, '{section}', '{en}', '{ko}', '{grammar}', {page});\n"

    output_path = r'i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\db\textbook_seed_data.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql_header + sql_body)
    print(f"Generated SQL with {sql_body.count('INSERT')} sentences.")

if __name__ == "__main__":
    generate_sql()
