import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findForUser(@Req() request: { user: { userId: number; email: string; role: string } }) {
    return this.ordersService.findForUser(request.user);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() request: { user?: { userId: number; email: string; role: string } }) {
    return this.ordersService.create(createOrderDto, request.user);
  }
}
