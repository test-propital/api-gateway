import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';

import { AssetsModule } from './assets/assets.module';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [AuthModule, NotificationModule, AssetsModule,HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
