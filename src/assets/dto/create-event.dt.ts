//import { EventType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssetEventDto {
  @IsNotEmpty()
  assetId: number;

  /*@IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;*/

  @IsOptional()
  @IsString()
  description?: string;
}
