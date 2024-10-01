import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NotificationGateway } from './notification.gateway';
import { catchError } from 'rxjs';
import { NAST_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards';
import { Token, User } from 'src/auth/decorators';
import { CurrenUser } from 'src/auth/interfaces/current-user.interface';
import { paginationDto } from 'src/common';
@Controller('notifications')
export class NotificationsController {
  constructor(
    @Inject(NAST_SERVICE) private readonly nastClient: ClientProxy,
    private readonly notificationsGateway: NotificationGateway,
  ) {}
  @UseGuards(AuthGuard)
  @Get('notifications-by-user')
  notificationsByUserId(
    @Query() paginationDto: paginationDto,
    @User() user: CurrenUser,
    @Token() token: string,
  ) {
    console.log(user);
    const id = user.authId;
    return this.nastClient
      .send({ cmd: 'get_notifications_by_user_id' }, { id, paginationDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @UseGuards(AuthGuard)
  @Patch('mark-as-read-by-id')
  markAsRead(@Body() body: any) {
    console.log(body);
    const { id } = body;
    return this.nastClient.send({ cmd: 'mark_notification_as_read' }, id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('count-unread-notifications-by-user')
  countUnreadNotifications(@User() user: CurrenUser, @Token() token: string) {
    console.log(user);
    const id = user.authId;
    return this.nastClient
      .send({ cmd: 'get_count_unread_notifications_by_user_id' }, id)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @UseGuards(AuthGuard)
  @Patch('read-all')
  async update(@User() user: CurrenUser, @Token() token: string) {
    const id = user.authId;
    console.log(id);
    return this.nastClient
      .send({ cmd: 'mark_all_notification_as_read' }, id)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @MessagePattern('notification.created')
  handleNotificationCreatedController(notification: any) {
    console.log(notification);
    this.notificationsGateway.sendNotificationToUser(
      notification.userId,
      notification.message,
    );
  }
}
