import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private jwtService: JwtService) {}

  private JWT_SECRET_KEY = this.configService.get<string>('JWT_SECRET_KEY');
  createJwt(user_id: string) {
    const payload = { user_id };
    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_KEY
    });
  }

  async verifyJwt(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.JWT_SECRET_KEY
      });
      return decoded;
    } catch (e) {
      if (e.name === 'TokenExpiredError') throw new Error('401');
      else {
        throw new Error('401');
      }
    }
  }
}
