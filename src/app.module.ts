import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AnswerModule } from './answer/answer.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // 配置模块(读取.env文件,要写在前面)
    QuestionModule,
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    ),
    UserModule,
    AuthModule,
    AnswerModule,
    StatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
