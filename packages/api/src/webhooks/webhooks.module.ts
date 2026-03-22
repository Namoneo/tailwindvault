import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from '../orders/orders.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [ConfigModule, OrdersModule],
  controllers: [WebhooksController]
})
export class WebhooksModule {}
