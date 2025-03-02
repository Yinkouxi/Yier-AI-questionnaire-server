import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer, AnswerSchema } from './schema/answer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from '../question/schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  exports: [AnswerService],
  providers: [AnswerService],
  controllers: [AnswerController],
})
export class AnswerModule {}
