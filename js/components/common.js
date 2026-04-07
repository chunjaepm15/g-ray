// 공통 UI 컴포넌트 라이브러리 (4인 협업용)
// UI/UX 담당자(팀원 4)가 총괄 관리합니다.

window.Header = ({ sub, isTeacher, onBack, title = "🔍 문장투시경" }) => (
    <div style={{ background: "#1a3a5c", color: "white", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onBack && <button onClick={onBack} style={{ background: "transparent", color: "white", fontSize: 24, padding: "0 8px", border: "none", cursor: "pointer" }}>←</button>}
            <span style={{ fontWeight: 800, fontSize: 20 }}>{title}</span>
            {sub && <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 12, marginLeft: 8 }}>{sub}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isTeacher && <span style={{ background: "#e67e22", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700 }}>🧑‍🏫 교사 모드</span>}
        </div>
    </div>
);

window.Badge = ({ children, color = "#eef2ff", text = "#4f46e5" }) => (
    <span style={{ background: color, color: text, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>{children}</span>
);
