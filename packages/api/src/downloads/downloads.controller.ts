import { Controller, Get, Param, ParseIntPipe, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

type RequestUser = {
  userId: number;
  email: string;
  role: string;
};

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
    @Req() req: Request,
    @Res() res: Response
  ) {
    const user = req.user as RequestUser;
    const downloadUrl = await this.downloadsService.resolveDownload(licenseId, productSlug, user);
    return res.redirect(downloadUrl);
  }
}
