// 공통 UI 컴포넌트 라이브러리 (G-ray Design System v14)
window.Header = ({ sub, isTeacher, onBack, title = "🔍 문장투시경" }) => (
    <div style={{ background: "var(--navy)", color: "white", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onBack && <button onClick={onBack} style={{ background: "transparent", color: "white", fontSize: 24, padding: "0 8px", border: "none", cursor: "pointer" }}>←</button>}
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.5px" }}>{title}</span>
            {sub && <span style={{ padding: "4px 12px", background: "rgba(255,255,255,0.12)", borderRadius: 20, fontSize: 12, marginLeft: 8, fontWeight: 700 }}>{sub}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isTeacher && <span style={{ background: "var(--sky)", borderRadius: 20, padding: "6px 16px", fontSize: 11, fontWeight: 900, textTransform: "uppercase" }}>🧑‍🏫 교사 모드</span>}
        </div>
    </div>
);

window.Badge = ({ children, color = "var(--sky-pale)", text = "var(--sky)" }) => (
    <span style={{ background: color, color: text, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 900, border: "1px solid var(--sky-lt)" }}>{children}</span>
);
