import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(1)
  teamPrice: number;

  @IsString()
  previewImageUrl: string;

  @IsString()
  downloadUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}
