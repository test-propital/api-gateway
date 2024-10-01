import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { NAST_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { AuthGuard } from 'src/auth/guards';
import { Token, User } from 'src/auth/decorators';
import { CurrenUser } from 'src/auth/interfaces/current-user.interface';
import { paginationDto } from 'src/common';
@UseGuards(AuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(@Inject(NAST_SERVICE) private readonly nastClient: ClientProxy) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    return this.nastClient.send({ cmd: 'create_asset' }, createAssetDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('owner-assets-by-user')
  async getOwnerAssetsByUserId(
    @User() user: CurrenUser,
    @Token() token: string,
  ) {
    console.log(user);
    return this.nastClient
      .send({ cmd: 'get_owner_by_authId' }, user.authId)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Get('assets-by-user-owner/:id')
  async getAssetsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationDto: paginationDto,
  ) {
    console.log(id);
    return this.nastClient
      .send({ cmd: 'get_assets_by_owner_id' }, { id, paginationDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Get('asset-byId/:id')
  async getAssetsById(@Param('id') id: string) {
    return this.nastClient.send({ cmd: 'get_asset_by_id' }, id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Get('asset-count/:id')
  async countAssetsByOwnerId(@Param('id') id: string) {
    return this.nastClient.send({ cmd: 'count_assets_by_owner_id' }, id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('random-event')
  async generateRandomAssetEvent(
    @Body() body: { id: number },
    @User() user: CurrenUser,
    @Token() token: string,
  ) {
    const payload = {
      id: body.id,
      authId: user.authId,
    };
    return this.nastClient.send({ cmd: 'random_asset_event' }, payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  // @Get()
  // findAll() {
  //   return this.assetsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.assetsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(+id, updateAssetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.assetsService.remove(+id);
  // }
}
