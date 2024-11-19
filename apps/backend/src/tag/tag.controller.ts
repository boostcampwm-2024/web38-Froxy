import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagCreateRequestDto } from './dto/tag.createRequest.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createtag(@Body() tagCreateRequestDto: TagCreateRequestDto): any {
    return this.tagService.createTag(tagCreateRequestDto.tag);
  }

  @Get()
  searchTag(@Query('keyword') keyword: string) {
    return this.tagService.serachTag(keyword);
  }
}
