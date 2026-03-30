역할: 앱의 전역 설정, 프로바이더(Provider), 전역 스타일, 그리고 레이아웃의 실체를 정의합니다.

주요 파일:

layouts/: app/layout.tsx에서 사용할 실제 UI 구조 (Header, Footer 조립).

styles/: Tailwind, 전역 CSS 변수 정의.

providers/: (필요시) QueryClient, ThemeProvider 등 전체를 감싸는 설정.

참조 규칙: 모든 하위 계층(views, widgets, features, entities, shared)을 참조할 수 있는 최상위 계층입니다.