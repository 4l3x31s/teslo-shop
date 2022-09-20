import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password,10),
      });
      await this.userRepository.save(user);

      delete user.password;
      return user;

      //TODO: retornar JWT
    } catch (error) {
      this.handleDbErrors(error);
    }
    
  }

  async login(loginUserDto:LoginUserDto){
    try {
      const{password, email} = loginUserDto;

      const user = await this.userRepository.findOne({
        where: {email},
        select: {email: true, password: true}
      });
      if(!user) throw new UnauthorizedException('Creadentials are not valid');

      if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Creadentials are not valid');

      return user;

      //TODO: retornar JWT
    } catch (error) {
      this.handleDbErrors(error);
    }
  }


  private handleDbErrors(error: any): never {
    if(error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
