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
  breed: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
