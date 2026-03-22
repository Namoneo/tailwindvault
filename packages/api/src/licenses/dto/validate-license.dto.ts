import { IsOptional, IsString } from 'class-validator';

export class ValidateLicenseDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  productSlug?: string;
}
