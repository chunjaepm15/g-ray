/**
 * [G-ray] 데이터 가공 및 분류 유틸리티 (v9.1)
 * 
 * 기능: 교과서 원천 데이터(textbook-data)를 분석하여 문법 단위(unit)별로 
 *      분류하고, 중복을 제거하여 경량화된 학습 번들을 생성합니다.
 */

const DataProcessor = {
    // 1. 문법 분류 규칙 정의 (Cheonjae-Grammar-26 기준)
    UNIT_RULES: [
        { id: "CG01", name: "관계대명사 what", keywords: ["what", "the thing which"] },
        { id: "CG02", name: "현재완료 진행", keywords: ["have been", "has been", "since", "for"] },
        { id: "CG03", name: "to부정사의 의미상 주어", keywords: ["for", "of", "to"] },
        { id: "CG04", name: "과거완료", keywords: ["had", "before"] },
        { id: "CG05", name: "명사 수식 분사", keywords: ["ing", "ed", "p.p."] },
        { id: "CG10", name: "접속사 so that", keywords: ["so that", "in order that"] }
    ],

    /**
     * @param {Array} textbookSentences - 교과서에서 추출한 전체 문장 리스트
     * @returns {Object} 분류된 유닛 데이터 번들
     */
    classifyByUnit: function(textbookSentences) {
        console.log("🚦 데이터 분류 프로세스 시작...");
        
        const result = {
            metadata: {
                title: "자동 분류된 커리큘럼",
                processed_at: new Date().toISOString()
            },
            units: []
        };

        this.UNIT_RULES.forEach(rule => {
            // 키워드 매칭을 통해 문장 분류 (Heuristic Match)
            const matched = textbookSentences.filter(s => {
                const enLower = s.english.toLowerCase();
                return rule.keywords.some(k => enLower.includes(k));
            });

            if (matched.length > 0) {
                result.units.append({
                    unit_id: rule.id,
                    title: rule.name,
                    sentences: matched.slice(0, 30) // 유닛당 최대 30개로 경량화
                });
                console.log(`✅ [${rule.name}] 분류 완료: ${matched.length}개 발견`);
            }
        });

        return result;
    },

    /**
     * 문장 데이터 경량화 (불필요한 필드 제거)
     */
    optimizeData: function(data) {
        data.units.forEach(u => {
            u.sentences = u.sentences.map(s => ({
                id: s.id,
                english: s.english,
                korean: s.korean,
                difficulty: s.difficulty || "중",
                syntax_chunks: s.syntax_chunks || []
            }));
        });
        return data;
    }
};

// Node.js 환경에서 사용 시 내보내기 지원
if (typeof module !== 'undefined') {
    module.exports = DataProcessor;
}
