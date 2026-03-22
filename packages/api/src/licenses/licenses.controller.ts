import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidateLicenseDto } from './dto/validate-license.dto';
import { LicensesService } from './licenses.service';

@ApiTags('licenses')
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findForUser(@Req() request: { user: { userId: number; email: string; role: string } }) {
    return this.licensesService.findForUser(request.user);
  }

  @Post('validate')
  validate(@Body() validateLicenseDto: ValidateLicenseDto) {
    return this.licensesService.validate(validateLicenseDto);
  }
}
