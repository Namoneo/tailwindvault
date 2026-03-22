import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsIn, IsInt, Min, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @Type(() => Number)
  @IsInt()
  productId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsIn(['single', 'team'])
  licenseType: 'single' | 'team';
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
