import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { NastModule } from 'src/transports/nast.module';

@Module({
  imports: [NastModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
