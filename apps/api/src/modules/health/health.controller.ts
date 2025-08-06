import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: '서버 상태 확인' })
  @ApiResponse({ status: 200, description: '서버가 정상적으로 실행 중입니다.' })
  getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('detailed')
  @ApiOperation({ summary: '상세 서버 상태 확인' })
  @ApiResponse({ status: 200, description: '상세한 서버 상태 정보입니다.' })
  getDetailedHealth() {
    return this.healthService.getDetailedHealthStatus();
  }
}