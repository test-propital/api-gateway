import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';

import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [AuthModule, NotificationModule, AssetsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
