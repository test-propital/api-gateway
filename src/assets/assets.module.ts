import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { NastModule } from 'src/transports/nast.module';

@Module({
  imports: [NastModule],
  controllers: [AssetsController],
  providers: [],
})
export class AssetsModule {}
