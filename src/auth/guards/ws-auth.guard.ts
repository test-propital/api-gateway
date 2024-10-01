import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NAST_SERVICE } from 'src/config';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('init');

    const wsContext = context.switchToWs();
    const client = wsContext.getClient();

    // Extraer el token desde la query de la conexión WebSocket
    const token = this.extractTokenFromQuery(client.handshake.query);

    console.log('------------guard');
    console.log('Token extraído:', token);

    if (!token) {
      console.log('No se proporcionó el token.');
      throw new UnauthorizedException();
    }

    try {
      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );
      client.data.user = user;
      client.data.token = newToken;
      console.log('Autenticación exitosa:', user);
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromQuery(query: any): string | undefined {
    // Obtener el token de la query
    return query.token; // Asegúrate de que el cliente esté enviando el token como 'token'
  }
}
