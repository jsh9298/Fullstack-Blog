역할: 애플리케이션의 라우팅 구조를 정의합니다. (Next.js App Router 전용)

핵심 원칙: 이곳의 page.tsx는 가급적 src/views에 있는 컴포넌트를 호출하여 렌더링하는 역할만 수행합니다.

구조: >   * (admin), (main) 등 Route Groups를 통해 레이아웃 분기 처리.

layout.tsx: 해당 경로 그룹의 공통 껍데기 설정.

page.tsx: 특정 주소의 입구.



|계층 (Layer)|주요 폴더|작성해야 할 주요 파일|담당 기능 및 작성 팁|
|------------|---------|---------------------|--------------------|
|Project Root|app/|"layout.tsx, page.tsx"|라우팅 입구. src/views의 페이지 컴포넌트를 불러와 배치함.|
|App Setup|src/app/|"layouts/index.tsx, styles/globals.css"|"앱 전역 설정. 폰트, 전역 스타일, 공통 레이아웃(Header/Footer 조립) 정의."|
|Views|src/views/|"home/ui/HomePage.tsx, feed/ui/FeedPage.tsx"|페이지 조립. 특정 |URL에서 보여줄 위젯과 피처들을 배치하여 화면 완성.|
|Widgets|src/widgets/|"header/ui/Header.tsx, admin-env/ui/Sidebar.tsx"|큰 UI 블록. 헤더, 사이드바처럼 독립적으로 동작하는 큰 단위의 UI 조립체."|
|Features|src/features/|"post-editor/ui/Editor.tsx, admin-settings/api/..."|사용자 상호작용. 글쓰기 버튼 클릭, 스킨 변경 등 ""동작""과 관련된 로직과 UI."|
|Entities|src/entities/|"post/model/schema.ts, site/api/getConfig.ts"|비즈니스 데이터. DB 테이블 정의, 특정 도메인(글, 설정) 전용 데이터 요청 및 단순 카드 UI."|
|Shared|src/shared/|"api/db.ts, ui/button.tsx, ui/card.tsx"|공용 도구. 프로젝트 어디서든 쓰이는 최하위 UI 컴포넌트 및 DB 클라이언트 설정.|