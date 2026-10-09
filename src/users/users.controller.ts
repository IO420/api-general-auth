import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { user, token } = await this.usersService.Login(loginDto);

    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getHola() {
    console.log('hola');
  }
}
