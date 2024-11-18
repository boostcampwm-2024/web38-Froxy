import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GistService } from './gist.service';

@Controller('user')
export class GistController {
  constructor(private readonly gistService: GistService, private readonly configService: ConfigService) {}

  @Get('gists')
  @HttpCode(200)
  getGistPage(
    @Headers('Authorization') token: string,
    @Query('page') page: number,
    @Query('per_page') per_page: number
  ) {
    //todo: token extract
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getGistList(gitToken, Number(page), Number(per_page));
  }

  @Get('/Last')
  findLast() {
    return this.gistService.getMostRecentGistInUser();
  }

  @Get('/user')
  findUser() {
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getUserData(gitToken);
  }

  @Get('/:gist_id/comments')
  findComments(@Param('gist_id') gist_id: string) {
    return this.gistService.getComments(gist_id);
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

  @Patch('/:gist_id/comment/:comment_id')
  patchComment(
    @Param('gist_id') gist_id: string,
    @Param('comment_id') comment_id: string,
    @Body('comment') comment: string
  ) {
    return this.gistService.updateComment(gist_id, comment_id, comment);
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
    const gitToken = this.configService.get<string>('GIT_TOKEN');
    return this.gistService.getCommit(gist_id, commit_id, gitToken);
  }
}
