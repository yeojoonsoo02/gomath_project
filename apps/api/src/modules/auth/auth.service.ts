import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  // Mock 인증 서비스 (실제 JWT 구현 전까지 사용)
  
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    // Mock 인증 - 실제로는 데이터베이스에서 사용자 확인
    if (username === 'demo' && password === 'demo123') {
      return {
        success: true,
        user: {
          id: 'user_1',
          username: 'demo',
          email: 'demo@gomath.app',
          displayName: '데모 사용자',
        },
        tokens: {
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiresIn: 3600,
        },
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async register(registerDto: any) {
    // Mock 회원가입
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: `user_${Date.now()}`,
        username: registerDto.username,
        email: registerDto.email,
        displayName: registerDto.displayName,
      },
    };
  }

  async refresh(refreshToken: string) {
    // Mock 토큰 갱신
    if (refreshToken === 'mock_refresh_token') {
      return {
        success: true,
        tokens: {
          accessToken: 'new_mock_access_token',
          refreshToken: 'new_mock_refresh_token',
          expiresIn: 3600,
        },
      };
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async logout(refreshToken: string) {
    // Mock 로그아웃
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }

  async validateToken(token: string) {
    // Mock 토큰 검증
    if (token === 'mock_access_token' || token === 'new_mock_access_token') {
      return {
        id: 'user_1',
        username: 'demo',
        email: 'demo@gomath.app',
      };
    }
    
    return null;
  }
}