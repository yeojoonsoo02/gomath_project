/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * - 최소 8자
 * - 대소문자, 숫자, 특수문자 포함
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 사용자명 유효성 검사
 * - 3-20자
 * - 영문, 숫자, 언더스코어만 허용
 * - 영문으로 시작
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (username.length < 3) {
    return { isValid: false, error: '사용자명은 최소 3자 이상이어야 합니다.' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: '사용자명은 20자를 초과할 수 없습니다.' };
  }
  
  if (!/^[a-zA-Z]/.test(username)) {
    return { isValid: false, error: '사용자명은 영문으로 시작해야 합니다.' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: '사용자명은 영문, 숫자, 언더스코어만 사용할 수 있습니다.' };
  }
  
  return { isValid: true };
}

/**
 * 표시명 유효성 검사
 * - 1-50자
 * - 특수문자 제한
 */
export function validateDisplayName(displayName: string): {
  isValid: boolean;
  error?: string;
} {
  if (displayName.length === 0) {
    return { isValid: false, error: '표시명을 입력해주세요.' };
  }
  
  if (displayName.length > 50) {
    return { isValid: false, error: '표시명은 50자를 초과할 수 없습니다.' };
  }
  
  // 금지된 특수문자 체크
  if (/[<>\"'&]/.test(displayName)) {
    return { isValid: false, error: '사용할 수 없는 특수문자가 포함되어 있습니다.' };
  }
  
  return { isValid: true };
}

/**
 * 검색어 유효성 검사
 */
export function validateSearchQuery(query: string): {
  isValid: boolean;
  error?: string;
} {
  if (query.length === 0) {
    return { isValid: false, error: '검색어를 입력해주세요.' };
  }
  
  if (query.length < 2) {
    return { isValid: false, error: '검색어는 최소 2자 이상 입력해주세요.' };
  }
  
  if (query.length > 100) {
    return { isValid: false, error: '검색어는 100자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
}

/**
 * 학년 유효성 검사
 */
export function validateGrade(grade: number): {
  isValid: boolean;
  error?: string;
} {
  if (!Number.isInteger(grade)) {
    return { isValid: false, error: '학년은 정수여야 합니다.' };
  }
  
  if (grade < 1 || grade > 12) {
    return { isValid: false, error: '학년은 1-12 사이의 값이어야 합니다.' };
  }
  
  return { isValid: true };
}

/**
 * URL 유효성 검사
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 파일 크기 유효성 검사 (바이트 단위)
 */
export function validateFileSize(size: number, maxSizeMB = 10): {
  isValid: boolean;
  error?: string;
} {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (size > maxSizeBytes) {
    return {
      isValid: false,
      error: `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`
    };
  }
  
  return { isValid: true };
}

/**
 * 파일 타입 유효성 검사
 */
export function validateFileType(filename: string, allowedTypes: string[]): {
  isValid: boolean;
  error?: string;
} {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    return { isValid: false, error: '파일 확장자를 확인할 수 없습니다.' };
  }
  
  if (!allowedTypes.includes(extension)) {
    return {
      isValid: false,
      error: `허용되지 않는 파일 형식입니다. 허용된 형식: ${allowedTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
}

/**
 * LaTeX 수식 기본 유효성 검사
 */
export function validateLatex(latex: string): {
  isValid: boolean;
  error?: string;
} {
  if (latex.length === 0) {
    return { isValid: true }; // 빈 값은 허용
  }
  
  // 기본적인 LaTeX 구문 체크
  const openBraces = (latex.match(/\{/g) || []).length;
  const closeBraces = (latex.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    return { isValid: false, error: 'LaTeX 중괄호가 일치하지 않습니다.' };
  }
  
  const openBrackets = (latex.match(/\[/g) || []).length;
  const closeBrackets = (latex.match(/\]/g) || []).length;
  
  if (openBrackets !== closeBrackets) {
    return { isValid: false, error: 'LaTeX 대괄호가 일치하지 않습니다.' };
  }
  
  return { isValid: true };
}

/**
 * 태그 유효성 검사
 */
export function validateTags(tags: string[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (tags.length > 10) {
    errors.push('태그는 최대 10개까지 설정할 수 있습니다.');
  }
  
  for (const tag of tags) {
    if (tag.length === 0) {
      errors.push('빈 태그는 허용되지 않습니다.');
      continue;
    }
    
    if (tag.length > 20) {
      errors.push(`태그 "${tag}"는 20자를 초과할 수 없습니다.`);
    }
    
    if (!/^[가-힣a-zA-Z0-9_\s]+$/.test(tag)) {
      errors.push(`태그 "${tag}"에 허용되지 않는 문자가 포함되어 있습니다.`);
    }
  }
  
  // 중복 태그 체크
  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    errors.push('중복된 태그가 있습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}