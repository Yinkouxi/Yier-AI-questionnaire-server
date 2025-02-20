import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './schema/answer.schema';

interface AnswerInfo {
  questionId: string;
  [key: string]: any;
}

@Injectable()
export class AnswerService {
  // 注入Answer模型
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  // 创建答卷
  async createAnswer(answerInfo: AnswerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }
}
