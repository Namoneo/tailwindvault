import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LicensesService } from '../licenses/licenses.service';

type RequestUser = {
  userId: number;
  email: string;
  role: string;
};

@Injectable()
export class DownloadsService {
  constructor(private readonly licensesService: LicensesService) {}

  async resolveDownload(licenseId: number, productSlug: string, user: RequestUser) {
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

    // Ownership check: admin can access any license, otherwise email must match
    if (user.role !== 'admin' && license.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new ForbiddenException('You do not have access to this license.');
    }

    await this.licensesService.incrementDownloadCount(license);
    return license.product.downloadUrl;
  }
}
