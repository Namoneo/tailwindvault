import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './auth.entity';
import { RegisterDto } from './dto/register.dto';

const bcrypt = require('bcryptjs') as {
  hash(value: string, rounds: number): Promise<string>;
  compare(value: string, encryptedValue: string): Promise<boolean>;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const email = registerDto.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new ConflictException('A user with that email already exists.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      name: registerDto.name.trim(),
      email,
      passwordHash,
      role: 'customer'
    });

    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    return passwordMatches ? user : null;
  }

  async profile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.serializeUser(user);
  }

  login(user: UserEntity) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.serializeUser(user)
    };
  }

  private serializeUser(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
