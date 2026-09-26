import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
    });
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async findOneByName(userName: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { userName } });
  }

  async createUser(user: CreateUserDto) {
    const found = await this.findOneByName(user.userName);

    if (found) {
      throw new BadRequestException('Error: change the user name');
    }

    const hashedPassword = await this.hashPassword(user.password);

    const created = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    
    return await this.userRepository.save(created);
  }

  async Login(loginDto: LoginDto) {
    const user = await this.findOneByName(loginDto.userName);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
