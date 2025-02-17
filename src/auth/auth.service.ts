import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 注入用户服务
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    try {
      const user = await this.userService.findOne(username, password);
      if (!user) {
        throw new UnauthorizedException('用户名或密码错误');
      }

      // 从用户文档中提取需要的信息
      const { password: _, ...userInfo } = user.toObject(); // eslint-disable-line @typescript-eslint/no-unused-vars

      // 创建 JWT payload
      const payload = {
        sub: user._id.toString(), // 用户ID作为subject
        username: user.username, // 用户名
        nickname: user.nickname, // 昵称
      };

      // 返回生成的 token 和用户信息
      return {
        token: this.jwtService.sign(payload),
        // userInfo: {
        //   username: user.username,
        //   nickname: user.nickname,
        // },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('登录过程中发生错误，请稍后重试');
    }
  }
}
