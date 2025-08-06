import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation()
  async login(@Args('username') username: string, @Args('password') password: string) {
    return this.authService.login({ username, password });
  }

  @Mutation()
  async register(@Args('input') input: any) {
    return this.authService.register(input);
  }
}