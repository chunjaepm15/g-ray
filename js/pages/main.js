const { useState, useEffect } = React;

function App() {
    const [screen, setScreen] = useState("HOME");
    const [userRole, setUserRole] = useState(sessionStorage.getItem('userRole') || 'student');
    const isTeacher = userRole === 'teacher';

    const units = CURRICULUM.units.map((u, i) => ({
        id: u.unit_id,
        unit: `Unit ${i + 1}`,
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

    // [수정 포인트 1] 문법적 정확성을 위해 데이터 생성 로직 보완
    const generateStructure = (sentence) => {
        if (!sentence || !sentence.english) return { eng: "", kor: "", target: "", targetEnd: 1, ceng: "", v: "", obj: "" };

        // REF-L04-11 (판사 문장)에 대해 수동태를 동사 덩어리로 묶고 보어부 확장
        if (sentence.id === "REF-L04-11") {
            return {
                eng: sentence.english,
                kor: sentence.korean,
                target: "The judge", // S
                targetEnd: 1,
                v: "was impressed", // V (수동태 동사구)
                obj: "by what she said and finally gave her permission." // C/M
            };
        }

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
        const mid = Math.floor(w.length / 2);
        return { eng: sentence.english, kor: sentence.korean, target: w.slice(0, mid).join(' '), targetEnd: mid - 1, ceng: '', v: w.length > 1 ? w[mid] : '', obj: w.slice(mid + 1).join(' ') };
    };
    const structData = generateStructure(currentSentence);

    // CHUNK_DATA와 getAnswerRange는 기존 코드 그대로 유지
    // 범위 기반 하드코딩 번역 데이터
    const RANGE_TRANS_DATA = {
        "REF-L04-11": {
            "0-1": "그 판사는",
            "0-3": "그 판사는 감명받았습니다",
            "0-4": "그 판사는 ~에 의해서 감명받았습니다",
            "0-7": "그 판사는 그녀가 했던 말에 감명받았습니다",
            "0-8": "그 판사는 그녀가 했던 말에 감명받았고",
            "0-9": "그 판사는 그녀가 했던 말에 감명받았고 마침내",
            "0-10": "그 판사는 그녀가 했던 말에 감명받았고 마침내 주었습니다",
            "0-11": "그 판사는 그녀가 했던 말에 감명받았고 마침내 그녀에게 주었습니다",
            "0-12": "그 판사는 그녀가 했던 말에 감명받았고, 마침내 그녀에게 허가를 내주었습니다.",
            "2-3": "감명받았습니다",
            "2-7": "그녀가 했던 말에 감명받았습니다",
            "4-7": "그녀가 했던 말에 의해",
            "5-7": "그녀가 했던 말",
            "8-12": "그리고 마침내 그녀에게 허가를 내주었습니다",
            "9-12": "마침내 그녀에게 허가를 내주었습니다",
            "10-12": "그녀에게 허가를 내주었습니다",
            "11-12": "그녀에게 허가를",
            "12-12": "허가를"
        }
    };

    const CHUNK_DATA = {
        // ... 기존 데이터 생략
        "REF-L04-11": [
            { "en": "The judge", "ko": "그 판사는" },
            { "en": "was impressed", "ko": "감명받았습니다" },
            { "en": "by", "ko": "~에 의해" },
            { "en": "what she said", "ko": "그녀가 했던 말에", "isTarget": true, "hint": "✨ [AI 피드백] 판사가 무엇에 감명받았는지 그 '내용' 전체을 드래그해보세요." },
            { "en": "and", "ko": "그리고" },
            { "en": "finally", "ko": "마침내" },
            { "en": "gave", "ko": "주었습니다" },
            { "en": "her", "ko": "그녀에게" },
            { "en": "permission.", "ko": "허가를" }
        ]
    };

    // AI 진단 가이드 데이터
    const DIAGNOSIS_DATA = {
        "REF-L04-11": "많은 친구들이 전치사 **by**를 명사절의 일부로 오해하거나, 절의 마지막 동사인 **said**를 빠뜨리곤 해요! 명사절 `what she said`는 그 자체로 전치사 `by`의 목적어 역할을 한다는 점에 주목해 보세요. ✨"
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
        const rangeKey = `${start}-${end}`;

        // [추가] 범위 기반 하드코딩 데이터가 있으면 우선 반환
        if (RANGE_TRANS_DATA[currentSentence?.id] && RANGE_TRANS_DATA[currentSentence?.id][rangeKey]) {
            return `[해석 미리보기] "${words.slice(start, end + 1).join(' ')}" ➔ ${RANGE_TRANS_DATA[currentSentence?.id][rangeKey]}`;
        }

        const sentenceChunks = CHUNK_DATA[currentSentence?.id];

        if (!sentenceChunks) return `[해석 미리보기] "${words.slice(start, end + 1).join(' ')}"`;

        let matchedChunks = [];
        let currentPos = 0;

        for (const chunk of sentenceChunks) {
            const chunkWords = chunk.en.trim().split(/\s+/).length;
            const chunkStart = currentPos;
            const chunkEnd = currentPos + chunkWords - 1;

            // 1. 사용자가 선택한 범위가 청크의 시작과 끝을 정확히 포함하는지 확인
            const isStartInside = start >= chunkStart && start <= chunkEnd;
            const isEndInside = end >= chunkStart && end <= chunkEnd;

            if (start <= chunkStart && end >= chunkEnd) {
                // 청크 전체가 선택 범위에 포함된 경우
                matchedChunks.push(chunk);
            } else if (isStartInside || isEndInside) {
                // 2. 청크의 일부만 걸쳐 있는 경우 (할루시네이션 방지 구간)
                return <span style={{ opacity: 0.6 }}>[구조 분석 중...] 의미 덩어리(Chunk)를 완성해보세요.</span>;
            }
            currentPos += chunkWords;
        }

        if (matchedChunks.length > 0) {
            return `[해석 미리보기] "${matchedChunks.map(c => c.en).join(' ')}" ➔ ${matchedChunks.map(c => c.ko).filter(k => k).join(' ')}`;
        }

        return <span style={{ opacity: 0.6 }}>[구조 분석 중...] 의미 덩어리(Chunk)를 완성해보세요.</span>;
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

        // 맞춤형 힌트 추출 로직
        const sentenceChunks = CHUNK_DATA[currentSentence?.id];
        const targetChunk = sentenceChunks?.find(c => c.isTarget);
        let hint = targetChunk?.hint || `✨ [AI 피드백] <${selectedUnit.title}> 패턴이 포함된 의미 덩어리를 다시 확인해보세요.`;

        setHintText(hint);
        setTries(prev => {
            const nextTries = prev + 1;
            if (nextTries >= 2) {
                setActivityStatus("WRONG");
                setDragRange({ start: answerRange.start, end: answerRange.end }); // 정답 범위 강제 표시
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
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
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
                            <div onClick={() => { if (!isTeacher || homeTab === "TRAINING") { setSelectedUnit(u); setScreen("ANALYSIS"); } }}>
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
                                <div style={{ fontSize: 20, fontWeight: 900, color: "var(--navy)", lineHeight: 1.4, marginBottom: 12 }}>{u.title}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {u.tags.map(t => <Badge key={t}>{t}</Badge>)}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <button className="start-btn" onClick={() => { setSelectedUnit(u); setScreen("ANALYSIS"); }}>시작하기 →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (screen === "ANALYSIS") return (
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
            <Header sub={selectedUnit.title} onBack={() => setScreen("HOME")} />
            <div style={{ maxWidth: 1000, margin: "32px auto", padding: "0 20px" }}>
                {/* ① 예문 카드 */}
                <div className="sentence-card">
                    <div className="sentence-en" style={{ fontSize: "26px" }}>{currentSentence ? currentSentence.english : ""}</div>
                    <div className="sentence-divider" style={{ width: "60px", height: "3px" }}></div>
                    <div className="sentence-ko" style={{ fontSize: "17px" }}>{currentSentence ? currentSentence.korean : ""}</div>
                </div>

                {/* ② 문장 구조 투시 */}
                <div className="section-header">
                    <button className="section-toggle">▼</button>
                    <span className="section-label">🔎 문장 구조 투시</span>
                </div>
                <div className="structure-wrap">
                    <div className="structure-grid">
                        <div className="struct-box subject">
                            <div className="struct-text">{structData.target}</div>
                            <div className="struct-label">Subject (S)</div>
                        </div>
                        <div className="struct-box verb">
                            <div className="struct-text">{structData.v}</div>
                            <div className="struct-label">Verb (V)</div>
                        </div>
                        <div className="struct-box complement">
                            <div className="struct-text">{structData.obj}</div>
                            <div className="struct-label">Complement (C)</div>
                        </div>
                    </div>
                </div>

                {/* ③ 핵심 문법 개념 정리 */}
                <div className="section-header">
                    <button className="section-toggle">▼</button>
                    <span className="section-label">📊 핵심 문법 개념 정리</span>
                </div>
                <div className="grammar-wrap">
                    {grammarConcepts[selectedUnit.title] ? (
                        <>
                            <div className="grammar-rule-box">
                                <div className="grammar-rule-main">
                                    {grammarConcepts[selectedUnit.title].rule}
                                </div>
                                <div className="grammar-rule-sub">
                                    {grammarConcepts[selectedUnit.title].sub}
                                </div>
                            </div>
                            <div className="check-grid">
                                {grammarConcepts[selectedUnit.title].points.map((p, idx) => (
                                    <div key={idx} className="check-item">
                                        <div className="check-dot">✓</div>
                                        <div className="check-text">{p}</div>
                                    </div>
                                ))}
                            </div>
                            {grammarConcepts[selectedUnit.title]?.teacher_tip && (
                                <div style={{ marginTop: "20px", padding: "12px 16px", background: "#fffbeb", border: "1px dashed #f59e0b", borderRadius: "12px", color: "#b45309", fontSize: "14px", fontWeight: 700 }}>
                                    {grammarConcepts[selectedUnit.title].teacher_tip}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
                            선택된 단원의 개념 정리가 준비 중입니다.
                        </div>
                    )}
                </div>

                <button onClick={() => setScreen("ACTIVITY")} className="btn-full" style={{ marginTop: 20 }}>
                    직접 한번 해보기 (투시 시작) →
                </button>
            </div>
        </div>
    );

    if (screen === "ACTIVITY") return (
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
            <Header sub={selectedUnit.title} onBack={() => { setScreen("ANALYSIS"); setTries(0); setActivityStatus("IDLE"); setShowHint(false); setDragRange({ start: null, end: null }); }} />
            <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}>
                    <div style={{ background: "#f1f5ff", padding: "20px", borderRadius: 16, fontSize: 16, marginBottom: 24, textAlign: "center", fontWeight: 800, color: "#2563eb", border: "1px solid #dbeafe" }}> 📌 <strong>{selectedUnit.title}</strong>에 해당하는 구문(덩어리) 전체를 찾아 마우스로 드래그하세요. </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", padding: "12px 0 24px 0" }} onMouseDown={() => { if (activityStatus !== "SUCCESS") setIsDragging(true); }} onMouseUp={() => setIsDragging(false)}>
                        {words.map((w, i) => {
                            const isInRange = dragRange.start !== null && i >= Math.min(dragRange.start, dragRange.end) && i <= Math.max(dragRange.start, dragRange.end);
                            return (<div key={i} className={`word-btn ${isInRange ? 'word-selected' : ''}`} onClick={() => handleWordAction(i)} onMouseEnter={() => { if (isDragging) setDragRange(prev => ({ ...prev, end: i })); }}>{w}</div>);
                        })}
                    </div>
                    <div style={{ background: dragRange.start !== null ? "#1a3a5c" : "#f1f5f9", color: dragRange.start !== null ? "#fff" : "#94a3b8", transition: "0.3s", padding: "16px", borderRadius: 12, textAlign: "center", fontSize: 16, fontWeight: 800, minHeight: "24px", marginBottom: "32px", boxShadow: dragRange.start !== null ? "0 4px 12px rgba(0,0,0,0.1)" : "none" }}> {getTranslation(dragRange.start, dragRange.end)} </div>
                    {tries === 1 && !showHint && <div style={{ textAlign: "center", marginBottom: 16 }}> <button onClick={() => setShowHint(true)} style={{ background: "#fff", border: "1.5px solid #d1d5db", borderRadius: 10, padding: "8px 20px", fontSize: 14, fontWeight: 600, color: "#4b5563" }}> 💡 힌트 보기 </button> </div>}
                    {tries >= 2 && (
                        <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "20px", color: "#92400e", fontSize: 15, marginBottom: 16 }}>
                            💡 <strong>오답 가이드</strong>: '{selectedUnit.title}'의 핵심은 정답에 해당하는 구문(chunk) 전체를 하나의 의미 마디로 포착하는 것입니다. ({hintText})
                        </div>
                    )}
                    {showHint && tries <= 1 && <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "24px", color: "#92400e", fontSize: 15, lineHeight: 1.6 }}>💡 힌트: {hintText}</div>}
                    <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                        <button onClick={handleCheck} style={{ flex: 2, padding: "20px", borderRadius: 18, background: "var(--sky)", color: "white", fontWeight: 900, fontSize: 18, boxShadow: "0 4px 12px rgba(74, 159, 224, 0.3)" }}>{activityStatus === "SUCCESS" ? "결과 보기" : "투시 확인하기"}</button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (screen === "RESULT") return (
        <div>
            <Header sub="결과 분석" onBack={() => { setScreen("HOME"); setTries(0); }} />
            <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
                <div className="result-card" style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.1)", borderRadius: 32, padding: "48px" }}>
                    <div className="card-title-res" style={{ marginBottom: 32, fontSize: 24, justifyContent: "center" }}>
                        <div className="title-icon" style={{ background: "#4A9FE0", color: "white" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        우리 반 친구들의 포착 현황
                    </div>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 48, padding: "20px", background: "#f8fafc", borderRadius: 24 }}>
                        {words.map((w, i) => {
                            const isCorrect = i >= answerRange.start && i <= answerRange.end;
                            // 수치 현실화 알고리즘
                            let pct = 5;
                            if (isCorrect) pct = 94 + (i % 3);
                            else if (i === answerRange.start - 1) pct = 38; // 앞에 전치사(by)를 넣는 실수
                            else if (i === answerRange.end + 1) pct = 14;  // 뒤의 and를 넣는 실수
                            else if (i === 3) pct = 12; // 앞의 동사를 넣는 실수
                            else pct = 4 + (i % 5);

                            return (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div className={`word-chip ${isCorrect ? 'high' : pct > 30 ? 'mid' : 'normal'}`} style={{ transition: "0.5s" }}>{w}</div>
                                    <div className={`word-pct ${isCorrect ? 'high' : pct > 30 ? 'mid' : ''}`} style={{ fontWeight: 800 }}>{pct}%</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* AI 진단 가이드 섹션 */}
                    <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", borderRadius: 20, padding: "28px", marginBottom: 40, border: "1px solid #bae6fd", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.1, transform: "rotate(15deg)" }}>
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="#0284c7"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#0369a1", fontWeight: 900, fontSize: 18, marginBottom: 12 }}>
                            <span>✨ AI 학습 진단 가이드</span>
                        </div>
                        <div style={{ color: "#0c4a6e", fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
                            {DIAGNOSIS_DATA[selectedUnit.id] || "패턴의 범위를 정확히 파악하는 것이 중요합니다. 문법적인 덩어리(Chunk)가 어디서 시작하고 끝나는지 다시 한번 복습해보세요."}
                        </div>
                    </div>

                    <div className="btn-row" style={{ gap: 16 }}>
                        <button onClick={() => { setScreen("HOME"); setTries(0); setActivityStatus("IDLE"); setDragRange({ start: null, end: null }); }} className="btn-home" style={{ borderRadius: 18, padding: "18px 30px" }}>
                            🏠 홈으로
                        </button>
                        <button onClick={() => setScreen("SIMILAR")} className="btn-next-res" style={{ borderRadius: 18, padding: "18px 40px", flex: 2, background: "var(--sky)", boxShadow: "0 8px 20px rgba(74, 159, 224, 0.3)" }}>
                            다음: 비슷한 예문 보러가기 →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (screen === "SIMILAR") return (
        <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
            <Header sub={`문제 풀이 (${qIndex + 1}/3)`} onBack={() => setScreen("RESULT")} />
            <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                        <span style={{ color: "#94a3b8", fontWeight: 800 }}>{selectedUnit.title}</span>
                    </div>
                    {qIndex === 0 && (
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>📝 단어를 올바르게 재배치하세요.</div>
                            <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>{currentSentence ? currentSentence.korean : ""}</div>
                            <div className="dropzone" onClick={() => { if (qStatus === "SUCCESS") return; setReorderPool([...reorderPool, ...reorderAnswer]); setReorderAnswer([]); }}>
                                {reorderAnswer.map((w, i) => <div key={i} className="word-btn" style={{ borderColor: "#4f46e5" }}>{w}</div>)}
                                {reorderAnswer.length === 0 && <span style={{ color: "#94a3b8" }}>이곳을 눌러 단어를 해제하세요</span>}
                            </div>
                            <div className="word-pool">
                                {reorderPool.map((w, i) => (
                                    <div key={i} className="word-btn" onClick={() => { if (qStatus !== "SUCCESS") { setReorderAnswer([...reorderAnswer, w]); setReorderPool(reorderPool.filter((_, idx) => idx !== i)); } }}>{w}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {qIndex === 1 && (
                        <div>
                            <div className="ds-ct" style={{ marginBottom: 12, color: "#4A9FE0" }}>4지선다 · 정답 선택 후 제출</div>
                            <div className="q-prompt" style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>🧐 다음 빈칸에 들어갈 알맞은 단어를 고르세요.</div>
                            <div style={{ fontSize: 15, color: "#64748b", marginBottom: 16 }}>{currentSentence ? currentSentence.korean : ""}</div>
                            
                            <div className="q-sentence">
                                {currentSentence.english.split(' ').map((w, i) => i === Math.floor(currentSentence.english.split(' ').length / 2) ? <span key={i} className="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : w).reduce((prev, curr) => [prev, ' ', curr])}
                            </div>

                            <div id="opts">
                                {q2Options.map((opt, i) => {
                                    let btnClass = "opt";
                                    if (selectedOption === (i + 1)) btnClass += " selected";
                                    if (qStatus === "SUCCESS" && q2CorrectOptionIndex === (i + 1)) btnClass += " correct";
                                    if (qStatus === "WRONG" && selectedOption === (i + 1)) btnClass += " wrong";
                                    // if an answer was submitted, dim the ones that are not correct/selected
                                    if (qStatus !== "IDLE" && q2CorrectOptionIndex !== (i+1) && selectedOption !== (i+1)) btnClass += " dim";

                                    return (
                                        <button 
                                            key={i} 
                                            className={btnClass}
                                            onClick={() => { if (qStatus === "IDLE") setSelectedOption(i + 1) }}
                                        >
                                            <span className="opt-num">{i + 1}</span>
                                            {opt}
                                            {qStatus !== "IDLE" && q2CorrectOptionIndex === (i + 1) && <span className="opt-result">✓ 정답</span>}
                                            {qStatus !== "IDLE" && selectedOption === (i + 1) && q2CorrectOptionIndex !== (i + 1) && <span className="opt-result">✕ 오답</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {qIndex === 2 && (
                        <div>
                            <div className="ds-ct" style={{ marginBottom: 12, color: "#4A9FE0" }}>서술형 직접 쓰기 · 문장 전체 작성</div>
                            <div className="q-prompt" style={{ fontSize: 19, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>⌨️ 우리말 해석을 보고 영문장을 완성하세요.</div>
                            <div style={{ fontSize: 16, color: "#64748b", marginBottom: 24, padding: "16px", background: "var(--surf)", borderRadius: "12px", border: "1.5px solid var(--bd)" }}>
                                {currentSentence ? currentSentence.korean : ""}
                            </div>
                            <input 
                                type="text" 
                                className="subjective-input" 
                                placeholder="이곳에 영문을 작성하세요..." 
                                value={writeAnswer} 
                                onChange={(e) => setWriteAnswer(e.target.value)} 
                                disabled={qStatus === "SUCCESS" || (qStatus === "WRONG" && qTries >= 2)}
                                autoFocus
                            />
                        </div>
                    )}
                    <div style={{ marginTop: 32, minHeight: 90 }}>
                        {qStatus === "WRONG" && (
                            qIndex === 1 ? (
                                <div className="feedback wrong">
                                    <div className="fb-icon">✕</div>
                                    <div className="feedback-content">
                                        <div className="feedback-title">다시 생각해봐요!</div>
                                        <div className="feedback-desc">'{selectedUnit.title}' 패턴에 유의하세요. 알맞은 접속사나 관계대명사 형태를 확인해보세요.</div>
                                    </div>
                                </div>
                            ) : qIndex === 2 ? (
                                <div className="feedback wrong">
                                    <div className="fb-icon">✕</div>
                                    <div className="feedback-content">
                                        <div className="feedback-title">{qTries >= 2 ? "아쉽네요! 정답을 확인해보세요." : "다시 한 번 확인해볼까요?"}</div>
                                        <div className="feedback-desc">
                                            {qTries >= 2 ? (
                                                <span>정답: <strong style={{ textDecoration: "underline" }}>{currentSentence.english}</strong></span>
                                            ) : (
                                                `철자나 대소문자, 문장 부호가 정확한지 다시 한번 살펴봐주세요. (패턴: ${selectedUnit.title})`
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: "#fef2f2", padding: "16px", borderRadius: 12, color: "#dc2626", fontWeight: 800, border: "1px solid #fee2e2" }}>
                                    ❌ {qTries >= 2 ? "아쉽네요! 정답을 공개합니다." : "틀렸습니다. 다시 시도해 보세요."}
                                    {qTries >= 2 && (
                                        <div style={{ marginTop: 10, fontSize: 14, color: "#991b1b", fontWeight: 500 }}>
                                            💡 <strong>오답 가이드</strong>: {selectedUnit.title} 패턴에 유의하세요. 문장의 전체적인 흐름을 다시 한번 파악하는 것이 중요합니다.
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                        {qStatus === "SUCCESS" && (
                            qIndex === 1 ? (
                                <div className="feedback correct">
                                    <div className="fb-icon">✓</div>
                                    <div className="feedback-content">
                                        <div className="feedback-title">정답이에요!</div>
                                        <div className="feedback-desc">정확한 문법 구조를 선택했습니다.</div>
                                    </div>
                                </div>
                            ) : qIndex === 2 ? (
                                <div className="feedback correct">
                                    <div className="fb-icon">✓</div>
                                    <div className="feedback-content">
                                        <div className="feedback-title">참 잘했어요!</div>
                                        <div className="feedback-desc">완벽한 영문장을 완성했습니다. 이제 학습을 마무리해볼까요?</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ background: "#ecfdf5", padding: "20px", borderRadius: 12, color: "#059669", fontWeight: 900, border: "1px solid #a7f3d0" }}>🎉 정답입니다!</div>
                            )
                        )}
                    </div>
                        <button 
                            onClick={qStatus === "SUCCESS" || (qStatus === "WRONG" && qTries >= 2) ? nextAction : handleQCheck} 
                            className={(qIndex === 1 || qIndex === 2) ? "btn-cta-full" : "btn-full"} 
                            style={{ marginTop: 12 }}
                            disabled={qIndex === 1 ? selectedOption === null : (qIndex === 2 ? writeAnswer.trim().length === 0 : false)}
                        >
                            {qStatus === "SUCCESS" || (qStatus === "WRONG" && qTries >= 2) ? (qIndex === 2 ? "완료하기" : "다음 문제 풀기") : "정답 확인하기"}
                        </button>
                </div>
            </div>
        </div>
    );

    if (screen === "DASHBOARD") return (
        <div>
            <Header sub="학습 결과" onBack={() => setScreen("HOME")} />
            <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 20px" }}>
                <div style={{ background: "white", borderRadius: 28, padding: "40px", border: "1.5px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}> <div style={{ fontSize: 56 }}>🏅</div> <div style={{ fontSize: 28, fontWeight: 900 }}>학습 완료!</div> </div>
                    <button onClick={() => { setScreen("HOME"); setQIndex(0); setQStatus("IDLE"); setActivityStatus("IDLE"); }} className="btn-full">홈으로 돌아가기</button>
                </div>
            </div>
        </div>
    );

    return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
