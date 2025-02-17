import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 创建用户
  async create(userData: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }

  // 登录
  async findOne(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username, password }).exec();
  }
}
