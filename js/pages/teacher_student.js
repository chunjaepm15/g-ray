const { useState, useEffect } = React;

// [공통 UI] Header
const Header = ({ title, sub }) => (
    <div style={{ background: "#1a3a5c", padding: "20px 40px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 900, margin: 0 }}>{title}</h1>
        <span style={{ fontSize: "14px", opacity: 0.8 }}>{sub}</span>
    </div>
);

function App() {
    const [selectedClass, setSelectedClass] = useState("3학년 1반");
    const [selectedUnitId, setSelectedUnitId] = useState("Unit 01");
    const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);
    const [isListOpen, setIsListOpen] = useState(false);

    // 3학년 1반~4반 가상 데이터셋 (노티싱 이론 및 인지적 격차 반영)
    const mockDatabase = {
        "3학년 1반": { // 중위권: 인지적 과부하 상태
            "Unit 01": [
                {
                    wordStats: [12, 10, 15, 12, 40, 92, 85, 78, 15, 10, 12, 10],
                    quizStats: { s1: 78, total: 45 },
                    students: [
                        { name: "김철수", steps: [true, true, true, true], guide: "✅ 모든 단계를 마스터했습니다. 심화 예문에 도전하세요." },
                        { name: "이영희", steps: [true, false, false, false], guide: "📉 구조는 보이지만 구문 조립이 미숙합니다. 2~3단계 배열 훈련을 강화하세요." },
                        { name: "박지민", steps: [false, false, false, false], guide: "⚠️ 문장 구조 파악이 선행되어야 합니다. 1단계 드래그를 다시 실시하세요." },
                        { name: "최다은", steps: [true, true, true, false], guide: "💡 구조 인지는 우수하나 영작 인출 훈련이 필요합니다. 4단계를 반복하세요." },
                        { name: "정민우", steps: [true, true, false, false], guide: "🧐 빈칸 채우기에서 병목이 발생합니다. 단어 문맥 파악에 집중하세요." }
                    ]
                }
            ]
        },
        "3학년 2반": { // 하위권: 구조 인지 부족
            "Unit 01": [
                {
                    wordStats: [8, 5, 10, 8, 15, 42, 35, 30, 8, 5, 10, 5],
                    quizStats: { s1: 42, total: 20 },
                    students: [
                        { name: "강호동", steps: [false, false, false, false], guide: "⚠️ 문장 구조 파악이 시급합니다. 핵심 구문(what)의 시작점을 찾는 연습을 하세요." },
                        { name: "유재석", steps: [true, false, false, false], guide: "🧐 단어는 인지하나 문장 성분 구분이 안 됩니다. 끊어 읽기 가이드를 활용하세요." },
                        { name: "신동엽", steps: [false, false, false, false], guide: "⚠️ 드래그 훈련부터 다시 시작하여 '의미 덩어리'를 찾는 감을 익히세요." },
                        { name: "이수근", steps: [true, true, false, false], guide: "💡 단어 배열 순서가 뒤섞입니다. 핵심 구문의 위치를 다시 확인하세요." },
                        { name: "김종국", steps: [true, false, false, false], guide: "📉 구문 파악력이 낮습니다. 관계대명사 what의 쓰임새를 복습하세요." }
                    ]
                }
            ]
        },
        "3학년 3반": { // 상위권: 우수 학급
            "Unit 01": [
                {
                    wordStats: [95, 92, 98, 90, 85, 99, 97, 95, 92, 90, 88, 95],
                    quizStats: { s1: 96, total: 92 },
                    students: [
                        { name: "안유진", steps: [true, true, true, true], guide: "✅ 완벽합니다! 원어민 속도의 리스닝 훈련과 연계해 보세요." },
                        { name: "장원영", steps: [true, true, true, true], guide: "✅ 모든 미션 성공. 관계대명사가 포함된 더 긴 문장에 도전하세요." },
                        { name: "카리나", steps: [true, true, true, true], guide: "✅ 정답률 100%입니다. 학급 내 멘토로서 친구들을 도와주세요." },
                        { name: "민지", steps: [true, true, true, true], guide: "✅ 구문 투시 능력이 뛰어납니다. 영작 디테일까지 완벽합니다." },
                        { name: "해린", steps: [true, true, true, true], guide: "✅ 훌륭합니다. 변형 예문에서도 실력을 발휘해 보세요." }
                    ]
                }
            ]
        },
        "3학년 4반": { // 중상위권: 인출 지연 상태
            "Unit 01": [
                {
                    wordStats: [40, 35, 45, 40, 50, 88, 82, 85, 35, 30, 40, 35],
                    quizStats: { s1: 85, total: 65 },
                    students: [
                        { name: "봉준호", steps: [true, true, true, false], guide: "💡 구조는 보이지만 영작 디테일이 부족합니다. 4단계 인출 훈련에 집중하세요." },
                        { name: "송강호", steps: [true, true, false, false], guide: "🧐 배열 단계에서 시간이 지체됩니다. 청크 단위 암기가 필요합니다." },
                        { name: "김혜수", steps: [true, true, true, true], guide: "✅ 안정적인 성취도입니다. 실수하지 않도록 꾸준히 관리하세요." },
                        { name: "조진웅", steps: [true, true, true, false], guide: "💡 문장 마무리가 미흡합니다. 시제와 수 일치 위주로 점검하세요." },
                        { name: "한지민", steps: [true, true, false, false], guide: "🧐 구문 조합 능력을 더 키워야 합니다. 3단계를 반복 수행하세요." }
                    ]
                }
            ]
        }
    };

    const currentUnitData = CURRICULUM.units.find(u => u.unit_id === selectedUnitId);
    const currentSentence = currentUnitData?.sentences[selectedSentenceIdx];
    const stats = mockDatabase[selectedClass]?.[selectedUnitId]?.[0] || { wordStats: [], quizStats: { s1: 0, total: 0 }, students: [] };
    const words = currentSentence?.english.split(' ') || [];

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "80px", fontFamily: "'Noto Sans KR', sans-serif" }}>
            <Header title="🔍 문장투시경 Admin" sub={`학생 관리 | ${selectedClass}`} />

            <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px" }}>
                {/* 1. 상단 대메뉴 탭 */}
                <div className="home-tabs" style={{ marginBottom: "32px" }}>
                    <button onClick={() => { window.location.href = 'main.html'; }} className="tab-item">1-1. 단원 선택</button>
                    <button onClick={() => { window.location.href = 'teacher_problem.html'; }} className="tab-item">1-2. 문제 관리</button>
                    <button className="tab-item active">1-3. 학생 관리</button>
                </div>

                {/* [복구] 2. 필터 바 (학급/단원 선택) */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px", background: "white", padding: "24px", borderRadius: "20px", border: "1.5px solid #e2e8f0" }}>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", fontWeight: 700 }}>
                        {["3학년 1반", "3학년 2반", "3학년 3반", "3학년 4반"].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select value={selectedUnitId} onChange={(e) => setSelectedUnitId(e.target.value)} style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", fontWeight: 700 }}>
                        {CURRICULUM.units.map(u => <option key={u.unit_id} value={u.unit_id}>{u.unit_id}. {u.title}</option>)}
                    </select>
                </div>

                {/* 3. 예문 선택 책갈피 탭 (간격 제거 및 밀착) */}
                <div style={{ display: "flex", gap: "0px", marginLeft: "0px" }}>
                    {[0, 1, 2, 3].map(idx => (
                        <button
                            key={idx}
                            onClick={() => setSelectedSentenceIdx(idx)}
                            style={{
                                padding: "14px 28px",
                                borderRadius: "12px 12px 0 0",
                                border: "1.5px solid #e2e8f0",
                                borderBottom: selectedSentenceIdx === idx ? "none" : "1.5px solid #e2e8f0",
                                borderLeft: idx !== 0 ? "none" : "1.5px solid #e2e8f0",
                                background: selectedSentenceIdx === idx ? "white" : "#f8fafc",
                                color: selectedSentenceIdx === idx ? "#1a3a5c" : "#94a3b8",
                                fontWeight: 900,
                                cursor: "pointer",
                                position: "relative",
                                top: "1.5px",
                                zIndex: selectedSentenceIdx === idx ? 10 : 1,
                                transition: "0.2s"
                            }}
                        >
                            예문 0{idx + 1}
                        </button>
                    ))}
                </div>

                {/* 4. 학급 성취도 카드 (좌상단 직각 처리) */}
                <div style={{
                    background: "white",
                    borderRadius: "0 32px 32px 32px",
                    padding: "40px",
                    border: "1.5px solid #e2e8f0",
                    marginBottom: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                    position: "relative",
                    zIndex: 5
                }}>
                    <h3 style={{ fontWeight: 950, fontSize: "20px", marginBottom: "32px", color: "#1e293b" }}>📊 학급 전체 성취도 (예문 0{selectedSentenceIdx + 1})</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginBottom: "32px" }}>
                        {words.map((w, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div style={{ padding: "14px 18px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: stats.wordStats[i] > 70 ? "#4f46e5" : "#fff", color: stats.wordStats[i] > 70 ? "#fff" : "#1e293b", fontWeight: 900, fontSize: "17px" }}>{w}</div>
                                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px", fontWeight: 700 }}>{stats.wordStats[i] || 0}%</div>
                            </div>
                        ))}
                    </div>
                    {/* AI 추천 가이드 (데이터 기반 자동 변경) */}
                    <div style={{ padding: "20px", background: "#f0f7ff", borderRadius: "16px", border: "1px solid #dbeafe", fontSize: "14px", fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: "10px" }}>
                        🤖 AI 추천: {stats.quizStats.s1 >= 70 && stats.quizStats.total < 50 ? "'인지적 과부하' 상태입니다. 구조는 보이지만 문장 조립 능력이 부족하니 청크 복습을 권장하세요." : "전반적으로 양호합니다. 오답률이 높은 구간을 짚어주세요."}
                    </div>
                </div>

                {/* 5. 개별 학생 상세 현황 (아코디언) */}
                <div style={{ background: "white", borderRadius: "32px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
                    <div onClick={() => setIsListOpen(!isListOpen)} style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: isListOpen ? "#f8fafc" : "white" }}>
                        <h3 style={{ fontWeight: 950, fontSize: "20px", color: "#1e293b", margin: 0 }}>👤 개별 학생 상세 현황 (5인)</h3>
                        <span style={{ fontSize: "24px", transform: isListOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>▼</span>
                    </div>
                    {isListOpen && (
                        <div style={{ padding: "0 40px 40px 40px", borderTop: "1.5px solid #f1f5f9" }}>
                            <div style={{ display: "flex", padding: "20px 0", borderBottom: "2px solid #f1f5f9", color: "#94a3b8", fontWeight: 800, fontSize: "13px", textAlign: "center" }}>
                                <div style={{ flex: 1, textAlign: "left" }}>이름</div>
                                <div style={{ flex: 2 }}>단계별 성취 (1~4단)</div>
                                <div style={{ flex: 3 }}>🤖 학습 강화 포인트 가이드</div>
                            </div>
                            {stats.students.map((s, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", padding: "24px 0", borderBottom: "1.2px solid #f1f5f9" }}>
                                    <div style={{ flex: 1, fontWeight: 800, fontSize: "16px" }}>{s.name}</div>
                                    <div style={{ flex: 2, display: "flex", justifyContent: "center", gap: "10px" }}>
                                        {s.steps.map((isOk, i) => (
                                            <span key={i} style={{ width: "34px", height: "34px", borderRadius: "8px", background: isOk ? "#dcfce7" : "#fef2f2", color: isOk ? "#166534" : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, border: isOk ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                                                {isOk ? "O" : "X"}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ flex: 3, fontSize: "14px", fontWeight: 700, color: "#1e3a8a", background: "#f0f7ff", padding: "14px 18px", borderRadius: "12px", border: "1px solid #dbeafe" }}>
                                        {s.guide}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);