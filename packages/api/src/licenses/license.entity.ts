import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../auth/auth.entity';
import { OrderEntity } from '../orders/order.entity';
import { ProductEntity } from '../products/product.entity';

@Entity('License')
export class LicenseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'active' })
  status: string;

  @Column()
  email: string;

  @Column({ type: 'integer', nullable: true })
  userId: number | null;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ type: 'datetime', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.licenses, { nullable: true, onDelete: 'SET NULL' })
  user: UserEntity | null;

  @ManyToOne(() => OrderEntity, (order) => order.licenses, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.licenses)
  product: ProductEntity;
}
