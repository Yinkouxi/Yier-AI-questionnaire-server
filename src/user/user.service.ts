import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 创建用户
  async create(userData: CreateUserDto): Promise<UserDocument> {
    // 对密码进行加密
    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.SALT_ROUNDS,
    );

    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword, // 使用加密后的密码
    });
    return await createdUser.save();
  }

  // 登录验证
  async findOne(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    // 只通过用户名查找用户
    const user = await this.userModel.findOne({ username }).exec();

    // 如果用户不存在，返回null
    if (!user) {
      return null;
    }

    // 比较输入的密码和存储的哈希密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 如果密码验证成功，返回用户，否则返回null
    return isPasswordValid ? user : null;
  }

  // 添加一个辅助方法用于查找用户（不验证密码）
  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  // 用于迁移现有用户的明文密码到加密密码
  async migrateUserPassword(
    user: UserDocument,
    plainPassword: string,
  ): Promise<void> {
    // 确认明文密码正确
    if (user.password === plainPassword) {
      // 生成加密密码
      const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);

      // 更新用户密码
      user.password = hashedPassword;
      await user.save();
    }
  }
}
