import os
import json
import re

V9_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v9.html"
JSON_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\unit\bundles\dynamic_curriculum_v1.json"

def perform_v9_update():
    # 1. Load the latest V2 JSON Data
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        curriculum = json.load(f)
    
    # Trim sentences for embedding efficiency
    for u in curriculum['units']:
        u['sentences'] = u['sentences'][:5] # Limit to 5 for prototype size
    
    curriculum_json = json.dumps(curriculum, ensure_ascii=False, indent=2)

    # 2. Read the current HTML
    with open(V9_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    # 3. Inject the CURRICULUM Data
    # Find the tag for CURRICULUM
    data_match = re.search(r"const CURRICULUM = \{.*?\};", html, re.DOTALL)
    if data_match:
        html = html[:data_match.start()] + f"const CURRICULUM = {curriculum_json};" + html[data_match.end():]
    else:
        # Fallback if not found (v7-like structure)
        units_match = re.search(r"const units = \[.*?\];", html, re.DOTALL)
        if units_match:
            new_data_str = f"""const CURRICULUM = {curriculum_json};
            const units = CURRICULUM.units.map((u, i) => ({{
                id: u.unit_id,
                unit: `Unit ${{i+1}}`,
                title: u.title,
                tags: u.origin_tags,
                sentences: u.sentences
            }}));"""
            html = html[:units_match.start()] + new_data_str + html[units_match.end():]

    # 4. Inject/Update React Logic (V2 Logic)
    # Define the core logic block we want to ensure exists
    logic_block = """
            const [writeAnswer, setWriteAnswer] = useState("");
            const [showQ3Translation, setShowQ3Translation] = useState(false);
            const [visibleChunks, setVisibleChunks] = useState([]);
            const [q3ReadingDone, setQ3ReadingDone] = useState(false);
            const [q2Options, setQ2Options] = useState([]);
            const [q2CorrectOptionIndex, setQ2CorrectOptionIndex] = useState(0);

            const simulateChunkReading = (sentenceObj) => {
                if (!sentenceObj) return;
                // V2 syntax_chunks check
                const chunks = (sentenceObj.syntax_chunks && sentenceObj.syntax_chunks.length > 0)
                    ? sentenceObj.syntax_chunks.map(c => c.kor)
                    : (sentenceObj.korean ? sentenceObj.korean.split(' ') : []);
                
                let currentIdx = 0;
                setVisibleChunks([]);
                const interval = setInterval(() => {
                    if (currentIdx < chunks.length) {
                        setVisibleChunks(prev => [...prev, chunks[currentIdx] + " "]);
                        currentIdx++;
                    } else {
                        clearInterval(interval);
                        setQ3ReadingDone(true);
                    }
                }, 550);
            };

            useEffect(() => {
                if (qIndex === 1 && currentSentence) {
                    const words = currentSentence.english.split(' ');
                    const blankIdx = Math.floor(words.length / 2);
                    const correctWord = words[blankIdx].replace(/[^a-zA-Z]/g, '');
                    const decoys = ["what", "how", "who", "when", "where", "which", "if", "that", "in", "on", "at", "for", "to"].filter(d => d !== correctWord.toLowerCase()).sort(() => 0.5 - Math.random()).slice(0, 3);
                    const opts = [...decoys, correctWord].sort(() => 0.5 - Math.random());
                    setQ2Options(opts);
                    setQ2CorrectOptionIndex(opts.indexOf(correctWord) + 1);
                }
            }, [qIndex, currentSentence]);
    """
    
    # We'll just replace the area after screen states
    html = re.sub(r'const \[writeAnswer, setWriteAnswer\] = useState\(""\);', logic_block, html)

    # 5. Fix handleCheck hint and screen logic
    html = html.replace('setScreen("ANALYSIS"); setTries(0); setActivityStatus("IDLE"); setShowHint(false);', 'setScreen("ANALYSIS"); setTries(0); setActivityStatus("IDLE"); setShowHint(false); setDragRange({start:null, end:null});')

    # 6. Ensure grammarConcepts is correct
    concepts_block = """
            const grammarConcepts = {
                "관계대명사 what": { rule: "what + 주어 + 동사 = '~하는 것' (명사절)", sub: "= the thing which[that] + S + V", points: ["✔ 선행사 포함 (what 앞에 명사 X)", "✔ 주어/목적어/보어 역할", "✔ 불완전한 문장 수반", "✔ 단수 취급 유의"] },
                "현재완료 진행(형)": { rule: "have/has + been + v-ing = '계속 ~하고 있다'", sub: "= 현재완료 + 진행형", points: ["✔ 과거부터 현재도 진행 중", "✔ for, since와 자주 쓰임", "✔ 동작의 계속성 강조", "✔ 상태동사는 불가"] },
                "to부정사의 의미상 주어": { rule: "for/of + 목적격 + to부정사", sub: "= to부정사의 행위 주체 명시", points: ["✔ 일반적: for + 목적격", "✔ 사람성격 형용사: of + 목적격", "✔ 문장의 주어와 다를 때 사용", "✔ 위치 주의"] },
                "과거완료": { rule: "had + p.p.", sub: "= 과거의 어느 시점보다 더 이전", points: ["✔ 기준 과거 시점 필수", "✔ 시간의 선후관계 명확", "✔ 완료, 경험, 계속, 결과", "✔ after/before 구문과 쓰임"] },
                "명사를 수식하는 분사": { rule: "명사 + v-ing / p.p.", sub: "= 분사가 형용사 역할", points: ["✔ v-ing 능동/진행", "✔ p.p 수동/완료", "✔ 길면 뒤에서 수식", "✔ 감정유발 vs 감정느낌"] },
                "분사구문": { rule: "접속사+S+V... -> V-ing...", sub: "= 부사절을 구로 축약", points: ["✔ 접속사, 주어 생략", "✔ 동사원형+ing", "✔ Being 생략 가능", "✔ 부정어는 분사 바로 앞"] },
                "접속사 if / whether": { rule: "if / whether + S + V = '~인지 아닌지'", sub: "= 명사절 접속사", points: ["✔ or not 결합 가능", "✔ 주어나 전치사 뒤는 whether만", "✔ 목적어 자리는 둘 다", "✔ 만약~조건과 구별"] },
                "too ~ to ...": { rule: "too + 형/부 + to V", sub: "= 너무 ~해서 ...할 수 없다", points: ["✔ 부정어 없이 부정의미", "✔ 의미상 주어 추가 가능", "✔ so ~ that ~ can't 전환", "✔ 시제 일치 주의"] },
                "가정법 과거": { rule: "If + S + 과거동사, S + 조동사과거 + V", sub: "= 현재 사실의 반대", points: ["✔ be동사는 were", "✔ 현재로 해석", "✔ 직설법 변환 연습", "✔ if생략시 도치"] },
                "접속사 so that": { rule: "so that + S + can + V", sub: "= ~하기 위해서", points: ["✔ 목적 부사절", "✔ in order to 전환", "✔ so 형 that과 구별", "✔ ,(콤마) so that은 결과"] }
            };
    """
    if "const grammarConcepts =" not in html:
        html = html.replace('const handleQCheck = () => {', concepts_block + '\n            const handleQCheck = () => {')

    # 7. Final Q3 UI update (Paragraph + Reading Speed)
    q3_ui = """
                            {qIndex === 2 && (
                                <div>
                                    <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>📝 주어진 문단의 문맥을 분석하고 빈칸을 영작하세요.</div>
                                    {!showQ3Translation ? (
                                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: 16, marginBottom: 24, border: "1px solid #e2e8f0", fontSize: 17, lineHeight: 1.7 }}>
                                            <span style={{ color: "#94a3b8" }}>The speaker paused for a moment looking at the crowd. </span>
                                            <span style={{ color: "#1e293b", fontWeight: 700, backgroundColor: "#fef08a", padding: "2px 4px", borderRadius: 4 }}>{currentSentence ? currentSentence.english : ""}</span>
                                            <span style={{ color: "#94a3b8" }}> Everyone was deeply moved by those words.</span>
                                            <div style={{ marginTop: 28, textAlign: "center" }}>
                                                <button onClick={() => { setShowQ3Translation(true); simulateChunkReading(currentSentence); }} style={{ padding: "14px 28px", background: "#4f46e5", color: "white", borderRadius: 14, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }}>직독직해 구문독해 실행하기 →</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: 16, marginBottom: 24, border: "1px solid #e2e8f0", fontSize: 17, lineHeight: 1.6 }}>
                                            <div style={{ color: "#475569", marginBottom: 12, fontWeight: 800 }}>[직독직해 해석 진행 중]</div>
                                            <div style={{ color: "#1e293b", fontSize: 19, minHeight: "30px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {visibleChunks.map((c, i) => (
                                                    <span key={i} style={{ animation: "fadeIn 0.4s ease-out" }}>{c}</span>
                                                ))}
                                                {!q3ReadingDone && <span style={{ animation: "blink 1s infinite" }}>|</span>}
                                            </div>
                                            {q3ReadingDone && (
                                                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "2px dashed #cbd5e1", animation: "fadeIn 0.6s ease-out" }}>
                                                    <div style={{ fontSize: 20, color: "#0f172a", marginBottom: 16, textAlign: "center", fontWeight: 700 }}>
                                                        {currentSentence ? currentSentence.english.split(' ').map((w, idx) => idx > 1 ? "_______" : w).join(' ') : ""}
                                                    </div>
                                                    <input type="text" className="text-input" placeholder="정답을 입력해 문장을 완성하세요." value={writeAnswer} onChange={(e) => setWriteAnswer(e.target.value)} onKeyDown={(e) => { if(e.key==='Enter' && qStatus!=="SUCCESS") handleQCheck(); }} disabled={qStatus==="SUCCESS"} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <style>{`
                                        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                                        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                                    `}</style>
                                </div>
                            )}
    """
    # Replace the old Q3 block
    html = re.sub(r'\{qIndex === 2 && \(.*?\}\)\s*\}', q3_ui, html, flags=re.DOTALL)

    # 8. Dynamic Header Prompt in Activity
    html = html.replace('📌 <strong>관계대명사 what이 이끄는 절</strong> 전체를 찾아 마우스로 드래그하세요.', '📌 <strong>{selectedUnit.title}</strong>에 해당하는 구문(덩어리) 전체를 찾아 마우스로 드래그하세요.')

    with open(V9_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("V9 HTML Updated successfully with V2 Data and Logic.")

if __name__ == "__main__":
    perform_v9_update()
