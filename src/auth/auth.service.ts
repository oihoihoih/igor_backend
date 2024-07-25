import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoServerError } from 'mongodb';
import * as bcryptjs from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, email } = createUserDto;

      // 1 Encriptar la contraseña
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        email,
      });

      // 2 Guardar el usuario
      await newUser.save();

      // 3 Generar el JSON Web Token
      const { password: pass, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      } else {
        // Manejo de otros posibles errores
        throw new BadRequestException(
          'An error occurred while creating the user',
        );
      }
    }
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);

    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // Usuario (email, _id)
    const { email, password } = loginDto;

    // Verificación mail
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwtToken({ id: user._id }),
    };
    // Token de acceso
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
