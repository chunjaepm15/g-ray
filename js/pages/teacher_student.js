const { useState, useEffect } = React;

// [공통 UI] Header 정의 (외부 common.js 미동작 시에도 화면이 뜨도록 보장)
const Header = ({ title, sub }) => (
    <div style={{ background: "#1a3a5c", padding: "20px 40px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 900, margin: 0 }}>{title}</h1>
        <span style={{ fontSize: "14px", opacity: 0.8, fontWeight: 500 }}>{sub}</span>
    </div>
);

function App() {
    // 1. 상태 관리 (학급, 단원, 문장 필터)
    const [selectedClass, setSelectedClass] = useState("3학년 1반");
    const [selectedUnitId, setSelectedUnitId] = useState("Unit 01");
    const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);

    // 2. 현실적인 학급별/문장별 가상 데이터셋 (노티싱 오답 패턴 반영)
    const mockDatabase = {
        "3학년 1반": {
            "Unit 01": [
                { wordStats: [12, 10, 15, 12, 40, 92, 85, 78, 15, 10, 12, 10], quizStats: { s1: 78, total: 45 } },
                { wordStats: [85, 80, 45, 40, 90, 88], quizStats: { s1: 65, total: 55 } }
            ]
        },
        "3학년 2반": { "Unit 01": [{ wordStats: [10, 8, 12, 10, 25, 60, 55, 45, 12, 10, 8, 5], quizStats: { s1: 52, total: 30 } }] },
        "3학년 3반": { "Unit 01": [{ wordStats: [98, 97, 95, 92, 88, 85, 82, 98], quizStats: { s1: 95, total: 88 } }] }, // 우수 학급
        "3학년 4반": { "Unit 01": [{ wordStats: [50, 55, 45, 42, 10, 12, 15, 48], quizStats: { s1: 35, total: 20 } }] }  // 취약 학급
    };

    // 데이터 추출 로직
    const currentUnitData = CURRICULUM.units.find(u => u.unit_id === selectedUnitId);
    const currentSentence = currentUnitData?.sentences[selectedSentenceIdx];
    const stats = mockDatabase[selectedClass]?.[selectedUnitId]?.[selectedSentenceIdx] || { wordStats: [], quizStats: { s1: 0, total: 0 } };
    const words = currentSentence?.english.split(' ') || [];

    // 3. AI 학습 처방 로직 (노티싱 이론 근거)
    const getAIRecommendation = (stats) => {
        const { s1, total } = stats.quizStats;

        // 1. 최하위권: 구조 인지 자체가 불가능한 상태
        if (s1 < 50) {
            return "⚠️ 학급의 절반 이상이 구조 인지에 실패했습니다. 개념 설명 후 1단계(드래그) 재훈련을 권장합니다.";
        }
        // 2. 인지적 과부하: 구조는 어느 정도 보이나(70%대), 실제 쓰기에서 완전히 무너짐 (40%대)
        // 원민식님이 말씀하신 78%, 45% 구간이 바로 여기입니다.
        else if (s1 >= 70 && total < 50) {
            return "📉 '인지적 과부하' 상태입니다. 구조는 보이지만 문장 조립 능력이 부족하니, 핵심 청크(Chunk) 단위로 끊어 쓰는 연습을 반복하세요.";
        }
        // 3. 중위권 정체: 구조 인지와 응용력이 모두 50~70% 사이에서 맴도는 경우
        else if (s1 < 80 && total < 70) {
            return "🧐 중위권 학생들이 정체된 구간입니다. 오답률이 높은 특정 단어 구간(빨간색)의 문법적 역할을 다시 짚어주세요.";
        }
        // 4. 인출 지연: 구조는 완벽하나(80%+) 응용력이 조금 아쉬운 경우
        else if (s1 >= 80 && total < 80) {
            return "💡 구조 파악은 완벽합니다! 다만 단어 철자나 시제 등 세부 인출(Output) 능력을 키우기 위한 첨삭 지도가 필요합니다.";
        }
        // 5. 고득점 완성: 목표 성취도 도달
        else if (s1 >= 80 && total >= 80) {
            return "✅ 목표 성취도에 도달했습니다! 다음 유닛으로 넘어가거나 더 긴 복합 문장에 도전해도 좋습니다.";
        }

        // 6. 예외 케이스 (데이터 부족 등)
        return "📊 학습 데이터가 수집 중입니다. 더 많은 학생이 참여하면 정교한 AI 분석이 제공됩니다.";
    };
    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc", paddingBottom: "80px", fontFamily: "'Noto Sans KR', sans-serif" }}>
            <Header title="🔍 문장투시경 Admin" sub={`학습 데이터 센터 | ${selectedClass}`} />

            <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px" }}>
                {/* 탭 메뉴 */}
                <div className="home-tabs" style={{ marginBottom: "40px" }}>
                    <button onClick={() => { window.location.href = 'main.html'; }} className="tab-item">1-1. 단원 선택</button>
                    <button onClick={() => { window.location.href = 'teacher_problem.html'; }} className="tab-item">1-2. 문제 관리</button>
                    <button className="tab-item active">1-3. 학급 결과</button>
                </div>

                {/* 필터 바 (학급/단원/문장) */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px", background: "white", padding: "24px", borderRadius: "20px", border: "1.5px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#64748b", marginBottom: "8px" }}>학급 선택</label>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", fontWeight: 700, cursor: "pointer" }}>
                            {["3학년 1반", "3학년 2반", "3학년 3반", "3학년 4반"].map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1.5 }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#64748b", marginBottom: "8px" }}>단원 선택</label>
                        <select value={selectedUnitId} onChange={(e) => setSelectedUnitId(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", fontWeight: 700, cursor: "pointer" }}>
                            {CURRICULUM.units.map(u => <option key={u.unit_id} value={u.unit_id}>{u.unit_id}. {u.title}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 900, color: "#64748b", marginBottom: "8px" }}>문장 선택</label>
                        <select value={selectedSentenceIdx} onChange={(e) => setSelectedSentenceIdx(Number(e.target.value))} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #f1f5f9", fontWeight: 700, cursor: "pointer" }}>
                            {currentUnitData?.sentences.map((s, i) => <option key={i} value={i}>S{i + 1}: {s.english.substring(0, 30)}...</option>)}
                        </select>
                    </div>
                </div>

                {/* 분석 결과 카드 */}
                <div style={{ background: "white", borderRadius: "32px", padding: "48px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                    <h3 style={{ textAlign: "center", fontWeight: 950, fontSize: "22px", marginBottom: "40px", color: "#1e293b" }}>📊 우리 반 친구들의 포착 현황</h3>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center", marginBottom: "40px" }}>
                        {words.map((w, i) => {
                            const accuracy = stats.wordStats[i] || 0;
                            const isHighlight = accuracy > 70;
                            return (
                                <div key={i} style={{ textAlign: "center", minWidth: "75px" }}>
                                    <div style={{ padding: "18px 12px", borderRadius: "16px", background: isHighlight ? "#4f46e5" : "#ffffff", color: isHighlight ? "#ffffff" : "#1e293b", border: isHighlight ? "none" : "1.5px solid #e2e8f0", fontWeight: 900, fontSize: "18px", marginBottom: "8px" }}>{w}</div>
                                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>{accuracy}%</div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: "flex", gap: "24px", paddingTop: "32px", borderTop: "1.5px solid #f1f5f9", marginBottom: "32px" }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#94a3b8", marginBottom: "8px" }}>1단계: 구문 드래그 정답률</div>
                            <div style={{ fontSize: "40px", fontWeight: 950, color: "#1a3a5c" }}>{stats.quizStats.s1}%</div>
                        </div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#94a3b8", marginBottom: "8px" }}>2~4단계: 종합 완성도</div>
                            <div style={{ fontSize: "40px", fontWeight: 950, color: "#4f46e5" }}>{stats.quizStats.total}%</div>
                        </div>
                    </div>

                    {/* [신규] AI 추천 가이드 섹션 */}
                    <div style={{ padding: "24px", background: "#f0f7ff", borderRadius: "16px", border: "1px solid #dbeafe", display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ fontSize: "24px" }}>🤖</div>
                        <div>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e40af", marginBottom: "4px" }}>AI 학습 처방 가이드</div>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: "#1e3a8a", lineHeight: 1.5 }}>
                                {getAIRecommendation(stats)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);