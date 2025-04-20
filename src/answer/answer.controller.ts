import { Controller, Post, Body, Req } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { Public } from 'src/auth/decorators/public.decorators';
import { Request } from 'express';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 创建答卷
  @Public()
  @Post()
  create(@Body() body, @Req() request: Request) {
    console.log('接收到新的答卷提交请求');
    const ipHeader = request.headers['x-forwarded-for'];
    const ip =
      request.ip ||
      (typeof ipHeader === 'string'
        ? ipHeader
        : Array.isArray(ipHeader)
          ? ipHeader[0]
          : '未知IP');
    console.log(`请求IP: ${ip}`);

    const userAgent = request.headers['user-agent'];
    console.log(`提交时间: ${new Date().toISOString()}`);
    console.log(
      `用户代理: ${typeof userAgent === 'string' ? userAgent : '未知'}`,
    );

    return this.answerService.createAnswer(body);
  }
}
