import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel) {}

  // 创建用户
  async create(userData: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }

  // 登录
  async findOne(username: string, password: string): Promise<User | null> {
    return await this.userModel.findOne({ username, password }).exec();
  }
}
