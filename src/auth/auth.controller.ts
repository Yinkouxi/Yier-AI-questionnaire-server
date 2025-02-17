import { Controller, Post, Body, Get, Request } from '@nestjs/common';
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
    return this.authService.signIn(userInfo.username, userInfo.password);
  }

  // 获取用户信息
  // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
