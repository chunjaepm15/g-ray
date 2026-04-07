const { useState, useEffect } = React;

function App() {
    const units = CURRICULUM.units.map((u, i) => ({
        id: u.unit_id,
        unit: `Unit ${i+1}`,
        title: u.title,
        tags: u.origin_tags,
        sentences: u.sentences
    }));

    const [activeUnits, setActiveUnits] = useState(() => {
        const saved = sessionStorage.getItem('activeUnits');
        return saved ? JSON.parse(saved) : units.slice(0, 10).map(u => u.id);
    }); 
    const [unitProblemSettings, setUnitProblemSettings] = useState(() => {
        const saved = sessionStorage.getItem('unitProblemSettings');
        return saved ? JSON.parse(saved) : {};
    }); 

    useEffect(() => {
        sessionStorage.setItem('activeUnits', JSON.stringify(activeUnits));
    }, [activeUnits]);

    useEffect(() => {
        sessionStorage.setItem('unitProblemSettings', JSON.stringify(unitProblemSettings));
    }, [unitProblemSettings]);
    const [problemViewStage, setProblemViewStage] = useState(1); 
    const [problemDetailUnit, setProblemDetailUnit] = useState(null);

    const ProblemManageTab = () => {
        const types = ["문장 분석", "빈칸 채우기", "재배열", "영작"];
        const isAllActive = activeUnits.length === units.length;

        if (problemViewStage === 1) {
            return (
                <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2e8f0", padding: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
                        <div style={{ background: "#4f46e5", color: "white", padding: "10px 24px", borderRadius: "24px", fontSize: "14px", fontWeight: 900 }}>3학년 1반</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontWeight: 950, fontSize: "20px" }}>1-2. 문제 관리 (단원별 세부 설정)</h3>
                        <span onClick={() => { if(isAllActive) setActiveUnits([]); else setActiveUnits(units.map(u=>u.id)); }} style={{ fontSize: "13px", fontWeight: 800, color: "#4f46e5", cursor: "pointer" }}>{isAllActive ? "전체 해제" : "전체 선택"}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {units.map((u, idx) => (
                            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", border: "1.5px solid #f1f5f9", borderRadius: "16px", background: activeUnits.includes(u.id) ? "#fcfdff" : "#fff", opacity: activeUnits.includes(u.id) ? 1 : 0.6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900 }}>{idx + 1}</div>
                                    <div onClick={() => { setProblemDetailUnit(u); setProblemViewStage(2); }} style={{ cursor: "pointer" }}>
                                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 800 }}>{u.unit}</div>
                                        <div style={{ fontSize: "16px", fontWeight: 900, color: "#1e293b" }}>{u.title}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                    <button onClick={() => { setProblemDetailUnit(u); setProblemViewStage(2); }} style={{ background: "#1a3a5c", color: "white", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 900, cursor: "pointer" }}>예문 설정</button>
                                    <input type="checkbox" checked={activeUnits.includes(u.id)} onChange={() => { if(activeUnits.includes(u.id)) setActiveUnits(activeUnits.filter(id=>id!==u.id)); else setActiveUnits([...activeUnits, u.id]); }} style={{ width: "20px", height: "20px", accentColor: "#4f46e5" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => alert("AI RAG 단원 생성")} style={{ width: "100%", padding: "24px", marginTop: "32px", background: "#fff", border: "2px dashed #cbd5e1", borderRadius: "16px", color: "#64748b", fontWeight: 850 }}>🤖 새로운 단원 추가 (AI RAG 분석 빌더)</button>
                </div>
            );
        } else {
            // 예문 관리 상세 (Stage 2)
            const [selectedSentences, setSelectedSentences] = useState(() => {
                const saved = unitProblemSettings[`${problemDetailUnit.id}_selected`];
                return saved ? JSON.parse(saved) : problemDetailUnit.sentences.slice(0, 3).map(s => s.id);
            });

            const toggleSentence = (id) => {
                const newSelected = selectedSentences.includes(id) 
                    ? selectedSentences.filter(sid => sid !== id)
                    : [...selectedSentences, id];
                setSelectedSentences(newSelected);
                setUnitProblemSettings(prev => ({
                    ...prev,
                    [`${problemDetailUnit.id}_selected`]: JSON.stringify(newSelected)
                }));
            };

            return (
                <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2e8f0", padding: "32px" }}>
                    <button onClick={() => setProblemViewStage(1)} style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "10px 16px", borderRadius: "12px", fontWeight: 800, fontSize: "13px", marginBottom: "24px", cursor: "pointer" }}>&larr; 단원 목록으로</button>
                    <div style={{ fontSize: "22px", fontWeight: 950, marginBottom: "32px" }}>{problemDetailUnit.unit} 예문별 성질 설정</div>
                    
                    {problemDetailUnit.sentences.filter(s => selectedSentences.includes(s.id)).map((s, idx) => {
                        // 기본값: 첫 번째 예문은 재배열, 두 번째는 빈칸, 세 번째는 영작. 그 이후는 기본으로 빈 배열
                        const defaultSettings = idx === 0 ? ["재배열"] : idx === 1 ? ["빈칸 채우기"] : idx === 2 ? ["영작"] : [];
                        const currentSettings = unitProblemSettings[problemDetailUnit.id]?.[s.id] || defaultSettings;

                        return (
                            <div key={s.id} style={{ padding: "24px", border: "1.5px solid #f1f5f9", borderRadius: "20px", marginBottom: "20px", background: "#fcfdff" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 900 }}>예문 {idx + 1}</div>
                                    <button onClick={() => toggleSentence(s.id)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}>제거</button>
                                </div>
                                <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "12px", color: "#1a3a5c" }}>{s.english}</div>
                                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>{s.korean}</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
                                    {types.map(t => (
                                        <label key={t} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: "12px", background: "white", fontSize: "14px", fontWeight: 900, cursor: "pointer" }}>
                                            <input type="checkbox" checked={currentSettings.includes(t)} onChange={() => {
                                                setUnitProblemSettings(prev => {
                                                    const unitData = prev[problemDetailUnit.id] || {};
                                                    const sData = unitData[s.id] || defaultSettings;
                                                    const newData = sData.includes(t) ? sData.filter(x => x !== t) : [...sData, t];
                                                    return { ...prev, [problemDetailUnit.id]: { ...unitData, [s.id]: newData } };
                                                });
                                            }} style={{ width: "16px", height: "16px" }} />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                                
                                {/* 미리보기 및 통제 영역 */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
                                    <div style={{ fontSize: "13px", fontWeight: 900, color: "#1e293b", marginBottom: "4px" }}>🔧 문제 미리보기 및 설정 (Logic 처리)</div>
                                    
                                    {currentSettings.includes("재배열") && (
                                        <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#4f46e5", marginBottom: "8px" }}>Step 1. 재배치 (구문 단위 셔플)</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                                {/* 실제로는 셔플 결과를 보여주어야 하므로, 임시로 구문들을 직접 렌더링하고 교사가 볼 수 있게 함 */}
                                                {(s.syntax_chunks || []).map((chunk, cIdx) => (
                                                    <div key={cIdx} style={{ padding: "6px 12px", background: "white", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontWeight: 800, cursor: "move" }}>
                                                        {chunk.eng}
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>* 학생들이 보게 될 셔플된 청크입니다. 끌어서 셔플 순서를 통제할 수 있습니다.</div>
                                        </div>
                                    )}

                                    {currentSettings.includes("빈칸 채우기") && (() => {
                                        let blanked = s.english;
                                        const engKeywords = s.grammar.match(/[a-zA-Z]+/g);
                                        if (engKeywords) {
                                            engKeywords.forEach(kw => {
                                                blanked = blanked.replace(new RegExp(`\\b${kw}\\b`, 'gi'), '_____');
                                            });
                                        } else {
                                            const verbChunk = (s.syntax_chunks || []).find(c => c.role === 'Verb');
                                            if (verbChunk) {
                                                blanked = blanked.replace(verbChunk.eng, '_____');
                                            } else {
                                                blanked = blanked.replace(/ /g, ' _____ '); // fallback
                                            }
                                        }
                                        return (
                                            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#4f46e5", marginBottom: "8px" }}>Step 2. 빈칸 (Grammar 기반 치환)</div>
                                                <div style={{ fontSize: "14px", fontWeight: 700, color: "#334155", letterSpacing: "0.5px" }}>{blanked}</div>
                                                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>* 문법명({s.grammar})을 기반으로 키워드가 블라인드 처리되었습니다.</div>
                                            </div>
                                        );
                                    })()}

                                    {currentSettings.includes("영작") && (
                                        <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#4f46e5", marginBottom: "8px" }}>Step 3. 영작 (전체 입력 및 키워드 일치 확인)</div>
                                            <div style={{ fontSize: "13px", color: "#334155", marginBottom: "6px" }}><strong>문제:</strong> {s.korean}</div>
                                            <div style={{ fontSize: "13px", color: "#16a34a" }}><strong>정답 기준:</strong> {s.english}</div>
                                            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>* 학생이 전체 문장을 입력하면, 주요 키워드 일치 여부를 기반으로 채점됩니다.</div>
                                        </div>
                                    )}
                                    
                                    {currentSettings.length === 0 && (
                                        <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>선택된 문제 유형이 없습니다.</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* 추가 예문 선택 영역 */}
                    {problemDetailUnit.sentences.filter(s => !selectedSentences.includes(s.id)).length > 0 && (
                        <div style={{ marginTop: "40px", borderTop: "1.5px dashed #e2e8f0", paddingTop: "32px" }}>
                            <div style={{ fontSize: "15px", fontWeight: 900, color: "#4f46e5", marginBottom: "16px" }}>+ 단원 내 예문 추가하기</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {problemDetailUnit.sentences.filter(s => !selectedSentences.includes(s.id)).map(s => (
                                    <div key={s.id} onClick={() => toggleSentence(s.id)} style={{ padding: "16px 20px", border: "1.5px solid #f1f5f9", borderRadius: "12px", cursor: "pointer", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "#4f46e5"} onMouseLeave={e => e.currentTarget.style.borderColor = "#f1f5f9"}>
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "20px" }}>
                                            <span style={{ fontWeight: 800, color: "#1e293b", fontSize: "14px" }}>{s.english}</span>
                                        </div>
                                        <div style={{ color: "#4f46e5", fontWeight: 900, fontSize: "13px" }}>추가 +</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <Header sub="교사용 관리 센터" isTeacher={true} title="🔍 문장투시경 Admin" />
            <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
                <div className="home-tabs" style={{marginBottom: "40px"}}>
                    <button onClick={() => { window.location.href = 'main.html'; }} className="tab-item">1-1. 단원 선택</button>
                    <button className="tab-item active">1-2. 문제 관리</button>
                    <button onClick={() => { window.location.href = 'teacher_student.html'; }} className="tab-item">1-3. 학생 결과</button>
                </div>
                <ProblemManageTab />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
