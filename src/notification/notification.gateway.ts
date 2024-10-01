import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service'; // Ajusta la ruta

@WebSocketGateway(3001, {
  namespace: 'notifications',
  cors: {
    origin: '*', // Cambia según el origen de tu frontend
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
  // async handleConnection(client: Socket) {
  //   const userId = client.handshake.query.userId;
  //   console.log(userId);
  //   const userIdString = Array.isArray(userId) ? userId[0] : userId;

  //   await this.notificationService.registerClient(userIdString, client.id);
  //   console.log(
  //     `Cliente conectado: ${client.id} para el usuario: ${userIdString}`,
  //   );
  // }

  // async handleDisconnect(client: Socket) {
  //   const userId = client.handshake.query.userId;

  //   // Asegúrate de que userId es un string
  //   const userIdString = Array.isArray(userId) ? userId[0] : userId;

  //   await this.notificationService.unregisterClient(userIdString);
  //   console.log(
  //     `Cliente desconectado: ${client.id} para el usuario: ${userIdString}`,
  //   );
  // }

  // @SubscribeMessage('newNotification')
  // handleNotification(client: Socket, payload: any): string {
  //   return `Notificación recibida para cliente ${client.id}: ${payload.message}`;
  // }

  // async handleNotificationCreated(notification: any) {
  //   await this.notificationService.sendNotification(notification, this.server);
  // }

  // async sendNotificationToUser(userId: string, message: any) {
  //   await this.notificationService.sendNotificationToUser(
  //     userId,
  //     message,
  //     this.server,
  //   );
  // }
}
