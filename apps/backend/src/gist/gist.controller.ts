import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GistService } from './gist.service';

@Controller('gist')
export class GistController {
  constructor(private readonly gistService: GistService) {}

  @Get()
  findAll() {
    return this.gistService.getAllGists();
  }

  @Get('/Last')
  findLast() {
    return this.gistService.getMostRecentGistInUser();
  }

  @Get('/user')
  findUser() {
    return this.gistService.getUserData();
  }

  @Get('/comments/:gist_id')
  findComments(@Param('gist_id') gist_id: string) {
    return this.gistService.getComments(gist_id);
  }

  @Get(['/commits/:id', '/commits/:id/:pageIdx'])
  findCommits(@Param('id') id: string, @Param('pageIdx') pageIdx: number) {
    return this.gistService.getCommitsForAGist(id, pageIdx ? pageIdx : 1);
  }

  @Get(['/:id'])
  findOne(@Param('id') id: string) {
    return this.gistService.getGistById(id);
  }
}
