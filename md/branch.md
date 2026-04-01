# Git 브랜치 전략 (4인 협업용)

팀원 4명이 서로의 코드를 덮어쓰지 않고 조화롭게 결합하기 위한 **GitHub Flow** 기반의 브랜치 전략입니다.

## 1. 전제 조건
*   **`main` 브랜치**: 항상 배포와 테스트가 가능한 안정적인 상태를 유지합니다.
*   **`develop` 브랜치**: 각 팀원의 작업이 최종적으로 하나로 합류하는 브랜치입니다. (선택 사항)

## 2. 네이밍 규칙 (Branch Naming)
팀원의 이름보다는 **기능 단위**로 브랜치 이름을 명확히 합니다.
*   `feature/stage0`: 퀴즈 및 읽기 분석 기능 개발
*   `feature/stage1`: 문장 끊기 기능 개발
*   `feature/stage2`: 문장 배열 기능 개발
*   `feature/stage3`: 빈칸 채우기 기능 개발
*   `feature/stage4`: 직접 쓰기 기능 개발
*   `feature/ui-fix`: UI 버그 수정 및 공통 레이아웃 개선

## 3. 작업 워크플로우
1.  **브랜치 생성**: 본인의 담당 Stage 혹은 기능에 맞는 브랜치를 생성합니다.
    *   `git checkout -b feature/stage1`
2.  **작업 및 커밋**: 작은 단위로 자주 커밋합니다. (커밋 메시지는 한글 권장)
    *   `git commit -m "Step 1 UI 인터랙션 수정 및 toast 알림 추가"`
3.  **원격 저장소 전송**: 작업 중간중간 `git push origin feature/branch-name`을 실행합니다.
4.  **Full Request (PR) 및 코드 리뷰**: 작업이 완료되면 `main` 브랜치로 PR을 보냅니다.
    *   다른 팀원 최소 1명의 승인(Approve)을 받은 후 병합(Merge)합니다.

## 4. 충돌 해결 (Conflict Resolution)
1.  작업을 시작하기 전 항상 `main` 브랜치의 최신 내용을 가져옵니다. (`git pull origin main`)
2.  본인의 브랜치로 가져와서 병합해봅니다. (`git merge main`)
3.  충돌이 발생하면 팀원과 상의한 후 해당 코드 라인을 정리하고 다시 커밋합니다.

## 5. 배포 관리
*   모든 PR이 병합되면 최종적으로 `main`에서 통합 테스트를 진행합니다.
