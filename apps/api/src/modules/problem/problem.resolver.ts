import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProblemService } from './problem.service';
import { SearchProblemDto } from './dto/problem.dto';

// GraphQL 타입들은 나중에 추가 (현재는 REST API 우선)
@Resolver('Problem')
export class ProblemResolver {
  constructor(private readonly problemService: ProblemService) {}

  @Query()
  async problems(@Args() searchDto: SearchProblemDto) {
    return this.problemService.searchProblems(searchDto);
  }

  @Query()
  async problem(@Args('id', { type: () => ID }) id: string) {
    return this.problemService.getProblemById(id);
  }

  @Query()
  async similarProblems(@Args('id', { type: () => ID }) id: string) {
    return this.problemService.getSimilarProblems(id);
  }
}