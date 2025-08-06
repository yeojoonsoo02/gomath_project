import { Injectable } from '@nestjs/common';
import { SearchProblemDto, CreateProblemDto } from './dto/problem.dto';
import { MathProblem, Category, Difficulty, Source } from '@gomath/shared';

@Injectable()
export class ProblemService {
  // 임시 Mock 데이터 (실제 DB 연결 전까지 사용)
  private mockProblems: MathProblem[] = this.generateMockProblems();

  async searchProblems(searchDto: SearchProblemDto) {
    const { q, category, difficulty, source, page = 1, limit = 20 } = searchDto;
    
    // 필터링
    let filteredProblems = this.mockProblems;

    if (q) {
      const query = q.toLowerCase();
      filteredProblems = filteredProblems.filter(
        p => p.title.toLowerCase().includes(query) || 
             p.content.toLowerCase().includes(query) ||
             p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (category) {
      filteredProblems = filteredProblems.filter(p => p.category === category);
    }

    if (difficulty) {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }

    if (source) {
      filteredProblems = filteredProblems.filter(p => p.source === source);
    }

    // 페이지네이션
    const total = filteredProblems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const problems = filteredProblems.slice(startIndex, endIndex);

    return {
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async getProblemById(id: string): Promise<MathProblem | null> {
    const problem = this.mockProblems.find(p => p.id === id);
    
    if (problem) {
      // 조회수 증가
      problem.viewCount += 1;
    }
    
    return problem || null;
  }

  async getSimilarProblems(id: string): Promise<MathProblem[]> {
    const problem = await this.getProblemById(id);
    
    if (!problem) return [];
    
    // 같은 카테고리에서 유사한 난이도의 문제 찾기
    return this.mockProblems
      .filter(p => 
        p.id !== id && 
        p.category === problem.category &&
        Math.abs(this.getDifficultyLevel(p.difficulty) - this.getDifficultyLevel(problem.difficulty)) <= 1
      )
      .slice(0, 5);
  }

  async createProblem(createDto: CreateProblemDto): Promise<MathProblem> {
    const newProblem: MathProblem = {
      id: `problem_${Date.now()}`,
      ...createDto,
      visualHints: createDto.visualHints || [],
      tags: createDto.tags || [],
      keywords: createDto.keywords || [],
      relatedConcepts: createDto.relatedConcepts || [],
      isPublic: true,
      isVerified: false,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockProblems.push(newProblem);
    return newProblem;
  }

  private getDifficultyLevel(difficulty: Difficulty): number {
    const levels = { easy: 1, medium: 2, hard: 3 };
    return levels[difficulty] || 2;
  }

  private generateMockProblems(): MathProblem[] {
    const categories: Category[] = ['algebra', 'geometry', 'calculus', 'statistics', 'functions'];
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const sources: Source[] = ['suneung', 'mock_exam', 'practice', 'textbook'];

    return Array.from({ length: 50 }, (_, index) => ({
      id: `problem_${index + 1}`,
      title: `수학 문제 ${index + 1}: ${this.getProblemTitle(index)}`,
      content: this.getProblemContent(index),
      solution: `해답: ${Math.floor(Math.random() * 100)}`,
      explanation: '이 문제는 다음과 같이 해결할 수 있습니다...',
      category: categories[Math.floor(Math.random() * categories.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      tags: this.getProblemTags(index),
      source: sources[Math.floor(Math.random() * sources.length)],
      year: 2020 + Math.floor(Math.random() * 4),
      visualHints: [],
      estimatedTime: 5 + Math.floor(Math.random() * 25),
      points: 2 + Math.floor(Math.random() * 6),
      keywords: ['수학', '문제해결'],
      relatedConcepts: ['기초개념'],
      isPublic: true,
      isVerified: Math.random() > 0.3,
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }));
  }

  private getProblemTitle(index: number): string {
    const titles = [
      '이차함수의 최댓값과 최솟값',
      '삼각함수의 덧셈공식',
      '정적분의 계산',
      '확률의 기본 성질',
      '수열의 극한',
      '미분의 응용',
      '기하학적 확률',
      '로그함수의 성질',
      '벡터의 내적',
      '행렬의 곱셈'
    ];
    return titles[index % titles.length];
  }

  private getProblemContent(index: number): string {
    const contents = [
      '함수 f(x) = x² - 4x + 3의 최솟값을 구하시오.',
      'sin(α + β) = sin α cos β + cos α sin β임을 증명하시오.',
      '∫₀¹ x² dx를 계산하시오.',
      '주사위를 두 번 던질 때, 합이 7이 될 확률을 구하시오.',
      'lim(n→∞) (1 + 1/n)ⁿ의 값을 구하시오.',
      'y = x³ - 3x² + 2의 극값을 구하시오.',
      '단위원에서 임의의 점을 선택할 때, x > 0.5일 확률을 구하시오.',
      'log₂ 8 + log₂ 4의 값을 구하시오.',
      '벡터 a = (1, 2), b = (3, 4)일 때 a·b를 구하시오.',
      '행렬 A = [[1, 2], [3, 4]], B = [[2, 0], [1, 1]]일 때 AB를 구하시오.'
    ];
    return contents[index % contents.length];
  }

  private getProblemTags(index: number): string[] {
    const allTags = [
      '이차함수', '삼각함수', '적분', '확률', '극한', 
      '미분', '기하', '로그', '벡터', '행렬',
      '수능', '기출', '연습', '심화'
    ];
    
    const numTags = 2 + Math.floor(Math.random() * 3);
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  }
}