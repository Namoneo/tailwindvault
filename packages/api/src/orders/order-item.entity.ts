import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../products/product.entity';
import { OrderEntity } from './order.entity';

@Entity('OrderItem')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column()
  productSlug: string;

  @Column({ default: 1 })
  quantity: number;

  @Column()
  unitPrice: number;

  @Column({ default: 'single' })
  licenseType: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems)
  product: ProductEntity;
}
