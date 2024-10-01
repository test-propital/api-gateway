import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationsController } from './notification.controler';
import { NastModule } from 'src/transports/nast.module';
import { RedisModule } from 'src/transports/redis.module';

@Module({
  imports: [NastModule, RedisModule],
  providers: [NotificationGateway, NotificationService],
  controllers: [NotificationsController],
})
export class NotificationModule {}
