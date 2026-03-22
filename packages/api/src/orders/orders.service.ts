import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, In } from 'typeorm';
import { LicenseEntity } from '../licenses/license.entity';
import { ProductEntity } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

type RequestUser = {
  userId: number;
  email: string;
  role: string;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(LicenseEntity)
    private readonly licenseRepository: Repository<LicenseEntity>,
    private readonly configService: ConfigService
  ) {}

  async create(createOrderDto: CreateOrderDto, user?: RequestUser) {
    const requestedProductIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productRepository.findBy({ id: In(requestedProductIds) });
    const productMap = new Map(products.map((product) => [product.id, product]));

    if (products.length !== requestedProductIds.length) {
      throw new NotFoundException('One or more products could not be found.');
    }

    const subtotal = createOrderDto.items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      const unitPrice = item.licenseType === 'team' ? product!.teamPrice : product!.price;
      return sum + unitPrice * item.quantity;
    }, 0);

    const order = await this.orderRepository.save(
      this.orderRepository.create({
        email: createOrderDto.email.trim().toLowerCase(),
        userId: user?.userId ?? null,
        status: 'pending',
        subtotal,
        total: subtotal,
        checkoutUrl: null,
        stripeSessionId: null
      })
    );

    const items = createOrderDto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      return this.orderItemRepository.create({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        quantity: item.quantity,
        unitPrice: item.licenseType === 'team' ? product.teamPrice : product.price,
        licenseType: item.licenseType
      });
    });

    await this.orderItemRepository.save(items);

    const sessionId = `mock_cs_${order.id}_${Date.now()}`;
    const storefrontUrl = this.configService.get<string>('STOREFRONT_URL', 'http://localhost:4200');
    order.stripeSessionId = sessionId;
    order.checkoutUrl = `${storefrontUrl}/checkout?orderId=${order.id}&session_id=${sessionId}&success=1&mockStripe=1`;
    await this.orderRepository.save(order);

    const savedOrder = await this.orderRepository.findOneOrFail({
      where: { id: order.id },
      relations: {
        items: true
      }
    });

    return this.serializeOrder(savedOrder);
  }

  async findForUser(user: RequestUser) {
    const where =
      user.role === 'admin'
        ? {}
        : [
            { userId: user.userId },
            { email: user.email.toLowerCase() }
          ];

    const orders = await this.orderRepository.find({
      where,
      relations: { items: true, licenses: true },
      order: { createdAt: 'DESC' }
    });

    return orders.map((order) => this.serializeOrder(order));
  }

  async markPaid(orderId: number, sessionId?: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { items: true, licenses: true }
    });

    if (!order) {
      throw new NotFoundException(`Order #${orderId} was not found.`);
    }

    if (sessionId && order.stripeSessionId && order.stripeSessionId !== sessionId) {
      throw new NotFoundException('Checkout session does not match the order.');
    }

    if (order.status !== 'paid') {
      order.status = 'paid';
      order.paidAt = new Date();
      await this.orderRepository.save(order);

      const existingLicenseCount = await this.licenseRepository.count({
        where: { orderId: order.id }
      });

      if (existingLicenseCount === 0) {
        const licenses: LicenseEntity[] = [];

        for (const item of order.items) {
          for (let index = 0; index < item.quantity; index += 1) {
            licenses.push(
              this.licenseRepository.create({
                code: this.generateLicenseCode(order.id, item.productId, index),
                status: 'active',
                email: order.email,
                userId: order.userId,
                orderId: order.id,
                productId: item.productId,
                downloadCount: 0,
                expiresAt: null
              })
            );
          }
        }

        await this.licenseRepository.save(licenses);
      }
    }

    const paidOrder = await this.orderRepository.findOneOrFail({
      where: { id: order.id },
      relations: { items: true, licenses: true }
    });

    return this.serializeOrder(paidOrder);
  }

  private serializeOrder(order: OrderEntity) {
    return {
      id: order.id,
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      email: order.email,
      checkoutUrl: order.checkoutUrl ?? undefined,
      sessionId: order.stripeSessionId ?? undefined,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      items:
        order.items?.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          licenseType: item.licenseType
        })) ?? [],
      licenses:
        order.licenses?.map((license) => ({
          id: license.id,
          code: license.code,
          status: license.status
        })) ?? []
    };
  }

  private generateLicenseCode(orderId: number, productId: number, offset: number) {
    const uniqueChunk = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `TV-${orderId}-${productId}-${offset + 1}-${uniqueChunk}`;
  }
}
