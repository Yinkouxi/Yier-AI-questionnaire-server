import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop()
  questionId: string; // 对应问卷的_id

  @Prop()
  answerList: {
    componentFeId: string; // 对应组件的fe_id
    value: string[]; // 答案
  }[];

  @Prop()
  fingerprint: string; // 浏览器指纹

  @Prop()
  breed: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

// 创建复合索引以确保一个指纹只能提交一次问卷
AnswerSchema.index({ questionId: 1, fingerprint: 1 }, { unique: true });
