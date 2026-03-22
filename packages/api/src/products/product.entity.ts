import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LicenseEntity } from '../licenses/license.entity';
import { OrderItemEntity } from '../orders/order-item.entity';

@Entity('Product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  price: number;

  @Column()
  teamPrice: number;

  @Column()
  previewImageUrl: string;

  @Column()
  downloadUrl: string;

  @Column({ type: 'text', default: '[]' })
  featuresJson: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.product)
  orderItems: OrderItemEntity[];

  @OneToMany(() => LicenseEntity, (license) => license.product)
  licenses: LicenseEntity[];
}
