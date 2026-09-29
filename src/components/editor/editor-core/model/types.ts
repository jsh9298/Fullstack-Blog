
export type BlockType = 
    'paragraph'|'heading1'|
    'heading2'|'heading3'|
    'blockquote'|'bulleted-list-item'|
    'numbered-list-item'|'todo-list-item'|
    'codeblock'|'image'|'divider';

export interface InlineTextNode  {
    text: string; //일반문자
    bold? : boolean; //볼드
    italic? :boolean;//기울기
    underline? :boolean;//밑줄
    strikethrough? :boolean;//취소선
    linkUrl? :string;//하이퍼링크
    isInlineCode? :boolean;//인라인코드
};

export interface BlockAttributes{ //예외처리용
    checked? : boolean; //체크 시 취소선연동용-체크박스
    language? : string; //수동 서식 차단용-코드블록
    url? : string;  // 이미지용
    caption? : string; // 이미지용
}

export interface EditorBlock{
    id:string; //uuid 식별자
    type:BlockType; // 단일블록 타입
    children: InlineTextNode[]; // 줄단위 인라인 조각
    attributes? : BlockAttributes; // 블록 확장 옵션
}