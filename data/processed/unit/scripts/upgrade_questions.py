import os
import re

V9_PATH = r"i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\app\app-index5\standalone_preview_v9.html"

def modify_html():
    with open(V9_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update currentSentence to use qIndex for SIMILAR screen
    html = re.sub(
        r"const currentSentence = selectedUnit && selectedUnit\.sentences && selectedUnit\.sentences\.length > 0 \? selectedUnit\.sentences\[0\] : null;",
        r"""const currentSentence = selectedUnit && selectedUnit.sentences && selectedUnit.sentences.length > (screen === "SIMILAR" ? qIndex : 0) ? selectedUnit.sentences[screen === "SIMILAR" ? qIndex : 0] : (selectedUnit?.sentences?.[0] || null);""",
        html
    )

    # 2. Add new states inside App component
    state_block = r"const \[writeAnswer, setWriteAnswer\] = useState\(\"\"\);"
    new_state_block = """const [writeAnswer, setWriteAnswer] = useState("");
            const [showQ3Translation, setShowQ3Translation] = useState(false);
            const [visibleChunks, setVisibleChunks] = useState([]);
            const [q3ReadingDone, setQ3ReadingDone] = useState(false);
            const [q2Options, setQ2Options] = useState([]);
            const [q2CorrectOptionIndex, setQ2CorrectOptionIndex] = useState(0);

            // Setup Q2 dynamic options on qIndex change
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

            const simulateChunkReading = (koreanText) => {
                if (!koreanText) return;
                const chunks = koreanText.split(' ');
                let currentIdx = 0;
                setVisibleChunks([]);
                
                const interval = setInterval(() => {
                    if (currentIdx < chunks.length) {
                        setVisibleChunks(prev => {
                            const newArr = [...prev];
                            newArr.push(chunks[currentIdx] + " ");
                            return newArr;
                        });
                        currentIdx++;
                    } else {
                        clearInterval(interval);
                        setQ3ReadingDone(true);
                    }
                }, 550); // 구문 독해(직독직해) 시뮬레이션 속도
            };"""
    html = html.replace(state_block, new_state_block)

    # 3. Reset Q3 states in nextAction
    next_action = r"""const nextAction = \(\) => \{
                if \(qIndex < 2\) \{
                    setQIndex\(prev => prev \+ 1\);
                    setQStatus\(\"IDLE\"\);
                    setQTries\(0\);
                    setShowConcept\(false\);
                \} else \{
                    setScreen\(\"DASHBOARD\"\);
                \}
            \};"""
    new_next_action = """const nextAction = () => {
                if (qIndex < 2) {
                    setQIndex(prev => prev + 1);
                    setQStatus("IDLE");
                    setQTries(0);
                    setShowConcept(false);
                    setShowQ3Translation(false);
                    setVisibleChunks([]);
                    setQ3ReadingDone(false);
                    setWriteAnswer("");
                    setSelectedOption(null);
                } else {
                    setScreen("DASHBOARD");
                }
            };"""
    html = re.sub(next_action, new_next_action, html)

    # 4. Modify handleQCheck for dynamic Q2
    qcheck = r"""if \(qIndex === 1\) \{
                    if \(selectedOption !== null\) setQStatus\(\"SUCCESS\"\);
                    else setQStatus\(\"WRONG\"\);"""
    new_qcheck = """if (qIndex === 1) {
                    if (selectedOption === q2CorrectOptionIndex) setQStatus("SUCCESS");
                    else setQStatus("WRONG");"""
    html = re.sub(qcheck, new_qcheck, html)

    # 5. Overhaul Q1 wording (it uses currentSentence nicely, but let's make sure its instructions are correct)
    # Actually Q1 is fine, no changes needed for Q1 structure except making sure qStatus handles it (which it does).

    # 6. Overhaul Q2 layout
    q2_layout = r"""\{qIndex === 1 && \(
                                <div>
                                    <div style=\{\{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 \}\}\>🧐 빈칸에 들어갈 알맞은 접속사를 고르세요\.</div>
                                    <div style=\{\{ fontSize: 16, color: "#64748b", marginBottom: 16 \}\}\>\{currentSentence \? currentSentence\.korean : ""\}</div>
                                    <div style=\{\{ fontSize: 24, color: "#0f172a", marginBottom: 24, marginTop: 12, textAlign: "center", fontWeight: 700 \}\}\>
                                        I’m happy <span style=\{\{ borderBottom: "3px solid #1a3a5c", padding:"0 20px", display:"inline-block" \}\}\></span> I listen to music\.
                                    </div>
                                    <button className=\{`option-btn \$\{selectedOption === 1 \? 'selected' : ''\}`\} onClick=\{\(\) => \{if\(qStatus!=="SUCCESS"\) setSelectedOption\(1\)\}\}\>1\. what</button>
                                    <button className=\{`option-btn \$\{selectedOption === 2 \? 'selected' : ''\}`\} onClick=\{\(\) => \{if\(qStatus!=="SUCCESS"\) setSelectedOption\(2\)\}\}\>2\. when</button>
                                    <button className=\{`option-btn \$\{selectedOption === 3 \? 'selected' : ''\}`\} onClick=\{\(\) => \{if\(qStatus!=="SUCCESS"\) setSelectedOption\(3\)\}\}\>3\. which</button>
                                </div>
                            \)\}"""
    
    new_q2_layout = """{qIndex === 1 && (
                                <div>
                                    <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>🧐 빈칸에 들어갈 알맞은 단어를 고르세요.</div>
                                    <div style={{ fontSize: 16, color: "#64748b", marginBottom: 16 }}>{currentSentence ? currentSentence.korean : ""}</div>
                                    <div style={{ fontSize: 22, color: "#0f172a", marginBottom: 24, marginTop: 12, textAlign: "center", fontWeight: 700 }}>
                                        {currentSentence ? currentSentence.english.split(' ').map((w, i) => i === Math.floor(currentSentence.english.split(' ').length / 2) ? "_______" : w).join(' ') : ""}
                                    </div>
                                    {q2Options.map((opt, i) => (
                                        <button key={i} className={`option-btn ${selectedOption === i+1 ? 'selected' : ''}`} onClick={() => {if(qStatus!=="SUCCESS") setSelectedOption(i+1)}}>{i+1}. {opt}</button>
                                    ))}
                                </div>
                            )}"""
    html = re.sub(q2_layout, new_q2_layout, html, flags=re.DOTALL)

    # 7. Overhaul Q3 layout completely
    q3_layout = r"""\{qIndex === 2 && \(
                                <div>
                                    <div style=\{\{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 \}\}\>📝 주어진 한글 해석을 보고, 문맥에 맞게 영작하세요\.</div>
                                    <div style=\{\{ fontSize: 16, color: "#64748b", marginBottom: 24 \}\}\>\{currentSentence \? currentSentence\.korean : ""\}</div>
                                    <div style=\{\{ fontSize: 18, color: "#0f172a", marginBottom: 12, fontWeight: 700 \}\}\>_______ _______ _______ ______\?</div>
                                    <input type="text" className="text-input" placeholder="빈칸에 들어갈 영문을 작성하세요 \(예: What makes\)" value=\{writeAnswer\} onChange=\{\(e\) => setWriteAnswer\(e\.target\.value\)\} disabled=\{qStatus==="SUCCESS"\} />
                                </div>
                            \)\}"""

    new_q3_layout = """{qIndex === 2 && (
                                <div>
                                    <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>📝 주어진 문단의 문맥을 분석하고 빈칸을 영작하세요.</div>
                                    
                                    {!showQ3Translation ? (
                                        <div style={{ background: "#f8fafc", padding: "24px", borderRadius: 16, marginBottom: 24, border: "1px solid #e2e8f0", fontSize: 17, lineHeight: 1.7 }}>
                                            <span style={{ color: "#94a3b8" }}>The speaker paused for a moment looking at the crowd. </span>
                                            <span style={{ color: "#1e293b", fontWeight: 700, backgroundColor: "#fef08a", padding: "2px 4px", borderRadius: 4 }}>{currentSentence ? currentSentence.english : ""}</span>
                                            <span style={{ color: "#94a3b8" }}> Everyone was deeply moved by those words.</span>
                                            
                                            <div style={{ marginTop: 28, textAlign: "center" }}>
                                                <button onClick={() => { setShowQ3Translation(true); simulateChunkReading(currentSentence.korean); }} style={{ padding: "14px 28px", background: "#4f46e5", color: "white", borderRadius: 14, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }}>직독직해 구문독해 실행하기 →</button>
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
                            )}"""
    html = re.sub(q3_layout, new_q3_layout, html, flags=re.DOTALL)

    with open(V9_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print("Done generating updated UI layout for Q1/Q2/Q3 logic.")

if __name__ == "__main__":
    modify_html()
