import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isString } from 'class-validator';
import { Request } from 'express';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  private JWT_SECRET_KEY = this.configService.get<string>('JWT_SECRET_KEY');
  createJwt(userId: string) {
    const payload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.JWT_SECRET_KEY
    });
  }

  verifyJwt(token: string): string {
    try {
      if (!token) {
        throw new Error('no token');
      }
      const decoded = this.jwtService.verify(token, {
        secret: this.JWT_SECRET_KEY
      });
      if (!decoded.userId) throw new Error('invalid token');
      return decoded.userId;
    } catch (e) {
      if (e.name === 'TokenExpiredError') throw new HttpException('token expired', HttpStatus.UNAUTHORIZED);
      else if (e.message === 'no token') throw new HttpException('token is not found', HttpStatus.UNAUTHORIZED);
      else {
        throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
  }

  getIdFromRequest(req: Request): string {
    const auth = req.header('Authorization');
    if (!auth) {
      throw new HttpException('token is not found', HttpStatus.UNAUTHORIZED);
    }
    const token = req.header('Authorization').split(' ')[1].trim();
    if (!isString(token)) {
      throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
    }
    return this.verifyJwt(token);
  }

  async getUserGitToken(userId: string): Promise<string> {
    return await this.userService.findUserGistToken(userId);
  }
}
