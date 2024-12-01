import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Redirect,
  Req
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { FileDto } from './dto/file.dto';
import { FileResponseDto } from './dto/file.response.dto';
import { TokenDTO } from './dto/token.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserPatchDTO } from './dto/user.patch.dto';
import { UserService } from './user.service';
import { AuthService } from '@/auth/auth.service';
import { ResponseAllGistsDto } from '@/gist/dto/response.allGists.dto';
import { GistService } from '@/gist/gist.service';
import { LotusPublicDto } from '@/lotus/dto/lotus.public.dto';
import { SimpleUserResponseDto } from '@/lotus/dto/simple.user.response.dto';
import { LotusService } from '@/lotus/lotus.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly lotusService: LotusService,
    private readonly authService: AuthService,
    private readonly gistService: GistService,
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

  @Get('login')
  @Redirect()
  getGithubLoginPage() {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${this.OAUTH_CLIENT_ID}&redirect_uri=${this.OAUTH_LOGIN_CALLBACK_URL}&scope=gist`;
    return { url: githubAuthUrl, statusCode: 301 };
  }

  @Get('login/callback')
  async githubCallback(@Query('code') code: string) {
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
    return { token };
  }

  @Get('/lotus')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자 lotus 목록 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: LotusPublicDto })
  @ApiQuery({ name: 'page', type: String, example: '1', required: false })
  @ApiQuery({ name: 'size', type: String, example: '10', required: false })
  getUserLotus(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ): Promise<LotusPublicDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.lotusService.getUserLotus(userId, page, size);
  }

  @Get('')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자 정보 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: SimpleUserResponseDto })
  getUserInfo(@Req() request: Request): Promise<SimpleUserResponseDto> {
    const userId = this.authService.getIdFromRequest(request);
    return this.userService.getSimpleUserInfoByUserId(userId);
  }

  @Patch('')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자 정보 수정하기' })
  @ApiBody({ type: UserPatchDTO })
  @ApiResponse({ status: 200, description: '실행 성공', type: UserPatchDTO })
  patchUserInfo(@Req() request: Request, @Body() userData: UserPatchDTO): Promise<UserPatchDTO> {
    const userId = this.authService.getIdFromRequest(request);
    return this.userService.patchUserDataByUserId(userId, userData);
  }

  @Get('gist')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자의 gist 목록 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: ResponseAllGistsDto })
  async getGistPage(
    @Req() request: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ): Promise<ResponseAllGistsDto> {
    const gitToken = await this.authService.getUserGitToken(this.authService.getIdFromRequest(request));
    return await this.gistService.getGistList(gitToken, page, size);
  }

  @Get('gist/:gistId')
  @HttpCode(200)
  @ApiOperation({ summary: '사용자의 특정 gist의 내부 파일 데이터 가져오기' })
  @ApiResponse({ status: 200, description: '실행 성공', type: FileResponseDto })
  async getCommitFile(@Req() request: Request, @Param('gistId') gistId: string) {
    const gitToken = await this.authService.getUserGitToken(this.authService.getIdFromRequest(request));
    const Files = await this.gistService.getGistById(gistId, gitToken);
    const result = Files.files.map((file) => FileDto.ofGistApiFile(file));
    return FileResponseDto.ofFiles(result);
  }
}
