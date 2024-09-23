import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://dev:devpass@localhost:5672/smartranking'],
      noAck: false,
      queue: 'challenges',
    },
  });

  await app.listen();
  logger.log('Microservice is listening');
}
bootstrap();
