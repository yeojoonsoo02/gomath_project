import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsBoolean, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole, LearningLevel, Category, Difficulty } from '@gomath/shared';

export class CreateUserDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '사용자명' })
  @IsString()
  username: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;

  @ApiProperty({ description: '표시명' })
  @IsString()
  displayName: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '표시명', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '학년', required: false, minimum: 1, maximum: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  grade?: number;

  @ApiProperty({ description: '학교명', required: false })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiProperty({ 
    description: '선호 카테고리', 
    enum: ['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'],
    isArray: true,
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsEnum(['algebra', 'geometry', 'calculus', 'statistics', 'functions', 'trigonometry', 'vectors', 'matrices', 'sequences', 'limits'], { each: true })
  preferredCategories?: Category[];

  @ApiProperty({ description: '선호 난이도', enum: ['easy', 'medium', 'hard'], required: false })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  preferredDifficulty?: Difficulty;

  @ApiProperty({ description: '학습 목표', isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningGoals?: string[];

  @ApiProperty({ description: '이메일 알림 설정', required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ description: '푸시 알림 설정', required: false })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiProperty({ description: '시각적 힌트 사용 설정', required: false })
  @IsOptional()
  @IsBoolean()
  visualHintsEnabled?: boolean;

  @ApiProperty({ description: '언어 설정', enum: ['ko', 'en'], required: false })
  @IsOptional()
  @IsEnum(['ko', 'en'])
  language?: string;

  @ApiProperty({ description: '테마 설정', enum: ['light', 'dark', 'system'], required: false })
  @IsOptional()
  @IsEnum(['light', 'dark', 'system'])
  theme?: string;
}

export class LoginDto {
  @ApiProperty({ description: '이메일 또는 사용자명' })
  @IsString()
  username: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}