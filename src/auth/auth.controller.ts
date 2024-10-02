import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NAST_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrenUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NAST_SERVICE) private readonly nastClient: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.nastClient.send('auth.register.user', registerUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    return this.nastClient.send('auth.login.user', loginUserDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user: CurrenUser, @Token() token: string) {
    return {
      user,
      token,
    };
  }
}
