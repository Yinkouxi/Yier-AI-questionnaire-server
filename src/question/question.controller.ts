import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Delete,
} from '@nestjs/common';

import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  // 依赖注入
  constructor(private readonly questionService: QuestionService) {}

  // 测试
  @Get('test')
  getTest(): string {
    throw new HttpException('测试异常', HttpStatus.BAD_REQUEST);
  }

  // 创建
  @Post()
  create() {
    return this.questionService.create();
  }

  // 查询全部问卷
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword: string = '',
  ) {
    const list = await this.questionService.findAllList(
      page,
      pageSize,
      keyword,
    );
    const count = await this.questionService.countAll(keyword);
    return {
      list,
      count,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id, 'id');
    return this.questionService.findOne(id);
  }

  // 更新
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    console.log(id, questionDto, 'body');
    return this.questionService.update(id, questionDto);
  }

  // 删除
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.questionService.delete(id);
  }
}
