import { Body, Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';

type StripeEventPayload = {
  type?: string;
  data?: {
    object?: {
      orderId?: number;
      sessionId?: string;
      metadata?: {
        orderId?: number;
      };
    };
  };
};

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Body() payload: StripeEventPayload,
    @Headers('stripe-webhook-secret') webhookSecret: string,
  ) {
    const expectedSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    // Fail-closed: if secret is configured, signature must match
    if (expectedSecret) {
      if (!webhookSecret || webhookSecret !== expectedSecret) {
        throw new UnauthorizedException('Invalid webhook secret');
      }
    } else {
      // No secret configured — reject to fail closed
      throw new UnauthorizedException('Webhook secret not configured');
    }

    if (payload.type !== 'checkout.session.completed') {
      return { received: true };
    }

    const orderId = Number(payload.data?.object?.orderId ?? payload.data?.object?.metadata?.orderId);
    const sessionId = payload.data?.object?.sessionId;

    if (!orderId) {
      return { received: true, ignored: true };
    }

    const order = await this.ordersService.markPaid(orderId, sessionId);

    return {
      received: true,
      order
    };
  }
}
