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
  Request,
} from '@nestjs/common';

import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { RequestWithUser } from '../auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorators';

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
  create(@Request() req: RequestWithUser) {
    const { username } = req.user;
    return this.questionService.create(username);
  }

  // 查询全部问卷
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('keyword') keyword: string = '',
    @Query('isStar') isStar: boolean = false,
    @Query('isDeleted') isDeleted: boolean = false,
    @Request() req: RequestWithUser,
  ) {
    const { username } = req.user;
    const list = await this.questionService.findAllList(
      page,
      pageSize,
      keyword,
      isStar,
      isDeleted,
      username,
    );
    const count = await this.questionService.countAll(keyword, username);
    return {
      list,
      total: count,
    };
  }

  // 查询单个问卷
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    // const { username: author } = req.user;
    // return this.questionService.findOne(id, author);
    return this.questionService.findOne(id);
  }

  // 答卷：获取问卷
  @Get('answer/:id')
  getQuestion(@Param('id') id: string) {
    return this.questionService.getQuestion(id);
  }

  // 更新
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req: RequestWithUser,
  ) {
    const { username: author } = req.user;
    return this.questionService.update(id, questionDto, author);
  }

  // 删除
  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    const { username: author } = req.user;
    return this.questionService.delete(id, author);
  }

  // 删除多个
  @Delete()
  deleteMany(@Body('ids') ids: string[], @Request() req: RequestWithUser) {
    const { username: author } = req.user;
    return this.questionService.deleteMany(ids, author);
  }

  // 复制问卷
  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @Request() req: RequestWithUser) {
    const { username: author } = req.user;
    return this.questionService.duplicate(id, author);
  }
}
