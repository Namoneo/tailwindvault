import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { DownloadsService } from './downloads.service';

@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

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
