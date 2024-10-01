import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const type = ctx.getType();
    let user;

    if (type === 'http') {
      const request = ctx.switchToHttp().getRequest();
      user = request.user;
    } else if (type === 'ws') {
      const client = ctx.switchToWs().getClient<Socket>();
      user = client.data.user; // Obtener el usuario almacenado en client.data
    }

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return user;
  },
);
