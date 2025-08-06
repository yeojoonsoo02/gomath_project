import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';

// GraphQL 타입들은 나중에 추가 (현재는 REST API 우선)
@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  async userProfile() {
    return this.userService.getMockProfile();
  }

  @Query()
  async userProgress() {
    return this.userService.getMockProgress();
  }

  @Query()
  async userAchievements() {
    return this.userService.getMockAchievements();
  }
}