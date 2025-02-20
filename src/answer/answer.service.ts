import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './schema/answer.schema';

interface AnswerInfo {
  questionId: string;
  answerList: Array<{
    componentFeId: string; // 前端传来的是 componentFeId
    value: string | string[];
  }>;
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

    // 验证每个答案的 componentFeId 是否存在
    if (!answerInfo.answerList?.length) {
      throw new HttpException('答案列表不能为空', HttpStatus.BAD_REQUEST);
    }

    // 直接使用前端传来的数据，因为字段名已经一致
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }

  // 统计答卷数量
  async countAnswers(questionId: string) {
    if (!questionId) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }
    return await this.answerModel.countDocuments({ questionId });
  }

  // 查询答卷列表
  async findAllAnswers(
    questionId: string,
    opt: { page: number; pageSize: number },
  ) {
    if (!questionId) {
      return [];
    }
    const { page = 1, pageSize = 10 } = opt;
    const skip = (page - 1) * pageSize;
    const answers = await this.answerModel
      .find({ questionId })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    return answers;
  }
}
