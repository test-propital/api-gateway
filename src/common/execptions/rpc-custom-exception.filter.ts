import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();
    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        messaje: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'messaje' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      status: 400,
      messaje: rpcError,
    });
  }
}
