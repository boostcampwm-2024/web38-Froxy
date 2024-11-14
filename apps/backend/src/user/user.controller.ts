import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService, private configService: ConfigService) {}
  private OAUTH_CLIENT_ID = this.configService.get<string>('OAUTH_CLIENT_ID');
  private OAUTH_CLIENT_SECRETS = this.configService.get<string>('OAUTH_CLIENT_SECRETS');
  private OAUTH_LOGIN_CALLBACK_URL = this.configService.get<string>('OAUTH_LOGIN_CALLBACK_URL');

  @Get('login')
  @Redirect()
  getGithubLoginPage() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.OAUTH_CLIENT_ID}&redirect_uri=${this.OAUTH_LOGIN_CALLBACK_URL}&scope=gist`;
    return { url: githubAuthUrl, statusCode: 301 };
  }

  @Get('login/callback')
  async githubCallback(@Query('code') code: string, @Res() res) {
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
      res.json(await this.userService.loginUser(tokenData));
    } catch (error) {
      console.error('GitHub OAuth 오류:', error);
      res.status(500).send('GitHub 인증에 실패했습니다.');
    }
  }
}
