import { PrimitiveType, PropertyFieldSchema } from "./builder";
// ─────────────────────────────────────────────
// 1. 공통 속성 그룹 정의 (Common Property Groups)
// ─────────────────────────────────────────────

// 글자 스타일 관련 공통 속성
const TYPOGRAPHY_FIELDS: PropertyFieldSchema[] = [
  {
    key: "color",
    label: "글자 색상",
    controlType: "color",
    target: "localVars",
  },
  {
    key: "fontSize",
    label: "폰트 크기",
    controlType: "range",
    target: "localVars",
    min: 10,
    max: 72,
    step: 1,
    unit: "px",
  },
];

// 컨테이너 레이아웃 관련 공통 속성
const CONTAINER_LAYOUT_FIELDS: PropertyFieldSchema[] = [
  {
    key: "display",
    label: "디스플레이",
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
    label: "배치 방향 (Flex Direction)",
    controlType: "select",
    target: "localVars",
    options: [
      { label: "세로 정렬 (Column)", value: "column" },
      { label: "가로 정렬 (Row)", value: "row" },
    ],
  },
  {
    key: "gap",
    label: "요소 간격 (Gap)",
    controlType: "range",
    target: "localVars",
    min: 0,
    max: 64,
    step: 2,
    unit: "px",
  },
];

// 여백/배경 관련 공통 속성
const BOX_MODEL_FIELDS: PropertyFieldSchema[] = [
  {
    key: "padding",
    label: "내부 여백 (Padding)",
    controlType: "range",
    target: "localVars",
    min: 0,
    max: 64,
    step: 4,
    unit: "px",
  },
  {
    key: "bg",
    label: "배경색 (Background)",
    controlType: "color",
    target: "localVars",
  },
   {
      key: "borderColor",
      label: "선 색상",
      controlType: "color",
      target: "localVars",
    },
];

// ─────────────────────────────────────────────
// 2. 컴포넌트별 고유 속성 + 공통 그룹 조합
// ─────────────────────────────────────────────

export const PROPERTY_SCHEMAS: Record<PrimitiveType, PropertyFieldSchema[]> = {
    // 1. 컨테이너: 레이아웃 + 박스 모델 공통 속성 조합
    container: [
        ...CONTAINER_LAYOUT_FIELDS,
        ...BOX_MODEL_FIELDS,
    ],

    // 2. 제목: 전용 내용(content) 및 레벨(level) + 타이포그래피 공통 속성
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
        ...TYPOGRAPHY_FIELDS,
    ],

    // 3. 본문 텍스트: 전용 내용(content) + 타이포그래피 공통 속성
    text: [
        {
            key: "content",
            label: "본문 내용",
            controlType: "textarea",
            target: "props",
        },
        ...TYPOGRAPHY_FIELDS,
    ],

    // 4. 입력창: 전용 props + 일부 공통
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
    ],

    // 5. 옵션/체크박스류
    options: [
        {
            key: "label",
            label: "라벨 텍스트",
            controlType: "text",
            target: "props",
        },
        {
            key: "defaultChecked",
            label: "기본 체크 여부",
            controlType: "boolean",
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
            label: "대체 텍스트",
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
                { label: "가로선", value: "horizontal" },
                { label: "세로선", value: "vertical" },
            ],
        },
    ],
    textarea: [],
    button: []
};




