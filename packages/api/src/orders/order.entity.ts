import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../auth/auth.entity';
import { LicenseEntity } from '../licenses/license.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity('Order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'integer', nullable: true })
  userId: number | null;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  subtotal: number;

  @Column()
  total: number;

  @Column({ type: 'text', nullable: true })
  checkoutUrl: string | null;

  @Column({ type: 'text', nullable: true })
  stripeSessionId: string | null;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders, { nullable: true, onDelete: 'SET NULL' })
  user: UserEntity | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @OneToMany(() => LicenseEntity, (license) => license.order)
  licenses: LicenseEntity[];
}
