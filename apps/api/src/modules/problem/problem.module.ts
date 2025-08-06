import { Module } from '@nestjs/common';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemResolver } from './problem.resolver';

@Module({
  controllers: [ProblemController],
  providers: [ProblemService, ProblemResolver],
  exports: [ProblemService],
})
export class ProblemModule {}