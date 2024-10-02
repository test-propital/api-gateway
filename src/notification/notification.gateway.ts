import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { envs } from 'src/config';

@WebSocketGateway(envs.socket_port, {
  namespace: 'notifications',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly notificationService: NotificationService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;

    await this.notificationService.registerClient(userIdString, client.id);
    console.log(
      `Cliente conectado: ${client.id} para el usuario: ${userIdString}`,
    );
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;

    await this.notificationService.unregisterClient(userIdString);
    console.log(
      `Cliente desconectado: ${client.id} para el usuario: ${userIdString}`,
    );
  }

  // Método para enviar notificaciones a un usuario específico
  async sendNotificationToUser(userId: string, message: any) {
    await this.notificationService.sendNotificationToUser(
      userId,
      message,
      this.server,
    );
  }
}
