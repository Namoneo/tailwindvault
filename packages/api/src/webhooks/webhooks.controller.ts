import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly ordersService: OrdersService) {}

  @Post('stripe')
  async handleStripeWebhook(@Body() payload: StripeEventPayload) {
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
