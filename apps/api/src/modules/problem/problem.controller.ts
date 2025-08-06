import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProblemService } from './problem.service';
import { SearchProblemDto, CreateProblemDto } from './dto/problem.dto';

@ApiTags('problems')
@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get('search')
  @ApiOperation({ summary: '문제 검색' })
  @ApiResponse({ status: 200, description: '검색된 문제 목록' })
  @ApiQuery({ name: 'q', required: false, description: '검색 쿼리' })
  @ApiQuery({ name: 'category', required: false, description: '카테고리 필터' })
  @ApiQuery({ name: 'difficulty', required: false, description: '난이도 필터' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 크기' })
  async searchProblems(@Query() query: SearchProblemDto) {
    return this.problemService.searchProblems(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '문제 상세 조회' })
  @ApiResponse({ status: 200, description: '문제 상세 정보' })
  async getProblem(@Param('id') id: string) {
    return this.problemService.getProblemById(id);
  }

  @Get(':id/similar')
  @ApiOperation({ summary: '유사 문제 추천' })
  @ApiResponse({ status: 200, description: '유사한 문제 목록' })
  async getSimilarProblems(@Param('id') id: string) {
    return this.problemService.getSimilarProblems(id);
  }

  @Post()
  @ApiOperation({ summary: '새 문제 생성' })
  @ApiResponse({ status: 201, description: '문제가 성공적으로 생성됨' })
  async createProblem(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.createProblem(createProblemDto);
  }
}