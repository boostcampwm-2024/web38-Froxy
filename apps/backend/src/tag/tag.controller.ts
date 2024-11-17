import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagCreateRequestDto } from './dto/tag.createRequest.dto copy';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  getHello(@Body() tagCreateRequestDto: TagCreateRequestDto): any {
    return this.tagService.createTag(tagCreateRequestDto.tag);
  }
}
