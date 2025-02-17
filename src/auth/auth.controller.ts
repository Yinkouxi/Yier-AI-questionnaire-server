import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RequestWithUser } from './auth.guard';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录
  @Public()
  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    // 判断登录信息完整性
    if (!userInfo || !userInfo.username || !userInfo.password) {
      throw new BadRequestException('请提供用户名和密码');
    }

    // 验证用户名密码格式
    if (userInfo.username.length < 3) {
      throw new BadRequestException('用户名长度不能小于3位');
    }
    if (userInfo.password.length < 6) {
      throw new BadRequestException('密码长度不能小于6位');
    }

    return this.authService.signIn(userInfo.username, userInfo.password);
  }

  // 获取用户信息
  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
