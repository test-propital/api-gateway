import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  SOCKET_PORT: number;
  //PRODUCTS_MICROSERVICES_HOST: string;
  // PRODUCTS_MICROSERVICES_PORT: number;
  // ORDERS_MICROSERVICES_HOST: string;
  // ORDERS_MICROSERVICES_PORT: number;
  REDIS_CLIENT:string[]
  NAST_SERVERS: string[];
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    SOCKET_PORT: joi.number().required(),
    //PRODUCTS_MICROSERVICES_HOST: joi.string().required(),
    //PRODUCTS_MICROSERVICES_PORT: joi.number().required(),
    //ORDERS_MICROSERVICES_HOST: joi.string().required(),
    //ORDERS_MICROSERVICES_PORT: joi.string().required(),

    NAST_SERVERS: joi.array().items(joi.string().required()).required(),
    REDIS_CLIENT: joi.array().items(joi.string().required()).required(),
  })
  .unknown(true);
const { error, value } = envSchema.validate({
  ...process.env,
  NAST_SERVERS: process.env.NAST_SERVERS?.split(','),
  REDIS_CLIENT: process.env.REDIS_CLIENT?.split(','),
});

if (error) {
  throw new Error(`Config validation error ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  socket_port: envVars.SOCKET_PORT,
  //products_microservices_host: envVars.PRODUCTS_MICROSERVICES_HOST,
  //products_microservices_port: envVars.PRODUCTS_MICROSERVICES_PORT,
  //orders_microservices_host: envVars.ORDERS_MICROSERVICES_HOST,
  //orders_microservices_port: envVars.ORDERS_MICROSERVICES_PORT,
  redis_url: envVars.REDIS_CLIENT,
  nast_servers: envVars.NAST_SERVERS,
};
