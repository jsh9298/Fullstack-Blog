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
  | "boolean";

export interface PropertyFieldSchema {
  key: string; // props 또는 localVars의 key 명칭
  label: string; // 화면에 표시될 라벨명
  controlType: ControlType; // 컨트롤러 타입
  target: "props" | "localVars"; // 데이터가 저장되는 위치
  options?: { label: string; value: string }[]; // select 타입일 때 옵션 목록
  placeholder?: string;
}

export const PROPERTY_SCHEMAS: Record<PrimitiveType, PropertyFieldSchema[]> = {
  container: [
    {
      key: "display",
      label: "디스플레이 모드",
      controlType: "select",
      target: "localVars",
      options: [
        { label: "Flex", value: "flex" },
        { label: "Grid", value: "grid" },
        { label: "Block", value: "block" },
      ],
    },
    {
      key: "flexDirection",
      label: "Flex 방향",
      controlType: "select",
      target: "localVars",
      options: [
        { label: "Column (세로)", value: "column" },
        { label: "Row (가로)", value: "row" },
      ],
    },
    {
      key: "gap",
      label: "간격 (gap)",
      controlType: "text",
      target: "localVars",
      placeholder: "16px",
    },
    {
      key: "padding",
      label: "패딩 (padding)",
      controlType: "text",
      target: "localVars",
      placeholder: "16px",
    },
    {
      key: "bg",
      label: "배경색 (bg)",
      controlType: "color",
      target: "localVars",
    },
  ],

  heading: [
    {
      key: "content",
      label: "제목 내용",
      controlType: "text",
      target: "props",
    },
    {
      key: "level",
      label: "태그 레벨",
      controlType: "select",
      target: "props",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "H4", value: "h4" },
        { label: "H5", value: "h5" },
        { label: "H6", value: "h6" },
      ],
    },
    {
      key: "color",
      label: "글자 색상",
      controlType: "color",
      target: "localVars",
    },
    {
      key: "fontSize",
      label: "폰트 크기",
      controlType: "text",
      target: "localVars",
      placeholder: "24px",
    },
  ],

  text: [
    {
      key: "content",
      label: "본문 내용",
      controlType: "textarea",
      target: "props",
    },
    {
      key: "color",
      label: "글자 색상",
      controlType: "color",
      target: "localVars",
    },
    {
      key: "fontSize",
      label: "폰트 크기",
      controlType: "text",
      target: "localVars",
      placeholder: "16px",
    },
  ],

  input: [
    {
      key: "placeholder",
      label: "Placeholder",
      controlType: "text",
      target: "props",
    },
    {
      key: "type",
      label: "Input 타입",
      controlType: "select",
      target: "props",
      options: [
        { label: "Text", value: "text" },
        { label: "Password", value: "password" },
        { label: "Email", value: "email" },
        { label: "Number", value: "number" },
      ],
    },
    {
      key: "width",
      label: "너비 (width)",
      controlType: "text",
      target: "localVars",
      placeholder: "100%",
    },
  ],

  options: [
    {
      key: "label",
      label: "라벨 텍스트",
      controlType: "text",
      target: "props",
    },
    {
      key: "variant",
      label: "옵션 형태",
      controlType: "select",
      target: "props",
      options: [
        { label: "Checkbox", value: "checkbox" },
        { label: "Radio", value: "radio" },
        { label: "Switch", value: "switch" },
      ],
    },
    {
      key: "defaultChecked",
      label: "기본 체크 여부",
      controlType: "boolean",
      target: "props",
    },
  ],

  select: [
    {
      key: "placeholder",
      label: "Placeholder",
      controlType: "text",
      target: "props",
    },
    {
      key: "width",
      label: "너비 (width)",
      controlType: "text",
      target: "localVars",
      placeholder: "100%",
    },
  ],

  image: [
    {
      key: "src",
      label: "이미지 URL",
      controlType: "text",
      target: "props",
    },
    {
      key: "alt",
      label: "대체 텍스트 (Alt)",
      controlType: "text",
      target: "props",
    },
    {
      key: "objectFit",
      label: "Object Fit",
      controlType: "select",
      target: "props",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
      ],
    },
  ],

  divider: [
    {
      key: "orientation",
      label: "방향",
      controlType: "select",
      target: "props",
      options: [
        { label: "가로 (Horizontal)", value: "horizontal" },
        { label: "세로 (Vertical)", value: "vertical" },
      ],
    },
    {
      key: "borderColor",
      label: "선 색상",
      controlType: "color",
      target: "localVars",
    },
  ],
  button: [],
  textarea: []
};