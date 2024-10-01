import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisService } from 'src/transports/redis.service'; // Asegúrate de que esta ruta es correcta

@Injectable()
export class NotificationService {
  constructor(private readonly redisService: RedisService) {}

  async registerClient(userId: string, socketId: string) {
    // Verificar si el usuario ya está registrado
    const existingSocketId = await this.redisService.get(`socket:${userId}`);
    if (existingSocketId) {
      console.log(
        `El usuario ${userId} ya está registrado con socket ID: ${existingSocketId}.`,
      );
      return; // Salir si el usuario ya está registrado
    }

    // Almacena el socket ID del usuario en Redis
    await this.redisService.set(`socket:${userId}`, socketId);
    console.log(`Cliente registrado: ${userId} con socket ID: ${socketId}`);
  }

  async unregisterClient(userId: string) {
    // Verificar si el usuario está registrado antes de intentar eliminarlo
    const existingSocketId = await this.redisService.get(`socket:${userId}`);
    if (!existingSocketId) {
      console.log(
        `El usuario ${userId} no está registrado, no se puede desregistrar.`,
      );
      return; // Salir si el usuario no está registrado
    }

    // Elimina el socket ID del usuario de Redis
    await this.redisService.del(`socket:${userId}`);
    console.log(`Cliente desregistrado: ${userId}`);
  }

  async sendNotification(notification: any, server: Server) {
    console.log('Enviando notificación:', notification);
    server.emit('notification', notification); // Emitir la notificación a todos los clientes conectados
    await this.redisService.set(
      `notification:${notification.id}`,
      JSON.stringify(notification),
    ); // Almacena la notificación en Redis
  }

  async sendNotificationToUser(userId: string, message: any, server: Server) {
    const socketId = await this.redisService.get(`socket:${userId}`); // Busca el socket ID del usuario en Redis

    if (socketId) {
      server.to(socketId).emit('notification', message); // Envía la notificación solo al cliente específico
      console.log(`Notificación enviada a ${userId}:`, message);
    } else {
      console.log(`Usuario ${userId} no conectado.`);
    }
  }
}
