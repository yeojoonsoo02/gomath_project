import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: '사용자 프로필 조회' })
  @ApiResponse({ status: 200, description: '사용자 프로필 정보' })
  // @UseGuards(JwtAuthGuard) // 나중에 인증 구현 후 활성화
  async getProfile() {
    // 임시로 Mock 데이터 반환
    return this.userService.getMockProfile();
  }

  @Put('profile')
  @ApiOperation({ summary: '사용자 프로필 수정' })
  @ApiResponse({ status: 200, description: '프로필이 성공적으로 수정됨' })
  // @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateDto: UpdateUserDto) {
    return this.userService.updateProfile(updateDto);
  }

  @Get('progress')
  @ApiOperation({ summary: '학습 진도 조회' })
  @ApiResponse({ status: 200, description: '사용자 학습 진도 정보' })
  async getProgress() {
    return this.userService.getMockProgress();
  }

  @Get('achievements')
  @ApiOperation({ summary: '성취도 조회' })
  @ApiResponse({ status: 200, description: '사용자 성취도 목록' })
  async getAchievements() {
    return this.userService.getMockAchievements();
  }

  @Get('bookmarks')
  @ApiOperation({ summary: '북마크된 문제 목록' })
  @ApiResponse({ status: 200, description: '북마크된 문제 목록' })
  async getBookmarks() {
    return this.userService.getMockBookmarks();
  }

  @Post('bookmarks/:problemId')
  @ApiOperation({ summary: '문제 북마크 추가' })
  @ApiResponse({ status: 201, description: '북마크가 추가됨' })
  async addBookmark(@Param('problemId') problemId: string) {
    return this.userService.addBookmark(problemId);
  }
}