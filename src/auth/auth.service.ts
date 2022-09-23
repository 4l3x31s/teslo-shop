import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }
  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };

      //TODO: retornar JWT
    } catch (error) {
      this.handleDbErrors(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }
      });
      if (!user) throw new UnauthorizedException('Creadentials are not valid');

      if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Creadentials are not valid');

      return { ...user, token: this.getJwtToken({ id: user.id }) };

      //TODO: retornar JWT
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async checkAuthStatus(userInput: User) {
    try {

      return { ...userInput, token: this.getJwtToken({ id: userInput.id }) };

      //TODO: retornar JWT
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
