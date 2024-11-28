import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isString } from 'class-validator';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import { RedisRepository } from '@/redis/redis.repository';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisRepository: RedisRepository
  ) {}

  private JWT_SECRET_KEY = this.configService.get<string>('JWT_SECRET_KEY');

  initLoginTokens(userId: string) {
    const sortV = this.generateRandomKey(64);
    const accessToken = this.createAccess(userId, sortV);
    const refreshToken = this.createRefresh(userId, sortV);
    this.setRedisData(accessToken, refreshToken);
    return accessToken;
  }

  async setRedisData(access: string, refresh: string) {
    await this.redisRepository.set(access, refresh);
  }

  createAccess(userId: string, sortValue: string): string {
    const payload = { userId };
    return this.createJwt(payload, '1h', sortValue);
  }

  createRefresh(userId: string, sortValue: string): string {
    const payload = { userId, sortValue };
    return this.createJwt(payload, '1d');
  }

  createJwt(payload: any, expireTime: string, secretKey: string = this.JWT_SECRET_KEY): string {
    return this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: expireTime
    });
  }

  generateRandomKey(length: number): string {
    return randomBytes(length)
      .toString('base64') // base64 또는 hex로 인코딩 가능
      .slice(0, length) // 원하는 길이만큼 자르기
      .replace(/[^a-zA-Z0-9]/g, ''); // 특수문자 제거 (선택 사항)
  }

  async verifyJwt(token: string) {
    if (!token) {
      throw new HttpException('token is not found', HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = await this.redisRepository.get(token);
    let decodedRefresh = { sortValue: '', userId: '' };
    try {
      decodedRefresh = this.jwtService.verify(refreshToken, {
        secret: this.JWT_SECRET_KEY
      });
    } catch (e) {
      if (e.name === 'TokenExpiredError') throw new HttpException('token expired', HttpStatus.UNAUTHORIZED);
      else {
        throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: decodedRefresh.sortValue
      });
      if (!decoded.userId) throw new Error();
      return decoded.userId;
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        const newAccess = this.createAccess(decodedRefresh.userId, decodedRefresh.sortValue);
        this.setRedisData(newAccess, refreshToken);
        return decodedRefresh.userId;
      } else {
        throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
      }
    }
  }

  async getIdFromRequest(req: Request) {
    const auth = req.header('Authorization');
    if (!auth) {
      throw new HttpException('token is not found', HttpStatus.UNAUTHORIZED);
    }
    const token = req.header('Authorization').split(' ')[1].trim();
    if (!isString(token)) {
      throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
    }
    return await this.verifyJwt(token);
  }

  async getUserGitToken(userId: string): Promise<string> {
    return await this.userService.findUserGistToken(userId);
  }
}
