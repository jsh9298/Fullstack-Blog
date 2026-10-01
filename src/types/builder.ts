export type PrimitiveType =
  | "button"
  | "input"
  | "textarea"
  | "select"
  | "text"
  | "heading"
  | "image"
  | "container"
  | "checkbox"
  | "divider"
  | "container";

export interface LocalStyleProps {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  gap?: string;
  bg?: string;
  hoverBg?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textAlign?: "left" | "center" | "right" | "justify";
  radius?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderColor?: string;
  shadow?: string;
  opacity?: string | number;
  display?: "block" | "inline-block" | "flex" | "inline-flex" | "grid";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  gridTemplateColumns?: string;
}

export interface BasePrimitiveProps{
  id: string;             //식별자 용 uuid
  isEditing?: boolean;  
  localVars?: LocalStyleProps;  // ui 핸들러 입력값
  customCss?: string;           // 에디터 입력값
  className?: string;           //추가적인 Tailwind 클래스나 외부 CSS 주입용
  onSelect? : (id:string,e:React.MouseEvent) => void; // 에디터 모드 가드용 이벤트
  isContainer?: boolean // 컨테이너 타입인지 체크
}

export interface ItemSchema<TProps = Record<string, any>> {
  id: string;             //식별자 용 uuid BasePrimitiveProps랑 같은거
  type: PrimitiveType;    //컴포넌트 종류
  props: TProps;          // 속성
  customCss?: string;     //커스텀 css (문자열)
  localVars?: Record<string, string>; //커스텀 css (ui 핸들러)
}


