# Grammar Viewer Pro - Textbook Data Pipeline

이 폴더(`scripts`)는 교과서 원문(`.txt`) 데이터를 Grammar Viewer Pro 앱에서 사용할 수 있는 정제된 형태(`CSV`, `JSON`)로 변환하고 확장하는 파이프라인 도구들을 포함하고 있습니다. 

## 🌟 메인 파이프라인: `process_all_lessons.py`
이 파이프라인 하나만 돌리면 **이재영**, **정사열** 저자의 1~8단원(총 16개 단원)의 데이터가 자동으로 검증되고 정제됩니다! 각 저자 폴더에서 데이터를 찾을 수 없을 때 빈 칸을 자동으로 채워 넣어주는 궁극의 마스터 스크립트입니다.

### ⚙️ 수행 로직 (1개 단원 기준)
1. **Paragraphs 병합 (`_paragraphs.csv` -> `_organized.csv`)**: 긴 지문 블록들을 문장 단위로 해체하여 기존의 CSV를 확장합니다.
2. **원문 누락 검증 (`TXT` -> `CSV`)**: `Lesson##.txt`를 스캔하여 아직 CSV화되지 않은 모든 영어 문장(대화문, 질문 등)을 복구해서 밀어넣습니다.
3. **AI 자율 번역 (`korean`)**: 영어 원문은 있지만 한글 해석이 빠져있거나 `[해석필요]`라고 적힌 칸을 `deep-translator` 인공지능이 돌면서 전면 자동 번역합니다. 
4. **문법 룰 엔진 적용 (`grammar_name`, `structure`)**: 관계대명사, to부정사, 시제 등 다양한 중학교 영어 문법 구조식을 정규식 휴리스틱 분석(Heuristic Grammer Tagger) 기반으로 자동 판별하여 빈칸에 태깅합니다.
5. **RAG 페이지 매핑 (`page`)**: 영어 문장이 원본 교과서 텍스트 안에서 몇 페이지(예: `[Page 32]`)에 해당하는지 역추적해서 `page` 칸에 자동 기록합니다.
6. **앱 연동 JSON 동기화**: 앞선 5번의 과정을 거쳐 완전체로 거듭난 CSV 구조를 `Lesson##_organized.json` 에 그대로 주입하여, 앱의 프론트엔드가 즉시 읽어들일 수 있도록 만듭니다.

**실행 방법:**
```bash
cd i:\2026\2025-천재교육\에듀테크상품서비스\02AIDT콘텐츠개발\챗봇\grammar_viewer_v12\data\processed\textbook-data\scripts
python process_all_lessons.py
```

---

## 🗑️ Legacy Tools (`legacy_tools/` 폴더)
위의 `process_all_lessons.py`를 완성하기까지 실험적으로 작성했던 개별/파편화 스크립트들입니다. 모두 Lesson02 한 단원을 기준으로 단계별 자동화를 실험했던 과거 테스트용 코드로, **이제는 실행할 필요가 없습니다.** (코드 참고용으로만 사용하세요)

* `fill_missing_texts.py`
* `auto_fill_csv.py`
* `process_lesson02.py`
* `sync_json_grammar.py`
* `tag_grammar.py`
* `update_paragraphs.py`
* `verify_coverage.py`
