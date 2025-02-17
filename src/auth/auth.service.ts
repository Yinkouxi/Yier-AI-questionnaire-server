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
    const user = await this.userService.findOne(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 从用户文档中提取需要的信息
    const { password: _, ...userInfo } = user.toObject();

    // 创建 JWT payload
    const payload = {
      sub: user._id.toString(), // 用户ID作为subject
      username: user.username, // 用户名
      nickname: user.nickname, // 昵称
    };

    // 返回生成的 token（iat 和 exp 由 JWT 服务自动添加）
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
