import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LicensesService } from '../licenses/licenses.service';

@Injectable()
export class DownloadsService {
  constructor(private readonly licensesService: LicensesService) {}

  async resolveDownload(licenseId: number, productSlug: string) {
    const license = await this.licensesService.findById(licenseId);

    if (!license) {
      throw new NotFoundException('License not found.');
    }

    if (license.status !== 'active') {
      throw new ForbiddenException('License is no longer active.');
    }

    if (license.product.slug !== productSlug) {
      throw new ForbiddenException('License does not match the requested product.');
    }

    await this.licensesService.incrementDownloadCount(license);
    return license.product.downloadUrl;
  }
}
