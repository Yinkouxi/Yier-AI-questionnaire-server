import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册
  @Public()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    try {
      return await this.userService.create(userDto);
    } catch (error) {
      throw new HttpException(`注册失败: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302) // http状态码（GET） 302 临时重定向 301 永久重定向
  info() {
    return;
  }

  // 登录
  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) // http状态码（POST） 307 临时重定向 301 永久重定向
  login() {
    return;
  }
}
