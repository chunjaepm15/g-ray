const { useState, useEffect } = React;

function App() {
    const [screen, setScreen] = useState("HOME");
    const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole') || 'student');
    const isTeacher = userRole === 'teacher';

    const units = CURRICULUM.units.map((u, i) => ({
        id: u.unit_id,
        unit: `Unit ${i+1}`,
        title: u.title,
        tags: u.origin_tags,
        sentences: u.sentences
    }));

    const [homeTab, setHomeTab] = useState(isTeacher ? "UNIT_SELECT" : "TRAINING"); 
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [dragRange, setDragRange] = useState({ start: null, end: null });
    const [isDragging, setIsDragging] = useState(false);
    
    const [selectedClass, setSelectedClass] = useState("3학년 1반");
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

    // 활동 상태
    const [tries, setTries] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hintText, setHintText] = useState("");
    const [activityStatus, setActivityStatus] = useState("IDLE");

    // Similar questions states
    const [qIndex, setQIndex] = useState(0);
    const [qStatus, setQStatus] = useState("IDLE");
    const [qTries, setQTries] = useState(0);
    const [showConcept, setShowConcept] = useState(false);
    const [reorderPool, setReorderPool] = useState([]);
    const [reorderAnswer, setReorderAnswer] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [writeAnswer, setWriteAnswer] = useState("");
    const [showQ3Translation, setShowQ3Translation] = useState(false);
    const [visibleChunks, setVisibleChunks] = useState([]);
    const [q3ReadingDone, setQ3ReadingDone] = useState(false);
    const [q2Options, setQ2Options] = useState([]);
    const [q2CorrectOptionIndex, setQ2CorrectOptionIndex] = useState(0);

    const currentSentence = selectedUnit && selectedUnit.sentences && selectedUnit.sentences.length > (screen === "SIMILAR" ? qIndex : 0) ? selectedUnit.sentences[screen === "SIMILAR" ? qIndex : 0] : (selectedUnit?.sentences?.[0] || null);
    const words = currentSentence ? currentSentence.english.split(' ') : [];

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

    const generateStructure = (sentence) => {
        if (!sentence || !sentence.english) return { eng: "", kor: "", target: "", targetEnd: 1, ceng: "", v: "", obj: "" };
        if (sentence.syntax_chunks && sentence.syntax_chunks.length >= 2 && sentence.id && sentence.id.startsWith("REF-")) {
            const firstChunkWords = sentence.syntax_chunks[0].eng.trim().split(/\s+/).length;
            return {
                eng: sentence.english,
                kor: sentence.korean,
                target: sentence.syntax_chunks[0].eng,
                targetEnd: firstChunkWords - 1,
                ceng: '',
                v: sentence.syntax_chunks[1].eng,
                obj: sentence.syntax_chunks.slice(2).map(c => c.eng).join(' ')
            };
        }
        const w = sentence.english.split(' ');
        const mid = Math.floor(w.length/2);
        return { eng: sentence.english, kor: sentence.korean, target: w.slice(0, mid).join(' '), targetEnd: mid - 1, ceng: '', v: w.length>1 ? w[mid] : '', obj: w.slice(mid+1).join(' ') };
    };
    const structData = generateStructure(currentSentence);

    const CHUNK_DATA = {
        "L01-15": [ {"en": "Thanks to Antonio,", "ko": "Antonio 덕분에,"}, {"en": "the islanders", "ko": "섬 주민들은"}, {"en": "could get", "ko": "얻을 수 있었다"}, {"en": "what they needed.", "ko": "그들이 필요로 했던 것을.", "isTarget": true} ],
        "L01-17": [ {"en": "What the islanders here need", "ko": "여기 섬 주민들에게 필요한 것은", "isTarget": true}, {"en": "is", "ko": "이다"}, {"en": "not tools or books,", "ko": "도구나 책이 아니라,"}, {"en": "but cats.", "ko": "고양이다."} ],
        "L01-23": [ {"en": "That’s", "ko": "그것이 ~이다"}, {"en": "what I want", "ko": "내가 원하는 것", "isTarget": true}, {"en": "to show you.", "ko": "당신에게 보여주고 싶은."} ],
        "L01-28": [ {"en": "I visited", "ko": "나는 방문했다"}, {"en": "a local hospital", "ko": "지역 병원을"}, {"en": "last Sunday", "ko": "지난주 일요일에"}, {"en": "to help children.", "ko": "아이들을 돕기 위해.", "isTarget": true} ],
        "L01-29": [ {"en": "While I was there,", "ko": "내가 그곳에 있는 동안,"}, {"en": "I saw some people", "ko": "나는 몇몇 사람들이 ~하는 것을 보았다", "isTarget": true}, {"en": "helping each other.", "ko": "서로 돕고 있는."} ],
        "L01-30": [ {"en": "That’s what I want", "ko": "그것이 내가 원하는 것입니다", "isTarget": true}, {"en": "to show you today.", "ko": "오늘 당신에게 보여드리고 싶은."} ]
    };

    const getAnswerRange = () => {
        const chunks = CHUNK_DATA[currentSentence?.id];
        if (!chunks) return { start: 0, end: structData.targetEnd };
        let currentPos = 0;
        for (const chunk of chunks) {
            const chunkWords = chunk.en.trim().split(/\s+/).length;
            if (chunk.isTarget) return { start: currentPos, end: currentPos + chunkWords - 1 };
            currentPos += chunkWords;
        }
        return { start: 0, end: structData.targetEnd };
    };
    const answerRange = getAnswerRange();

    const getTranslation = (s, e) => {
        if (s === null) return "드래그를 통해 문장 덩어리(구문)를 선택해주세요.";
        const start = Math.min(s, e);
        const end = Math.max(s, e);
        const sentenceChunks = CHUNK_DATA[currentSentence?.id];
        if (!sentenceChunks) return `[해석 미리보기] "${words.slice(start, end + 1).join(' ')}"`;
        let matchedChunks = [];
        let currentPos = 0;
        for (const chunk of sentenceChunks) {
            const chunkWords = chunk.en.trim().split(/\s+/).length;
            const chunkStart = currentPos;
            const chunkEnd = currentPos + chunkWords - 1;
            if (start <= chunkStart && end >= chunkEnd) matchedChunks.push(chunk);
            else if ((start >= chunkStart && start <= chunkEnd) || (end >= chunkStart && end <= chunkEnd)) return <span style={{ opacity: 0.6 }}>[구조 분석 중...] 덩어리(Chunk)를 완성해보세요.</span>;
            currentPos += chunkWords;
        }
        if (matchedChunks.length > 0) return `[해석 미리보기] "${matchedChunks.map(c => c.en).join(' ')}" ➔ ${matchedChunks.map(c => c.ko).join(' ')}`;
        return <span style={{ opacity: 0.6 }}>[구조 분석 중...] 덩어리(Chunk)를 완성해보세요.</span>;
    };

    const handleWordAction = (i) => {
        if (activityStatus === "SUCCESS") return;
        if (dragRange.start === i && dragRange.end === i) setDragRange({ start: null, end: null });
        else if (dragRange.start === null) setDragRange({ start: i, end: i });
        else setDragRange(prev => ({ ...prev, end: i }));
        if (activityStatus === "WRONG") setActivityStatus("IDLE");
    };

    const handleCheck = () => {
        if (dragRange.start === null) return;
        const s = Math.min(dragRange.start, dragRange.end);
        const e = Math.max(dragRange.start, dragRange.end);
        if (s === answerRange.start && e === answerRange.end) {
            setActivityStatus("SUCCESS");
            setScreen("RESULT");
            return;
        }
        let hint = `✨ [AI 피드백] 이 문장에서 <${selectedUnit.title}> 핵심 패턴이 적용된 곳을 덩어리로 묶어야 합니다.`;
        setHintText(hint);
        setTries(prev => {
            const nextTries = prev + 1;
            if (nextTries >= 2) {
                setActivityStatus("WRONG");
                // 2번 틀리면 정답 공개 (답이 되는 드래그 범위 설정)
                setDragRange({ start: answerRange.start, end: answerRange.end });
                setTimeout(() => setScreen("RESULT"), 3500);
            } else {
                setActivityStatus("WRONG");
            }
            return nextTries;
        });
    };

    useEffect(() => {
        const sIndex = screen === "SIMILAR" ? qIndex : 0;
        if (selectedUnit && selectedUnit.sentences && selectedUnit.sentences.length > sIndex) {
            const s = selectedUnit.sentences[sIndex];
            if (s && s.english) {
                if (qIndex === 0) {
                    const wordsArr = s.english.split(' ');
                    const shuffled = [...wordsArr].sort(() => Math.random() - 0.5);
                    setReorderPool(shuffled);
                    setReorderAnswer([]);
                } else {
                    setWriteAnswer("");
                    setSelectedOption(null);
                }
                setActivityStatus("IDLE");
                setTries(0);
            }
        }
    }, [selectedUnit, qIndex, screen]);

    const handleQCheck = () => {
        const nextTries = qTries + 1;
        setQTries(nextTries);
        let isCorrect = false;
        if (qIndex === 0) {
            isCorrect = currentSentence && reorderAnswer.join(" ") === currentSentence.english;
        } else if (qIndex === 1) {
            isCorrect = selectedOption === q2CorrectOptionIndex;
        } else if (qIndex === 2) {
            isCorrect = writeAnswer.length > 5;
        }
        if (isCorrect) {
            setQStatus("SUCCESS");
        } else {
            setQStatus("WRONG");
            if (nextTries >= 2) {
                // 2번 틀리면 답안 공개
                if (qIndex === 0) {
                    setReorderAnswer(currentSentence.english.split(' '));
                    setReorderPool([]);
                } else if (qIndex === 1) {
                    setSelectedOption(q2CorrectOptionIndex);
                } else if (qIndex === 2) {
                    setWriteAnswer(currentSentence.english);
                }
                setTimeout(() => nextAction(), 3500);
            }
        }
    };

    const nextAction = () => {
        if (qIndex < 2) {
            setQIndex(prev => prev + 1);
            setQStatus("IDLE");
            setQTries(0);
            setShowConcept(false);
            setWriteAnswer("");
            setSelectedOption(null);
        } else {
            setScreen("DASHBOARD");
        }
    };

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

    if (screen === "HOME") return (
        <div>
            <Header isTeacher={isTeacher} sub={isTeacher ? "김수현 교사 (3학년 1반)" : "박지훈 학생"} title={isTeacher ? "🔍 문장투시경 Admin" : "🔍 문장투시경"} />
            <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 24px" }}>
                <div className="home-tabs">
                    {!isTeacher ? (
                        <button onClick={() => setHomeTab("TRAINING")} className={`tab-item ${homeTab === "TRAINING" ? 'active' : ''}`}>투시경 훈련</button>
                    ) : (
                        <>
                            <button onClick={() => setHomeTab("UNIT_SELECT")} className={`tab-item ${homeTab === "UNIT_SELECT" ? 'active' : ''}`}>1-1. 단원 선택</button>
                            <button onClick={() => { window.location.href = 'teacher_problem.html'; }} className={`tab-item`}>1-2. 문제 관리</button>
                            <button onClick={() => { window.location.href = 'teacher_student.html'; }} className={`tab-item`}>1-3. 학생 관리</button>
                        </>
                    )}
                </div>

                <div className="unit-grid">
                    {units.filter(u => isTeacher || activeUnits.includes(u.id)).map((u, idx) => (
                        <div key={u.id} className="unit-card" style={{ opacity: isTeacher && homeTab === "UNIT_SELECT" && !activeUnits.includes(u.id) ? 0.5 : 1 }}>
                            <div onClick={() => { if(!isTeacher || homeTab === "TRAINING") { setSelectedUnit(u); setScreen("ANALYSIS"); } }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 800, marginBottom: 8, letterSpacing: "1px" }}>{u.unit}</div>
                                    {isTeacher && homeTab === "UNIT_SELECT" && (
                                        <input 
                                            type="checkbox" 
                                            checked={activeUnits.includes(u.id)} 
                                            onChange={(e) => {
                                                if (e.target.checked) setActiveUnits([...activeUnits, u.id]);
                                                else setActiveUnits(activeUnits.filter(id => id !== u.id));
                                            }}
                                            style={{ width: "18px", height: "18px" }}
                                        />
                                    )}
                                </div>
                                <div style={{ fontSize: 17, fontWeight: 900, color: "#1a3a5c", lineHeight: 1.4, marginBottom: 12 }}>{u.title}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {u.tags.map(t => <Badge key={t}>{t}</Badge>)}
                                </div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: 13, fontWeight: 800, color: "#4f46e5", marginTop: 20, cursor: "pointer" }} onClick={() => { setSelectedUnit(u); setScreen("ANALYSIS"); }}>
                                시작하기 →
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (screen === "ANALYSIS") return (
        <div>
            <Header sub={selectedUnit.title} onBack={() => setScreen("HOME")} />
            <div style={{ maxWidth: 840, margin: "32px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 24, padding: "32px", border: "1.5px solid #e2e8f0", marginBottom: 20, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#1a3a5c", lineHeight: 1.5, marginBottom: 12 }}>{currentSentence ? currentSentence.english : ""}</div>
                    <div style={{ fontSize: 18, color: "#64748b", fontWeight: 500 }}>{currentSentence ? currentSentence.korean : ""}</div>
                </div>
                <details open>
                    <summary>🔍 문장 구조 투시</summary>
                    <div className="details-content" style={{ textAlign: "center", padding: "24px" }}>
                        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
                            <div style={{ flex: 3, border: "2.5px solid #4f46e5", borderRadius: 12, background: "#eef2ff", padding: "15px 5px", textAlign: "center" }}>
                                <div style={{ fontWeight: 800, color: "#4f46e5", fontSize: 14 }}>{structData.target}</div>
                                <div style={{ fontSize: 10, color: "#4f46e5", marginTop: 4 }}>Subject (S)</div>
                            </div>
                            <div style={{ flex: 1, border: "2.5px solid #64748b", borderRadius: 12, background: "#f8fafc", padding: "15px 5px", textAlign: "center" }}>
                                <div style={{ fontWeight: 800, color: "#64748b", fontSize: 15 }}>{structData.v}</div>
                                <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>Verb (V)</div>
                            </div>
                            <div style={{ flex: 2, border: "2.5px solid #b45309", borderRadius: 12, background: "#fffbeb", padding: "15px 5px", textAlign: "center" }}>
                                <div style={{ fontWeight: 800, color: "#b45309", fontSize: 14 }}>{structData.obj}</div>
                                <div style={{ fontSize: 10, color: "#b45309", marginTop: 4 }}>Complement (C)</div>
                            </div>
                        </div>
                    </div>
                </details>
                <details open>
                    <summary>📚 핵심 문법 개념 정리</summary>
                    <div className="details-content" style={{ padding: "24px" }}>
                        {grammarConcepts[selectedUnit.title] ? (
                            <>
                                <div style={{ background: "#f0f7ff", borderRadius: 16, padding: "20px", marginBottom: "24px", textAlign: "center", border: "1px solid #dbeafe" }}>
                                    <div style={{ fontSize: 16, color: "#1e40af", lineHeight: 1.8, fontWeight: 800 }}> {grammarConcepts[selectedUnit.title].rule}<br /> <small style={{ color: "#64748b", fontWeight: 500, fontSize: 13 }}>{grammarConcepts[selectedUnit.title].sub}</small> </div>
                                </div>
                                <div style={{ fontSize: 13, color: "#475569", lineHeight: 2.2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                    {grammarConcepts[selectedUnit.title].points.map((p, idx) => ( <div key={idx} style={{ background: "#f8fafc", padding: "10px", borderRadius: 8, fontWeight: 700 }}>{p}</div> ))}
                                </div>
                            </>
                        ) : ( <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>선택된 단원의 개념 정리가 준비 중입니다.</div> )}
                    </div>
                </details>
                <button onClick={() => setScreen("ACTIVITY")} style={{ width: "100%", padding: "22px", background: "#1a3a5c", color: "white", borderRadius: 20, fontWeight: 900, fontSize: 19, marginTop: 12, boxShadow: "0 6px 16px rgba(26,58,92,0.25)" }}>직접 한번 해보기 (투시 시작) →</button>
            </div>
        </div>
    );

    if (screen === "ACTIVITY") return (
        <div>
            <Header sub={selectedUnit.title} onBack={() => { setScreen("ANALYSIS"); setTries(0); setActivityStatus("IDLE"); setShowHint(false); setDragRange({start:null, end:null}); }} />
            <div style={{ maxWidth: 780, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
                    <div style={{ background: "#f1f5ff", padding: "20px", borderRadius: 16, fontSize: 16, marginBottom: 24, textAlign: "center", fontWeight: 800, color: "#2563eb", border: "1px solid #dbeafe" }}> 📌 <strong>{selectedUnit.title}</strong>에 해당하는 구문(덩어리) 전체를 찾아 마우스로 드래그하세요. </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", padding: "12px 0 24px 0" }} onMouseDown={() => { if (activityStatus !== "SUCCESS") setIsDragging(true); }} onMouseUp={() => setIsDragging(false)}>
                        {words.map((w, i) => {
                            const isInRange = dragRange.start !== null && i >= Math.min(dragRange.start, dragRange.end) && i <= Math.max(dragRange.start, dragRange.end);
                            return ( <div key={i} className={`word-btn ${isInRange ? 'word-selected' : ''}`} onClick={() => handleWordAction(i)} onMouseEnter={() => { if (isDragging) setDragRange(prev => ({ ...prev, end: i })); }}>{w}</div> );
                        })}
                    </div>
                    <div style={{ background: dragRange.start !== null ? "#1e293b" : "#f1f5f9", color: dragRange.start !== null ? "#fff" : "#94a3b8", transition: "0.3s", padding: "16px", borderRadius: 12, textAlign: "center", fontSize: 18, fontWeight: 800, minHeight: "24px", marginBottom: "32px" }}> {getTranslation(dragRange.start, dragRange.end)} </div>
                    {tries > 0 && <div style={{ textAlign: "center", marginBottom: 16 }}> <button onClick={() => setShowHint(true)} style={{ background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 600, color: "#4b5563" }}> 💡 힌트 보기 </button> </div>}
                    {tries >= 2 && (
                        <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "20px", color: "#92400e", fontSize: 15, marginBottom: 16 }}>
                            💡 <strong>오답 가이드</strong>: '{selectedUnit.title}'의 핵심은 정답에 해당하는 구문(chunk) 전체를 하나의 의미 마디로 포착하는 것입니다. ({hintText})
                        </div>
                    )}
                    {showHint && <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "24px", color: "#92400e", fontSize: 15, lineHeight: 1.6 }}>💡 힌트: {hintText}</div>}
                    <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                        <button onClick={handleCheck} style={{ flex: 2, padding: "20px", borderRadius: 18, background: "#1a3a5c", color: "white", fontWeight: 900, fontSize: 18 }}>{activityStatus === "SUCCESS" ? "결과 보기" : "투시 확인하기"}</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (screen === "RESULT") return (
        <div>
            <Header sub="결과 분석" onBack={() => { setScreen("HOME"); setTries(0); }} />
            <div style={{ maxWidth: 850, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 32, textAlign: "center", color: "#1a3a5c" }}>📊 우리 반 친구들의 포착 현황</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 40 }}>
                        {words.map((w, i) => {
                            const isCorrect = i >= answerRange.start && i <= answerRange.end;
                            return (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div style={{ padding: "14px 18px", borderRadius: 12, border: "1px solid #e2e8f0", background: isCorrect ? "#4f46e5" : "#fff", color: isCorrect ? "#fff" : "#334155", fontWeight: 900, fontSize: 18 }}>{w}</div>
                                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontWeight: 700 }}>{isCorrect ? '92%' : '12%'}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: "flex", gap: 14, marginTop: 32 }}>
                        <button onClick={() => { setScreen("HOME"); setTries(0); setActivityStatus("IDLE"); setDragRange({start:null, end:null}); }} style={{ flex: 1, padding: "20px", background: "#fff", border: "2.5px solid #1a3a5c", borderRadius: 20, fontWeight: 900, color: "#1a3a5c" }}>🏠 홈으로</button>
                        <button onClick={() => setScreen("SIMILAR")} style={{ flex: 2, padding: "20px", background: "#4f46e5", color: "white", borderRadius: 20, fontWeight: 900, fontSize: 18 }}>다음: 비슷한 예문 →</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (screen === "SIMILAR") return (
        <div>
            <Header sub={`문제 풀이 (${qIndex + 1}/3)`} onBack={() => setScreen("RESULT")} />
            <div style={{ maxWidth: 780, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                        <span style={{ color: "#94a3b8", fontWeight: 800 }}>{selectedUnit.title}</span>
                    </div>
                    {qIndex === 0 && (
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>📝 단어를 올바르게 재배치하세요.</div>
                            <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>{currentSentence ? currentSentence.korean : ""}</div>
                            <div className="dropzone" onClick={() => { if(qStatus==="SUCCESS") return; setReorderPool([...reorderPool, ...reorderAnswer]); setReorderAnswer([]); }}>
                                {reorderAnswer.map((w,i) => <div key={i} className="word-btn" style={{borderColor:"#4f46e5"}}>{w}</div>)}
                                {reorderAnswer.length === 0 && <span style={{ color: "#94a3b8" }}>이곳을 눌러 단어를 해제하세요</span>}
                            </div>
                            <div className="word-pool">
                                {reorderPool.map((w,i) => (
                                    <div key={i} className="word-btn" onClick={() => { if(qStatus!=="SUCCESS"){ setReorderAnswer([...reorderAnswer, w]); setReorderPool(reorderPool.filter((_,idx)=>idx!==i)); } }}>{w}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {qIndex === 1 && (
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>🧐 빈칸에 알맞은 단어를 고르세요.</div>
                            <div style={{ fontSize: 16, color: "#64748b", marginBottom: 16 }}>{currentSentence ? currentSentence.korean : ""}</div>
                            <div style={{ fontSize: 24, textAlign: "center", fontWeight: 700, margin: "24px 0" }}>
                                {currentSentence.english.split(' ').map((w, i) => i === Math.floor(currentSentence.english.split(' ').length/2) ? "____" : w).join(' ')}
                            </div>
                            {q2Options.map((opt, i) => (
                                <button key={i} className={`option-btn ${selectedOption === (i+1) ? 'selected' : ''}`} onClick={() => {if(qStatus!=="SUCCESS") setSelectedOption(i+1)}}>{i+1}. {opt}</button>
                            ))}
                        </div>
                    )}
                    {qIndex === 2 && (
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>⌨️ 해석을 보고 영문장을 완성하세요.</div>
                            <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>{currentSentence ? currentSentence.korean : ""}</div>
                            <input type="text" className="text-input" placeholder="영문을 작성하세요" value={writeAnswer} onChange={(e) => setWriteAnswer(e.target.value)} disabled={qStatus==="SUCCESS"} />
                        </div>
                    )}
                    <div style={{ marginTop: 32, minHeight: 90 }}>
                        {qStatus === "WRONG" && (
                            <div style={{ background: "#fef2f2", padding: "16px", borderRadius: 12, color: "#dc2626", fontWeight: 800, border: "1px solid #fee2e2" }}>
                                ❌ {qTries >= 2 ? "아쉽네요! 정답을 공개합니다." : "틀렸습니다. 다시 시도해 보세요."}
                                {qTries >= 2 && (
                                    <div style={{ marginTop: 10, fontSize: 14, color: "#991b1b", fontWeight: 500 }}>
                                        💡 <strong>오답 가이드</strong>: {selectedUnit.title} 패턴에 유의하세요. {qIndex === 1 ? "알맞은 접속사나 관계대명사 형태를 확인해보세요." : "문장의 전체적인 흐름을 다시 한번 파악하는 것이 중요합니다."}
                                    </div>
                                )}
                            </div>
                        )}
                        {qStatus === "SUCCESS" && <div style={{ background: "#ecfdf5", padding: "20px", borderRadius: 12, color: "#059669", fontWeight: 900, border: "1px solid #a7f3d0" }}>🎉 정답입니다!</div>}
                    </div>
                    <button onClick={qStatus === "SUCCESS" ? nextAction : handleQCheck} style={{ width: "100%", padding: "20px", background: "#1a3a5c", color: "white", borderRadius: 20, fontWeight: 900 }}>
                        {qStatus === "SUCCESS" ? (qIndex === 2 ? "완료하기" : "다음 문제") : "정답 확인"}
                    </button>
                </div>
            </div>
        </div>
    );

    if (screen === "DASHBOARD") return (
        <div>
            <Header sub="학습 결과" onBack={() => setScreen("HOME")} />
            <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}> <div style={{ fontSize: 56 }}>🏅</div> <div style={{ fontSize: 28, fontWeight: 900 }}>학습 완료!</div> </div>
                    <button onClick={() => { setScreen("HOME"); setQIndex(0); setQStatus("IDLE"); setActivityStatus("IDLE"); }} style={{ width: "100%", padding: "22px", background: "#1a3a5c", color: "white", borderRadius: 20, fontWeight: 900 }}>홈으로 돌아가기</button>
                </div>
            </div>
        </div>
    );

    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
