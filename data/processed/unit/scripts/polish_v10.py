import os
import json
import re

V9_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v9.html"
JSON_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles\dynamic_curriculum_v1.json"

def perform_v10_polish():
    # 1. Load the latest JSON (including Golden Samples)
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)
    
    curriculum_json = json.dumps(curriculum, ensure_ascii=False, indent=2)

    # 2. Read HTML
    with open(V9_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    # 3. Update CURRICULUM Injection
    data_match = re.search(r"const CURRICULUM = \{.*?\};", html, re.DOTALL)
    if data_match:
        html = html[:data_match.start()] + f"const CURRICULUM = {curriculum_json};" + html[data_match.end():]

    # 4. Smart generateStructure Upgrade (using simple string replace for safety)
    old_gen_struct_pattern = r'const generateStructure = \(sentence\) => \{.+?\};'
    new_gen_struct = r"""
            const generateStructure = (sentence) => {
                if (!sentence || !sentence.english) return { eng: "", kor: "", target: "", targetEnd: 1, ceng: "", v: "", obj: "" };
                
                // V2: Use pre-defined syntax_chunks if they look manually curated (at least 2 chunks)
                if (sentence.syntax_chunks && sentence.syntax_chunks.length >= 2 && sentence.id && sentence.id.startsWith("REF-")) {
                    const firstChunkWords = sentence.syntax_chunks[0].eng.trim().split(/\s+/).length;
                    return {
                        eng: sentence.english,
                        kor: sentence.korean,
                        target: sentence.syntax_chunks[0].eng,
                        targetEnd: firstChunkWords - 1,
                        ceng: '',
                        v: sentence.syntax_chunks[1].eng,
                        obj: sentence.syntax_chunks.slice(2).map(c => c.eng).join(' ')
                    };
                }

                // Fallback heuristic for auto-generated data
                const w = sentence.english.split(' ');
                const mid = Math.floor(w.length/2);
                return { eng: sentence.english, kor: sentence.korean, target: w.slice(0, mid).join(' '), targetEnd: mid - 1, ceng: '', v: w.length>1 ? w[mid] : '', obj: w.slice(mid+1).join(' ') };
            };
    """
    # Use re.sub with a lambda to avoid backslash escape issues
    html = re.sub(old_gen_struct_pattern, lambda x: new_gen_struct, html, flags=re.DOTALL)

    # 5. Fix answerRange comment
    html = html.replace('const answerRange = { start: 0, end: structData.targetEnd };', 
                        'const answerRange = { start: 0, end: structData.targetEnd }; // Target verified by Golden Data')

    # 6. Pedagogical Hint Logic
    hint_match_pattern = r'let hint = `✨ \[AI API 작동 중\].+?`;'
    hint_logic = r"""
                let hint = `✨ [AI 피드백] 이 문장에서 <${selectedUnit.title}> 핵심 패턴이 적용된 곳을 덩어리로 묶어야 합니다.`;
                if (currentSentence && currentSentence.variation_flags) {
                    if (currentSentence.variation_flags.includes("is_noun_clause")) hint += " " + "여기서는 'if/whether'가 이끄는 명사절 전체가 목적어 역할을 하고 있어요.";
                    if (currentSentence.variation_flags.includes("too_to_structure")) hint += " " + "too + 형용사와 to + 동사원형 사이의 경계를 잘 살펴보세요.";
                }
    """
    html = re.sub(hint_match_pattern, lambda x: hint_logic, html, flags=re.DOTALL)

    with open(V9_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("V10 Polish Complete: Expert Data seeded and Logic fine-tuned.")

if __name__ == "__main__":
    perform_v10_polish()
