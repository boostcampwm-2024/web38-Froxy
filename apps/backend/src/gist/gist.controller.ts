import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { GistService } from './gist.service';
import { AuthService } from '@/auth/auth.service';

@Controller('user')
export class GistController {
  constructor(
    private readonly gistService: GistService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Get('gists')
  @HttpCode(200)
  async getGistPage(@Req() request: Request, @Query('page') page: number, @Query('perPage') perPage: number) {
    const gitToken = await this.authService.getUserGitToken(this.authService.getIdFromRequest(request));
    return await this.gistService.getGistList(gitToken, Number(page), Number(perPage));
  }

  @Get('')
  findLast() {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getMostRecentGistInUser(gitToken);
  }

  @Get('/user')
  findUser() {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getUserData(gitToken);
  }

  @Get('/:gist_id/comments')
  findComments(@Param('gist_id') gist_id: string) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getComments(gitToken, gist_id);
  }

  @Get(['/:id/commits', '/:id/commits/:pageIdx'])
  findCommits(@Param('id') id: string, @Param('pageIdx') pageIdx: number) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getCommitsForAGist(id, pageIdx ? pageIdx : 1, gitToken);
  }

  //@Get(['/:id'])
  findOne(@Param('id') id: string) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getGistById(id, gitToken);
  }

  @Patch('/:gistId/comment/:commentId')
  patchComment(
    @Param('gistId') gistId: string,
    @Param('commentId') commentId: string,
    @Body('comment') comment: string
  ) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.updateComment(gitToken, gistId, commentId, comment);
  }

  @Post('/:gist_id/comment')
  postComment(@Param('gist_id') gist_id: string, @Body('comment') comment: string) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.createComments(gitToken, gist_id, comment);
  }

  @Delete('/:gist_id/comment/:comment_id')
  deleteComment(@Param('gist_id') gist_id: string, @Param('comment_id') comment_id: string) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.deleteComment(gitToken, gist_id, comment_id);
  }

  @Get(':gist_id/commit/:id')
  getCommitFile(@Param('gist_id') gist_id: string, @Param('id') commit_id: string) {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getCommit(gist_id, commit_id, gitToken);
  }
}
