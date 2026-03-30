역할: 특정 페이지의 비즈니스 목적에 맞게 widgets, features, entities를 배치하여 하나의 "완성된 페이지"를 만듭니다.

주요 파일:

ui/: 페이지 전체 구성을 담은 React 컴포넌트.

index.ts: 외부(app 폴더)로 해당 페이지를 내보내는 창구.

참조 규칙: widgets 이하의 모든 계층을 참조합니다.