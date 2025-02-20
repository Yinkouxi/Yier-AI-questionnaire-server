import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Public } from 'src/auth/decorators/public.decorators';
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 创建答卷
  @Public()
  @Post()
  create(@Body() body) {
    return this.answerService.createAnswer(body);
  }
}
