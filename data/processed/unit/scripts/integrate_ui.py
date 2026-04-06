import os
import json

HTML_FILE = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v7.html"
JSON_FILE = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles\dynamic_curriculum_v1.json"
OUTPUT_HTML = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v8.html"

def main():
    # Load the JSON
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)
        
    # Trim to 3 sentences per unit for frontend performance
    for u in curriculum['units']:
        u['sentences'] = u['sentences'][:3]
        
    json_str = json.dumps(curriculum, ensure_ascii=False, indent=2)
    
    # Read HTML
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Find the injection point
    # We will replace the const units = [...] declaration.
    # Finding the block
    start_str = "            const units = ["
    end_str = "            ];\n"
    start_idx = html.find(start_str)
    end_idx = html.find(end_str, start_idx) + len(end_str)
    
    if start_idx == -1 or end_idx == -1:
        print("Could not find units array in HTML")
        return
        
    # The new JS code
    new_js = f"""            const CURRICULUM = {json_str};
            // Dynamic unit mapping
            const units = CURRICULUM.units.map((u, i) => ({{
                id: u.unit_id,
                unit: `Unit ${{i+1}}`,
                title: u.title,
                tags: u.origin_tags,
                sentences: u.sentences
            }}));
            """
            
    html = html[:start_idx] + new_js + html[end_idx:]
    
    # We also need to update ANALYSIS and ACTIVITY to use `selectedUnit.sentences[0]` instead of hardcoded `words`
    # Replace the words logic
    words_var = '            const words = ["What", "he", "said", "at", "the", "meeting", "was", "very", "important."];'
    words_repl = """            const currentSentence = selectedUnit ? selectedUnit.sentences[0] : null;
            const words = currentSentence ? currentSentence.english.split(' ') : [];"""
    html = html.replace(words_var, words_repl)
    
    translations_var = '            const translations = {'
    translations_repl = """            const generateStructure = (sentence, grammar) => {
                if (!sentence) return { eng: "", kor: "", target: "", targetEnd: 1, ceng: "", v: "", obj: "" };
                const w = sentence.english.split(' ');
                res = { eng: sentence.english, kor: sentence.korean, target: w.slice(0, 3).join(' '), targetEnd: 2, ceng: w.slice(3, 5).join(' '), v: w.length>5 ? w[5] : '', obj: w.slice(6).join(' ') };
                return res;
            };
            const structData = generateStructure(currentSentence, selectedUnit ? selectedUnit.title : "");
            
            const transMapping = {0: {}};
            if (structData && structData.targetEnd) {
                 transMapping[0][structData.targetEnd] = structData.kor;
            }
            const getTranslation = (s, e) => {
                if (s === null) return "드래그를 통해 문장 덩어리(구문)를 선택해주세요.";
                return `해석: "${currentSentence.korean}"`;
            };
            """
            
    start_trans_idx = html.find("            const translations")
    end_trans_idx = html.find("            const handleWordAction", start_trans_idx)
    html = html[:start_trans_idx] + translations_repl + html[end_trans_idx:]
    
    # Fix the answerRange logic
    ans_idx = html.find("const answerRange =")
    ans_end = html.find(";", ans_idx) + 1
    html = html[:ans_idx] + "const answerRange = { start: 0, end: structData.targetEnd };\n" + html[ans_end:]
    
    # Fix UI in ANALYSIS to read currentSentence instead of fixed string
    an_eng = '"What he said at the meeting was very important."'
    an_kor = '그가 회의에서 말한 것은 매우 중요했다.'
    html = html.replace(an_eng, '{currentSentence ? currentSentence.english : ""}')
    html = html.replace(an_kor, '{currentSentence ? currentSentence.korean : ""}')
    
    # Fix the SVG text dynamically
    html = html.replace('What he said at the meeting', '{structData.target}')
    html = html.replace('>was<', '>{structData.v}<')
    html = html.replace('very important.', '{structData.obj}')
    
    # Fix Q1, Q2, Q3 based on sentence to allow them to function
    qidx = html.find('안토니오는 무역을 통해')
    qend = html.find('</div>', qidx)
    html = html[:qidx] + "{currentSentence ? currentSentence.korean : ''}" + html[qend:]
    
    q2idx = html.find('나는 음악을 들을 때 행복해.')
    q2end = html.find('</div>', q2idx)
    html = html[:q2idx] + "{currentSentence ? currentSentence.korean : ''}" + html[q2end:]
    
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print("UI integrated into v8.html successfully!")

if __name__ == "__main__":
    main()
