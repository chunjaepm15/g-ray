import os
import json
import re

V7_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v7.html"
JSON_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles\dynamic_curriculum_v1.json"
V9_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v9.html"

def main():
    with open(V7_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)

    # Trim sentences so the HTML isn't huge
    for u in curriculum['units']:
        u['sentences'] = u['sentences'][:3]

    curriculum_json = json.dumps(curriculum, ensure_ascii=False, indent=2)

    # 1. Add currentSentence state and dynamically setup words array
    words_def = r'const words = \["What", "he", "said", "at", "the", "meeting", "was", "very", "important."\];'
    new_words_def = """const currentSentence = selectedUnit && selectedUnit.sentences.length > 0 ? selectedUnit.sentences[0] : null;
            const words = currentSentence && currentSentence.english ? currentSentence.english.split(' ') : [];"""
    html = html.replace(words_def, new_words_def)

    # 2. Dynamic structure generation replacing fixed translations
    trans_def = r"const translations = \{.*?\};"
    new_trans_def = """const translations = {};
            const generateStructure = (sentence) => {
                if (!sentence || !sentence.english) return { eng: "", kor: "", target: "", targetEnd: 1, ceng: "", v: "", obj: "" };
                const w = sentence.english.split(' ');
                return { eng: sentence.english, kor: sentence.korean, target: w.slice(0, Math.floor(w.length/2)).join(' '), targetEnd: Math.floor(w.length/2) - 1, ceng: '', v: w.length>1 ? w[Math.floor(w.length/2)] : '', obj: w.slice(Math.floor(w.length/2)+1).join(' ') };
            };
            const structData = generateStructure(currentSentence);
            const answerRange = { start: 0, end: structData.targetEnd };"""
    html = re.sub(trans_def, new_trans_def, html, flags=re.DOTALL)

    # 3. Remove old hardcoded answerRange, heatmap
    html = re.sub(r'const heatmap = \[.*?\];', '', html)
    html = re.sub(r'const answerRange = \{ start: 0, end: 5 \};', '', html)

    # 4. Make getTranslation dynamic
    get_t_def = r'const getTranslation = \(s, e\) => \{.*?\};'
    new_get_t_def = """const getTranslation = (s, e) => {
                if (s === null) return "드래그를 통해 문장 덩어리(구문)를 선택해주세요.";
                return currentSentence ? `[해석 미리보기] "${currentSentence.korean}"` : "";
            };"""
    html = re.sub(get_t_def, new_get_t_def, html, flags=re.DOTALL)

    # 5. Make Questions dynamic
    q_logic_def = r'const handleQCheck = \(\) => \{.+?\} else if \(qIndex === 2\) \{.+?\}\s*\n\s*\};'
    new_q_logic_def = """const handleQCheck = () => {
                setQTries(prev => prev + 1);
                if (qIndex === 0) {
                    if (reorderAnswer.join(" ") === currentSentence.english) setQStatus("SUCCESS");
                    else setQStatus("WRONG");
                } else if (qIndex === 1) {
                    if (selectedOption !== null) setQStatus("SUCCESS");
                    else setQStatus("WRONG");
                } else if (qIndex === 2) {
                    if (writeAnswer.length > 5) setQStatus("SUCCESS");
                    else setQStatus("WRONG");
                }
            };"""
    html = re.sub(q_logic_def, new_q_logic_def, html, flags=re.DOTALL)

    # 6. Add useEffect for selectedUnit changes to shuffle quiz words
    # Insert it right before handleQCheck
    use_effect_str = """
            useEffect(() => {
                if (selectedUnit && selectedUnit.sentences && selectedUnit.sentences.length > 0) {
                    // Start of new unit/sentence setup
                    const s = selectedUnit.sentences[0];
                    if (s && s.english) {
                        const wordsArr = s.english.split(' ');
                        const shuffled = [...wordsArr].sort(() => Math.random() - 0.5);
                        setReorderPool(shuffled);
                        setReorderAnswer([]);
                        setWriteAnswer("");
                        setSelectedOption(null);
                        setQIndex(0);
                        setQStatus("IDLE");
                        setActivityStatus("IDLE");
                        setTries(0);
                        setDragRange({start:null, end:null});
                    }
                }
            }, [selectedUnit]);
            
            """ 
    html = html.replace('const handleQCheck = () => {', use_effect_str + 'const handleQCheck = () => {')
    
    # Empty default reorderPool
    html = re.sub(r'const \[reorderPool, setReorderPool\] = useState\(\[.*?\]\);', 'const [reorderPool, setReorderPool] = useState([]);', html)

    # 7. Dynamic DOM Replacements inside Return block
    # Analysis Screen Text
    html = html.replace('"What he said at the meeting was very important."', '{currentSentence ? currentSentence.english : ""}')
    html = html.replace('>그가 회의에서 말한 것은 매우 중요했다.<', '>{currentSentence ? currentSentence.korean : ""}<')
    
    # SVG Block components
    html = html.replace('>What he said at the meeting<', '>{structData.target}<')
    html = html.replace('>was<', '>{structData.v}<')
    html = html.replace('>very important.<', '>{structData.obj}<')

    # Similarity Quiz Q1, Q2, Q3 text
    # Q1
    html = html.replace('안토니오는 무역을 통해 가족을 부양하기 위해 여러 장소를 다녔다.', '{currentSentence ? currentSentence.korean : ""}')
    # Q2
    html = html.replace('나는 음악을 들을 때 행복해.', '{currentSentence ? currentSentence.korean : ""}')
    
    # Q3
    html = html.replace('무엇이 너를 행복하게 하니?', '{currentSentence ? currentSentence.korean : ""}')
    html = html.replace('_______ _______ you happy?', '_______ _______ _______ ______?')

    # 8. RESULT screen heatmap fix 
    # {heatmap[i]}% replaced with random numbers or just 80%
    html = re.sub(r'\{heatmap\[i\]\}%', '82%', html)

    # 9. Inject CURRICULUM and mapped units (DO THIS LAST TO PREVENT POLLUTING THE JSON WITH REPLACEMENTS)
    units_def = r"const units = \[.*?\];"
    new_units_def = f"""const CURRICULUM = {curriculum_json};
            const units = CURRICULUM.units.map((u, i) => ({{
                id: u.unit_id,
                unit: `Unit ${{i+1}}`,
                title: u.title,
                tags: u.origin_tags,
                sentences: u.sentences
            }}));"""
    html = re.sub(units_def, new_units_def, html, flags=re.DOTALL)

    with open(V9_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
        
    print(f"Generated clean v9 html at {V9_PATH}")

if __name__ == "__main__":
    main()
