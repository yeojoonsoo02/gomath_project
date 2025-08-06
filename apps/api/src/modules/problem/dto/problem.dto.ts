import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Category, Difficulty, Source, VisualHint } from '@gomath/shared';

export class SearchProblemDto {
  @ApiProperty({ required: false, description: '검색 쿼리' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ enum: ['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'], required: false })
  @IsOptional()
  @IsEnum(['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'])
  category?: Category;

  @ApiProperty({ enum: ['easy', 'medium', 'hard'], required: false })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: Difficulty;

  @ApiProperty({ enum: ['suneung', 'mock_exam', 'previous_exam', 'practice', 'competition', 'textbook'], required: false })
  @IsOptional()
  @IsEnum(['suneung', 'mock_exam', 'previous_exam', 'practice', 'competition', 'textbook'])
  source?: Source;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}

export class CreateProblemDto {
  @ApiProperty({ description: '문제 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '문제 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '문제 해답', required: false })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiProperty({ description: '문제 해설', required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ enum: ['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'] })
  @IsEnum(['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'])
  category: Category;

  @ApiProperty({ description: '하위 카테고리', required: false })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({ enum: ['easy', 'medium', 'hard'] })
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: Difficulty;

  @ApiProperty({ description: '태그 목록', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ enum: ['suneung', 'mock_exam', 'previous_exam', 'practice', 'competition', 'textbook'] })
  @IsEnum(['suneung', 'mock_exam', 'previous_exam', 'practice', 'competition', 'textbook'])
  source: Source;

  @ApiProperty({ description: '출제 연도', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiProperty({ description: '시험명', required: false })
  @IsOptional()
  @IsString()
  examName?: string;

  @ApiProperty({ description: '문제 번호', required: false })
  @IsOptional()
  @IsString()
  questionNumber?: string;

  @ApiProperty({ description: '시각적 힌트 목록', required: false })
  @IsOptional()
  @IsArray()
  visualHints?: VisualHint[];

  @ApiProperty({ description: '예상 소요 시간(분)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  estimatedTime?: number;

  @ApiProperty({ description: '배점', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  points?: number;

  @ApiProperty({ description: '키워드 목록', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiProperty({ description: '관련 개념 목록', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedConcepts?: string[];

  @ApiProperty({ description: '공개 여부', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}