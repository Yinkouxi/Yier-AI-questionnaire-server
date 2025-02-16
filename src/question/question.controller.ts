import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  // 测试
  @Get('test')
  getTest(): string {
    throw new HttpException('测试异常', HttpStatus.BAD_REQUEST);
  }
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
  ) {
    console.log(page, pageSize, keyword);
    return {
      list: ['question1', 'question2', 'question3'],
      count: 3,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id, 'id');
    return {
      id,
      title: 'question1',
      desc: 'content1',
    };
  }

  // 更新
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    console.log(id, questionDto, 'body');
    return {
      id,
      title: questionDto.title,
      desc: questionDto.desc,
    };
  }
}
