import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 注入用户服务
  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const { password: p, ...userInfo } = user.toObject(); // eslint-disable-line @typescript-eslint/no-unused-vars
    // return userInfo;
    return {
      token: this.JwtService.sign(userInfo),
    };
  }
}
