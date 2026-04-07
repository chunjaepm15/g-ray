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
                                    <button onClick={() => { setProblemDetailUnit(u); setProblemViewStage(2); }} style={{ background: "#1a3a5c", color: "white", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 900, cursor: "pointer" }}>예문 추가</button>
                                    <input type="checkbox" checked={activeUnits.includes(u.id)} onChange={() => { if(activeUnits.includes(u.id)) setActiveUnits(activeUnits.filter(id=>id!==u.id)); else setActiveUnits([...activeUnits, u.id]); }} style={{ width: "20px", height: "20px", accentColor: "#4f46e5" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => alert("AI RAG 단원 생성")} style={{ width: "100%", padding: "24px", marginTop: "32px", background: "#fff", border: "2px dashed #cbd5e1", borderRadius: "16px", color: "#64748b", fontWeight: 850 }}>🤖 새로운 단원 추가 (AI RAG 분석 빌더)</button>
                </div>
            );
        } else {
            return (
                <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2e8f0", padding: "32px" }}>
                    <button onClick={() => setProblemViewStage(1)} style={{ background: "#eef2ff", border: "none", color: "#4f46e5", padding: "10px 16px", borderRadius: "12px", fontWeight: 800, fontSize: "13px", marginBottom: "24px", cursor: "pointer" }}>&larr; 단원 목록으로</button>
                    <div style={{ fontSize: "22px", fontWeight: 950, marginBottom: "32px" }}>{problemDetailUnit.unit} 예문별 성질 설정</div>
                    {problemDetailUnit.sentences.slice(0, 3).map((s, idx) => {
                        const currentSettings = unitProblemSettings[problemDetailUnit.id]?.[s.id] || [];
                        return (
                            <div key={s.id} style={{ padding: "24px", border: "1.5px solid #f1f5f9", borderRadius: "20px", marginBottom: "20px", background: "#fcfdff" }}>
                                <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 900, marginBottom: "8px" }}>예문 {idx + 1}</div>
                                <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "12px", color: "#1a3a5c" }}>{s.english}</div>
                                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>{s.korean}</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                                    {types.map(t => (
                                        <label key={t} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: "12px", background: "white", fontSize: "14px", fontWeight: 900, cursor: "pointer" }}>
                                            <input type="checkbox" checked={currentSettings.includes(t)} onChange={() => {
                                                setUnitProblemSettings(prev => {
                                                    const unitData = prev[problemDetailUnit.id] || {};
                                                    const sData = unitData[s.id] || [];
                                                    const newData = sData.includes(t) ? sData.filter(x => x !== t) : [...sData, t];
                                                    return { ...prev, [problemDetailUnit.id]: { ...unitData, [s.id]: newData } };
                                                });
                                            }} style={{ width: "16px", height: "16px" }} />
                                            {t}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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
