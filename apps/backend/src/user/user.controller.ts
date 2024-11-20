import { Controller, Get, HttpCode, HttpException, HttpStatus, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { TokenDTO } from './dto/token.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserService } from './user.service';
import { AuthService } from '@/auth/auth.service';
import { LotusPublicDto } from '@/lotus/dto/lotus.public.dto';
import { LotusService } from '@/lotus/lotus.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lotusService: LotusService,
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}
  private OAUTH_CLIENT_ID = this.configService.get<string>('OAUTH_CLIENT_ID');
  private OAUTH_CLIENT_SECRETS = this.configService.get<string>('OAUTH_CLIENT_SECRETS');
  private OAUTH_LOGIN_CALLBACK_URL = this.configService.get<string>('OAUTH_LOGIN_CALLBACK_URL');

  private TEST_GIT_TOKEN = this.configService.get<string>('TEST_GIT_TOKEN');
  private TEST_GIT_LOGIN = this.configService.get<string>('TEST_GIT_LOGIN');
  private TEST_GIT_PROFILE = this.configService.get<string>('TEST_GIT_PROFILE');
  private TEST_GIT_ID = this.configService.get<number>('TEST_GIT_ID');

  @Get('test')
  @HttpCode(200)
  @ApiOperation({ summary: 'test용 access token 발급' })
  @ApiResponse({ status: 200, description: '실행 성공', type: TokenDTO })
  async testLogin(): Promise<TokenDTO> {
    let testUser = await this.userService.findOne(this.TEST_GIT_ID);
    if (!testUser) {
      await this.userService.saveUser(
        new UserCreateDto(
          {
            login: this.TEST_GIT_LOGIN,
            avatar_url: this.TEST_GIT_PROFILE,
            id: this.TEST_GIT_ID
          },
          this.TEST_GIT_TOKEN
        )
      );
      testUser = await this.userService.findOne(this.TEST_GIT_ID);
    }
    return TokenDTO.of(await this.userService.makeTestUser(testUser));
  }

  @Post('login')
  @Redirect()
  getGithubLoginPage() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.OAUTH_CLIENT_ID}&redirect_uri=${this.OAUTH_LOGIN_CALLBACK_URL}&scope=gist`;
    return { url: githubAuthUrl, statusCode: 301 };
  }

  @Get('login/callback')
  async githubCallback(@Query('code') code: string): Promise<TokenDTO> {
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.OAUTH_CLIENT_ID,
          client_secret: this.OAUTH_CLIENT_SECRETS,
          code
        })
      });
      const tokenData = await tokenResponse.json();
      const token = await this.userService.loginUser(tokenData);
      return TokenDTO.of(token);
    } catch (error) {
      console.error('GitHub OAuth 오류:', error);
      throw new HttpException('GitHub 인증에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/lotus')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자 lotus 목록 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: LotusPublicDto })
  @ApiQuery({ name: 'page', type: String, example: '1', required: false })
  @ApiQuery({ name: 'size', type: String, example: '10', required: false })
  getUserLotus(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('size') size: number
  ): Promise<LotusPublicDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.getUserLotus(userId, page, size);
  }
}
