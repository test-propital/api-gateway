import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { envs, REDIS_CLIENT } from 'src/config';

@Global() // Hacer el módulo global para que esté disponible en toda la aplicación
@Module({
  providers: [
    {
      provide: REDIS_CLIENT, // Proveedor de Redis
      useFactory: async () => {
        const client = createClient({ url: envs.redis_url[0] });
        await client.connect(); // Conectar el cliente Redis
        return client;
      },
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService], // Exportar el cliente y el servicio
})
export class RedisModule {}
