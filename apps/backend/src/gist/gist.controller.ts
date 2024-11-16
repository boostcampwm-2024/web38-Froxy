import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GistService } from './gist.service';

@Controller('user')
export class GistController {
  constructor(private readonly gistService: GistService, private readonly configService: ConfigService) {}

  @Get('gists')
  @HttpCode(200)
  getGistPage(@Headers('Authorization') token: string, @Query('page') page: number, @Query('perPage') perPage: number) {
    //todo: token extract
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getGistList(gitToken, Number(page), Number(perPage));
  }

  @Get('')
  findLast() {
    return this.gistService.getMostRecentGistInUser();
  }

  @Get('/user')
  findUser() {
    return this.gistService.getUserData();
  }

  @Get('/:gist_id/comments')
  findComments(@Param('gist_id') gist_id: string) {
    return this.gistService.getComments(gist_id);
  }

  @Get(['/:id/commits', '/:id/commits/:pageIdx'])
  findCommits(@Param('id') id: string, @Param('pageIdx') pageIdx: number) {
    return this.gistService.getCommitsForAGist(id, pageIdx ? pageIdx : 1);
  }

  @Get(['/:id'])
  findOne(@Param('id') id: string) {
    return this.gistService.getGistById(id);
  }

  @Patch('/:gistId/comment/:commentId')
  patchComment(
    @Param('gistId') gistId: string,
    @Param('commentId') commentId: string,
    @Body('comment') comment: string
  ) {
    return this.gistService.updateComment(gistId, commentId, comment);
  }

  @Post('/:gist_id/comment')
  postComment(@Param('gist_id') gist_id: string, @Body('comment') comment: string) {
    return this.gistService.createComments(gist_id, comment);
  }

  @Delete('/:gist_id/comment/:comment_id')
  deleteComment(@Param('gist_id') gist_id: string, @Param('comment_id') comment_id: string) {
    return this.gistService.deleteComment(gist_id, comment_id);
  }

  @Get(':gist_id/commit/:id')
  getCommitFile(@Param('gist_id') gist_id: string, @Param('id') commit_id: string) {
    return this.gistService.getCommit(gist_id, commit_id);
  }
}
