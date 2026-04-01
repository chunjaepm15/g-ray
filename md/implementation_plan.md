# 프로젝트 모듈화 및 문서화 실행 계획

본 계획은 4명의 개발자가 효율적으로 협업할 수 있도록 "단계(Stages)" 로직을 개별 파일로 구조화하고, AI 활용 규칙 및 Git 브랜치 전략을 수립하는 것을 목표로 합니다.

## 1. 개요
현재 `js/ui.js`에 모든 단계의 로직이 포함되어 있어 협업 시 충돌 위험이 높습니다. 이를 단계별로 분리하고 협업 가이드를 구성합니다.

## 2. 주요 변경 사항

### JavaScript 리팩토링 및 모듈화

기존의 `js/ui.js`를 `js/stages/` 디렉토리 내의 개별 파일로 분할합니다.

*   **`js/stages/stage0-initial.js`**: `renderInitialQuiz`, `checkInitialQuiz`, `renderReadAnalysis`
*   **`js/stages/stage1-chop.js`**: `renderChopUI`, `toggleChop`
*   **`js/stages/stage2-rearrange.js`**: `renderRearrangeUI`, `createTileEl`, `moveTile`, `checkRearrange`
*   **`js/stages/stage3-blank.js`**: `renderBlankUI`, `checkBlank`
*   **`js/stages/stage4-write.js`**: `renderWriteUI`, `checkWrite`
*   **`js/utils.js`**: `shuffle` 등 공용 유틸리티 함수

### 협업 가이드라인 문서 생성 (md 폴더)

1.  **`md/ai-collaboration-rules.md`**: AI(Gemini) 협업 규칙
2.  **`md/branch.md`**: Git 브랜치 전략 (4인 팀용)

## 3. 검증 계획
*   각 단계별 기능이 정상적으로 노출되고 작동하는지 확인.
*   전역 변수 및 함수 호출 관계가 올바른지 점검.
