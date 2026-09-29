import { useMemo } from 'react';

interface UseScopedCssOptions {
  componentId: string;
  customCss?: string;
  scopePrefix?: string; // 예: "data-custom-skin"
}

interface ScopedCssResult {
  scopeAttributeName: string;
  scopeAttributeValue: string;
  sanitizedCss: string;
  isValid: boolean;
  errorMessage?: string;
}

// 1. 보안상 위험한 키워드 및 글로벌 오염 유발 선택자 블랙리스트
const DANGEROUS_PATTERNS = [
  /javascript:/i,
  /expression\s*\(/i, // 구형 IE XSS
  /@import/i,         // 외부 CSS 로드 차단
  /behavior\s*:/i,
  /-moz-binding/i,
];

// 글로벌 영역 오염을 시도하는 선택자 차단 (body, html, :root 등)
const GLOBAL_TARGET_PATTERNS = [
  /\b(html|body)\b/i,
  /:root/i,
  /\*/, // 전역 선택자 (*) 사용 제한
];

export function useScopedCss({
  componentId,
  customCss,
  scopePrefix = 'data-custom-skin',
}: UseScopedCssOptions): ScopedCssResult {
  const scopeAttributeValue = `${scopePrefix}-${componentId}`;

  const result = useMemo(() => {
    if (!customCss || !customCss.trim()) {
      return {
        scopeAttributeName: scopePrefix,
        scopeAttributeValue,
        sanitizedCss: '',
        isValid: true,
      };
    }

    const trimmedCss = customCss.trim();

    // Guard 1: 보안 위험 패턴 검사 (XSS / 외부 리소스 로드)
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.test(trimmedCss)) {
        return {
          scopeAttributeName: scopePrefix,
          scopeAttributeValue,
          sanitizedCss: '',
          isValid: false,
          errorMessage: '보안상 허용되지 않는 CSS 구문이 포함되어 있습니다. (예: @import, javascript:)',
        };
      }
    }

    // Guard 2: 글로벌 오염 선택자 검사
    for (const pattern of GLOBAL_TARGET_PATTERNS) {
      if (pattern.test(trimmedCss)) {
        return {
          scopeAttributeName: scopePrefix,
          scopeAttributeValue,
          sanitizedCss: '',
          isValid: false,
          errorMessage: '글로벌 선택자(html, body, :root, *)는 오버라이드할 수 없습니다.',
        };
      }
    }

    // Guard 3: CSS 스코핑 (Scope Isolation)
    // 입력된 CSS 규칙들을 컴포넌트 고유 속성([data-custom-skin="xxx"]) 하위로 강제 격리
    try {
      const scoped = scopeCssRules(trimmedCss, `[${scopePrefix}="${scopeAttributeValue}"]`);
      return {
        scopeAttributeName: scopePrefix,
        scopeAttributeValue,
        sanitizedCss: scoped,
        isValid: true,
      };
    } catch (err) {
      return {
        scopeAttributeName: scopePrefix,
        scopeAttributeValue,
        sanitizedCss: '',
        isValid: false,
        errorMessage: 'CSS 문법이 올바르지 않습니다.',
      };
    }
  }, [componentId, customCss, scopePrefix, scopeAttributeValue]);

  return result;
}

/**
 * 간단한 CSS Parser & Scoper 함수
 * 입력 예: ".title { color: red; } button { padding: 8px; }"
 * 출력 예: "[data-custom-skin="xxx"] .title { color: red; } [data-custom-skin="xxx"] button { padding: 8px; }"
 */
function scopeCssRules(css: string, scopeSelector: string): string {
  // 간단한 블록 단위 스코핑 (주석 제거 후 파싱)
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 규칙 단위 분리 (e.g. "selector { rule }")
  return cleanCss.replace(/([^{]+)\{([^}]+)\}/g, (_, rawSelectors: string, rules: string) => {
    const scopedSelectors = rawSelectors
      .split(',')
      .map((sel) => {
        const trimmed = sel.trim();
        if (!trimmed) return '';
        
        // 유저가 자기 자신(&)을 참조하는 경우 (e.g. &:hover)
        if (trimmed.startsWith('&')) {
          return `${scopeSelector}${trimmed.slice(1)}`;
        }
        
        // 하위 요소 선택자 처리
        return `${scopeSelector} ${trimmed}`;
      })
      .filter(Boolean)
      .join(', ');

    return `${scopedSelectors} { ${rules.trim()} }`;
  });
}