import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  // 注入用户服务
  constructor(private readonly userService: UserService) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const { password: p, ...userInfo } = user.toObject(); // eslint-disable-line @typescript-eslint/no-unused-vars
    return userInfo;
  }
}
