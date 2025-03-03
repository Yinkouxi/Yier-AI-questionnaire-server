import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({ required: true })
  title: string; // 标题

  @Prop()
  desc: string; // 描述

  @Prop({ required: true })
  author: string; // 作者

  @Prop({ default: false })
  isPublished: boolean; // 是否发布

  @Prop()
  js: string; // 脚本

  @Prop()
  css: string; // 样式

  @Prop()
  html: string; // 内容

  @Prop({ default: false })
  isStar: boolean; // 是否收藏

  @Prop({ default: false })
  isDeleted: boolean; // 是否删除

  @Prop({ default: 0 })
  answerCount: number; // 答卷数量

  @Prop()
  componentList: {
    fe_id: string; // 组件ID 前端控制和生成
    type: string; // 组件类型
    title: string; // 组件标题
    isHidden: boolean; // 是否隐藏
    isLocked: boolean; // 是否锁定
    props: object; // 组件属性
  }[];
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
