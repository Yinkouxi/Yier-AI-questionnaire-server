import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { QuestionDto } from './dto/question.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // 创建问卷
  async create(username: string) {
    // 生成问卷ID
    const fe_id = nanoid(16); // 直接生成16位的ID
    const question = new this.questionModel({
      title: '文件标题' + Date.now(),
      desc: '问卷描述' + Date.now(),
      author: username, // 添加创建者信息
      componentList: [
        {
          fe_id,
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述' },
        },
      ],
    });
    return await question.save();
  }

  // 查询单个问卷
  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  // 删除
  async delete(id: string) {
    const question = await this.questionModel.findByIdAndDelete(id);
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  // 更新
  async update(id: string, updateData: QuestionDto) {
    const question = await this.questionModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  // 查询全部问卷
  async findAllList(page: number, pageSize: number, keyword: string) {
    const whereOpt: { title?: { $regex: string; $options: string } } = {};
    if (keyword) {
      // 模糊搜索
      whereOpt.title = { $regex: keyword, $options: 'i' };
    }
    return await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 按id降序排序
      .skip((page - 1) * pageSize) // 跳过前page-1页
      .limit(pageSize); // 限制每页显示pageSize条
  }

  // 查询问卷数量
  async countAll(keyword: string) {
    const whereOpt: { title?: { $regex: string; $options: string } } = {};
    if (keyword) {
      // 模糊搜索
      whereOpt.title = { $regex: keyword, $options: 'i' };
    }
    return await this.questionModel.countDocuments(whereOpt);
  }
}
