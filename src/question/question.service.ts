import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  // async findOne(id: string, author: string): Promise<Question> {
  //   const question = await this.questionModel.findOne({
  //     _id: id,
  //     author,
  //   });
  //   if (!question) {
  //     throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
  //   }
  //   return question;
  // }
  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  // 删除
  async delete(id: string, author: string) {
    // const question = await this.questionModel.findByIdAndDelete(id);
    // if (!question) {
    //   throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    // }
    // return question;
    const res = await this.questionModel.findOneAndDelete({
      _id: id,
      author,
    });
    if (!res) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
  }

  // 删除多个
  async deleteMany(ids: string[], author: string) {
    const res = await this.questionModel.deleteMany({
      _id: { $in: ids },
      author,
    });
    if (!res) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
  }

  // 更新
  async update(id: string, updateData: QuestionDto, author: string) {
    const question = await this.questionModel.findOneAndUpdate(
      { _id: id, author },
      { $set: updateData },
      { new: true },
    );
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
    return question;
  }

  // 查询全部问卷
  async findAllList(
    page: number,
    pageSize: number,
    keyword: string,
    isStar: boolean,
    isDeleted: boolean,
    username: string,
  ) {
    const whereOpt: {
      title?: { $regex: string; $options: string };
      isDeleted?: boolean;
      isStar?: boolean;
      author?: string;
    } = {};

    // 根据关键字搜索标题
    if (keyword) {
      whereOpt.title = { $regex: keyword, $options: 'i' };
    }

    // 根据条件筛选
    if (isDeleted) {
      whereOpt.isDeleted = true;
    } else {
      whereOpt.isDeleted = false;
    }

    if (isStar) {
      whereOpt.isStar = true;
    }

    // 只查询当前用户的问卷
    whereOpt.author = username;

    return await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 按id降序排序
      .skip((page - 1) * pageSize) // 跳过前page-1页
      .limit(pageSize); // 限制每页显示pageSize条
  }

  // 查询问卷数量
  async countAll(keyword: string, username: string) {
    const whereOpt: {
      title?: { $regex: string; $options: string };
      author?: string;
    } = {};

    if (keyword) {
      whereOpt.title = { $regex: keyword, $options: 'i' };
    }

    // 只统计当前用户的问卷
    whereOpt.author = username;

    return await this.questionModel.countDocuments(whereOpt);
  }

  // 复制问卷
  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }

    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new Types.ObjectId(), // 使用正确导入的 Types.ObjectId
      title: question.title + '（副本）',
      isDeleted: false,
      isStar: false,
      isPublished: false,
      componentList: question.componentList.map((component) => ({
        ...component,
        fe_id: nanoid(16),
      })),
      author,
    });

    return await newQuestion.save(); // 保存新问卷到数据库
  }

  // 答卷：获取问卷
  async getQuestion(id: string) {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new HttpException('问卷不存在', HttpStatus.NOT_FOUND);
    }
  }

  // 获取问卷总数
  async count(): Promise<number> {
    return await this.questionModel.countDocuments();
  }
}
