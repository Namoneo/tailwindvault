import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/auth.entity';
import { DownloadsModule } from './downloads/downloads.module';
import { LicenseEntity } from './licenses/license.entity';
import { LicensesModule } from './licenses/licenses.module';
import { OrderEntity } from './orders/order.entity';
import { OrderItemEntity } from './orders/order-item.entity';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductEntity } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'prisma', 'dev.db'),
      entities: [UserEntity, ProductEntity, OrderEntity, OrderItemEntity, LicenseEntity],
      autoLoadEntities: true,
      synchronize: false
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    LicensesModule,
    DownloadsModule,
    WebhooksModule
  ]
})
export class AppModule {}
