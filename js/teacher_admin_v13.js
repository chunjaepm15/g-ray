const { useState, useEffect } = React;

const Header = ({ sub, isTeacher, onBack }) => (
    <div style={{ background: "#1a3a5c", color: "white", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onBack && <button onClick={onBack} style={{ background: "transparent", color: "white", fontSize: 24, padding: "0 8px", border: "none", cursor: "pointer" }}>←</button>}
            <span style={{ fontWeight: 800, fontSize: 20 }}>🔍 문장투시경 Admin</span>
            {sub && <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12, marginLeft: 8 }}>{sub}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ background: "#e67e22", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700 }}>🧑‍🏫 교사 모드</span>
        </div>
    </div>
);

const Badge = ({ children, color = "#eef2ff", text = "#4f46e5" }) => (
    <span style={{ background: color, color: text, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>
);

function App() {
    const [screen, setScreen] = useState("LOGIN"); // LOGIN, HOME
    const [loginStep, setLoginStep] = useState("SELECTION");
    const units = CURRICULUM.units.map((u, i) => ({
        id: u.unit_id,
        unit: `Unit ${i+1}`,
        title: u.title,
        tags: u.origin_tags,
        sentences: u.sentences
    }));

    const [homeTab, setHomeTab] = useState("UNIT_SELECT"); 
    const [activeUnits, setActiveUnits] = useState(units.slice(0, 10).map(u => u.id));
    const [unitProblemSettings, setUnitProblemSettings] = useState({});
    
    // 단계별 관리를 위한 상태
    const [problemViewStage, setProblemViewStage] = useState(1); // 1: List, 2: Detail
    const [problemDetailUnit, setProblemDetailUnit] = useState(null);

    const LoginScreen = () => (
        <div id="screen-login">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">문장투시경 Admin</h1>
                    <p className="login-subtitle">교사용 관리자 계정으로 로그인하세요.</p>
                    {loginStep === "SELECTION" ? (
                        <div className="role-selection">
                            <div className="role-card" style={{ width: "100%", maxWidth: "300px" }} onClick={() => setLoginStep("TEACHER")}>
                                <span className="role-icon">👨‍🏫</span>
                                <span className="role-label" style={{ fontSize: "18px", fontWeight: 900 }}>선생님 로그인</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <input type="text" className="login-input" placeholder="교사 인증 코드" />
                            <input type="text" className="login-input" placeholder="성함" />
                            <button className="login-submit" onClick={() => setScreen("HOME")}>접속하기</button>
                            <button className="login-back-btn" onClick={() => setLoginStep("SELECTION")}>뒤로가기</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const StudentResultsView = () => (
        <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2e8f0", padding: "32px" }}>
            <h3 style={{ fontWeight: 950, fontSize: "20px", marginBottom: "24px" }}>학생별 학습 결과 현황</h3>
            {[ 
                { name: "김철수", detail: "Unit 1 - 학습 중", progress: 75, lastSeen: "10분 전" }, 
                { name: "이영희", detail: "Unit 2 - 완료", progress: 100, lastSeen: "어제" }, 
                { name: "박지민", detail: "Unit 1 - 미진행", progress: 0, lastSeen: "-" } 
            ].map(s => (
                <div key={s.name} style={{ padding: "20px 0", borderBottom: "1.5px solid #f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: "16px" }}>{s.name} <span style={{fontSize: "12px", color: "#94a3b8", marginLeft: "8px"}}>{s.lastSeen}</span></div>
                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{s.detail}</div>
                        </div>
                        <Badge color={s.progress === 100 ? "#dcfce7" : "#eef2ff"} text={s.progress === 100 ? "#166534" : "#4f46e5"}>{s.progress}%</Badge>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${s.progress}%`, height: "100%", background: "#4f46e5" }}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const ProblemManageTab = () => {
        const types = ["문장 분석", "빈칸 채우기", "재배열", "영작"];
        const isAllActive = activeUnits.length === units.length;

        if (problemViewStage === 1) {
            return (
                <div style={{ background: "white", borderRadius: "24px", border: "1.5px solid #e2e8f0", padding: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
                        <div style={{ background: "#4f46e5", color: "white", padding: "10px 24px", borderRadius: "24px", fontSize: "14px", fontWeight: 900 }}>3학년 1반</div>
                        <button style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", fontWeight: 800 }}>+ 학급 추가</button>
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
                                    <div onClick={() => { setProblemDetailUnit(u); setProblemViewStage(2); }} style={{ cursor: "pointer" }} className="unit-title-hover">
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
            // Stage 2: Sentence Detail
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
                    <button className="add-btn" style={{marginTop: "12px"}}>+ 추가 예문 생성하기</button>
                </div>
            );
        }
    };

    const renderHome = () => (
        <div>
            <Header sub="교사용 관리 센터" isTeacher={true} onBack={() => setScreen("LOGIN")} />
            <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
                <div className="home-tabs" style={{marginBottom: "40px"}}>
                    <button onClick={() => { setHomeTab("UNIT_SELECT"); setProblemViewStage(1); }} className={`tab-item ${homeTab === "UNIT_SELECT" ? 'active' : ''}`}>1-1. 단원 선택</button>
                    <button onClick={() => { setHomeTab("PROBLEM_MANAGE"); setProblemViewStage(1); }} className={`tab-item ${homeTab === "PROBLEM_MANAGE" ? 'active' : ''}`}>1-2. 문제 관리</button>
                    <button onClick={() => { setHomeTab("STUDENT_MANAGE"); setProblemViewStage(1); }} className={`tab-item ${homeTab === "STUDENT_MANAGE" ? 'active' : ''}`}>1-3. 학생 결과</button>
                </div>

                {homeTab === "STUDENT_MANAGE" && <StudentResultsView />}
                
                {homeTab === "UNIT_SELECT" && (
                    <div className="unit-grid">
                        {units.map(u => (
                            <div key={u.id} className="unit-card" style={{ opacity: activeUnits.includes(u.id) ? 1 : 0.5 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800 }}>{u.unit}</div>
                                    <input type="checkbox" checked={activeUnits.includes(u.id)} onChange={() => { if(activeUnits.includes(u.id)) setActiveUnits(activeUnits.filter(id=>id!==u.id)); else setActiveUnits([...activeUnits, u.id]); }} style={{width: "18px", height: "18px"}} />
                                </div>
                                <div style={{ fontSize: "17px", fontWeight: 950, color: "#1a3a5c", marginBottom: "12px" }}>{u.title}</div>
                                <div style={{ display: "flex", gap: "6px" }}>{u.tags.map(t => <Badge key={t}>{t}</Badge>)}</div>
                            </div>
                        ))}
                    </div>
                )}

                {homeTab === "PROBLEM_MANAGE" && <ProblemManageTab />}
            </div>
        </div>
    );

    if (screen === "LOGIN") return <LoginScreen />;

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            {renderHome()}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
