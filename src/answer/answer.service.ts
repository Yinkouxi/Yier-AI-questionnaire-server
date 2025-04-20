import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './schema/answer.schema';
import { Question } from '../question/schemas/question.schema';

interface AnswerInfo {
  questionId: string;
  fingerprint: string;
  answerList: Array<{
    componentFeId: string; // 前端传来的是 componentFeId
    value: string | string[];
  }>;
}

@Injectable()
export class AnswerService {
  // 注入Answer模型
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // 创建答卷
  async createAnswer(answerInfo: AnswerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }

    if (!answerInfo.fingerprint) {
      throw new HttpException('缺少浏览器指纹', HttpStatus.BAD_REQUEST);
    }

    // 验证每个答案的 componentFeId 是否存在
    if (!answerInfo.answerList?.length) {
      throw new HttpException('答案列表不能为空', HttpStatus.BAD_REQUEST);
    }

    // 打印用户提交信息
    console.log('收到问卷提交:');
    console.log(`问卷ID: ${answerInfo.questionId}`);
    console.log(`用户指纹: ${answerInfo.fingerprint}`);
    console.log('提交答案:');
    answerInfo.answerList.forEach((answer) => {
      console.log(
        `- 组件ID: ${answer.componentFeId}, 答案: ${JSON.stringify(answer.value)}`,
      );
    });
    console.log('----------------------------------');

    try {
      // 检查是否已经提交过
      const existingAnswer = await this.answerModel.findOne({
        questionId: answerInfo.questionId,
        fingerprint: answerInfo.fingerprint,
      });

      if (existingAnswer) {
        console.log(
          `用户(${answerInfo.fingerprint})重复提交问卷(${answerInfo.questionId})`,
        );
        throw new HttpException(
          '您已经提交过该问卷，不能重复提交',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 创建答卷
      const answer = new this.answerModel(answerInfo);
      await answer.save();

      // 更新问卷的答卷数量
      await this.questionModel.findByIdAndUpdate(answerInfo.questionId, {
        $inc: { answerCount: 1 },
      });

      console.log(
        `问卷(${answerInfo.questionId})提交成功, 答卷ID: ${answer._id.toString()}`,
      );

      return {
        errno: 0,
        data: answer,
        msg: '提交成功',
      };
    } catch (error: any) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        // MongoDB 重复键错误
        console.log(
          `用户(${answerInfo.fingerprint})重复提交问卷(${answerInfo.questionId}) - 数据库索引检测`,
        );
        throw new HttpException(
          '您已经提交过该问卷，不能重复提交',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 如果是我们抛出的 HttpException，直接向上传递
      if (error instanceof HttpException) {
        throw error;
      }

      // 其他错误
      console.error('问卷提交失败:', error);
      throw new HttpException('提交失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  // 获取总答卷数
  async count(): Promise<number> {
    return await this.answerModel.countDocuments();
  }
}
