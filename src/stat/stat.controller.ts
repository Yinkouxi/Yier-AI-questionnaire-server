import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Public()
  @Get('platform/overview')
  async getPlatformStats() {
    return await this.statService.getPlatformStats();
  }

  @Public()
  @Get(':questionId')
  getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.statService.getQuestionStatListAndCount(questionId, {
      page,
      pageSize,
    });
    // return {
    //   test: 'hhhh',
    // };
  }

  @Public()
  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string,
  ) {
    const stat = await this.statService.getComponentStat(
      questionId,
      componentFeId,
    );
    return { stat };
  }
}
