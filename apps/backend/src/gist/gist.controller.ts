import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GistService } from './gist.service';

@Controller('gist')
export class GistController {
  constructor(private readonly gistService: GistService) {}

  @Get()
  findAll() {
    return this.gistService.getAllGists();
  }

  @Get(['/commits/:id', '/commits/:id/:pageIdx'])
  findOne(@Param('id') id: string, @Param('pageIdx') pageIdx: number) {
    return this.gistService.getCommitsForAGist(id, pageIdx ? pageIdx : 1);
  }
}
