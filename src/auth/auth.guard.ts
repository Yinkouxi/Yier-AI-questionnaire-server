import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// 定义 JWT 载荷的接口
export interface JwtPayload {
  sub: string; // subject（主题）：通常是用户ID
  username: string; // 用户名
  nickname: string; // 昵称
  iat: number; // issued at（签发时间）：token的创建时间戳
  exp: number; // expiration（过期时间）：token的过期时间戳
}

// 扩展 Express 的 Request 类型
export interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('未登录或 token 已过期');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // 将解码后的用户信息附加到请求对象上
      request.user = payload;
    } catch {
      throw new UnauthorizedException('token 无效或已过期');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
