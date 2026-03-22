import { Controller, Get, Param, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':licenseId/:productSlug')
  async download(
    @Param('licenseId', ParseIntPipe) licenseId: number,
    @Param('productSlug') productSlug: string,
    @Res() response: Response
  ) {
    const downloadUrl = await this.downloadsService.resolveDownload(licenseId, productSlug);
    return response.redirect(downloadUrl);
  }
}
