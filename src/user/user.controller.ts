import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    try {
      return await this.userService.create(userDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(`注册失败: ${error}`, HttpStatus.BAD_REQUEST);
    }
  }
}
