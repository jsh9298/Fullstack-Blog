import React from "react";

export type PrimitiveType =
  | "button"
  | "input"
  | "textarea"
  | "select"
  | "text"
  | "heading"
  | "image"
  | "container"
  | "options"
  | "divider"
  | "container";

export interface LocalStyleProps extends React.CSSProperties {
  [key: string]: string | number | undefined;
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
  localVars?: Record<string, any>; //커스텀 css (ui 핸들러)
  children?: ItemSchema[]; //하위 아이템 저장용. (트리구조 저장을 위함)
}

export type ControlType =
  | "text"
  | "textarea"
  | "select"
  | "color"
  | "number"
  | "boolean"
  | "range";

export interface PropertyFieldSchema {
  key: string; // props 또는 localVars의 key 명칭
  label: string; // 화면에 표시될 라벨명
  controlType: ControlType; // 컨트롤러 타입
  target: "props" | "localVars"; // 데이터가 저장되는 위치
  options?: { label: string; value: string }[]; // select 타입일 때 옵션 목록
  placeholder?: string;
  min?: number; // range 최솟값
  max?: number; // range 최댓값
  step?: number; // range 증감 단위
  unit?: string; // "px", "rem" 등 단위
}

