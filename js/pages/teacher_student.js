const { useState } = React;

function App() {
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

    return (
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
            <Header sub="교사용 관리 센터" isTeacher={true} title="🔍 문장투시경 Admin" />
            <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
                <div className="home-tabs" style={{marginBottom: "40px"}}>
                    <button onClick={() => { window.location.href = 'main.html'; }} className="tab-item">1-1. 단원 선택</button>
                    <button onClick={() => { window.location.href = 'teacher_problem.html'; }} className="tab-item">1-2. 문제 관리</button>
                    <button className="tab-item active">1-3. 학생 결과</button>
                </div>
                <StudentResultsView />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
