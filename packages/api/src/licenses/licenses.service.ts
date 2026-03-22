import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidateLicenseDto } from './dto/validate-license.dto';
import { LicenseEntity } from './license.entity';

type RequestUser = {
  userId: number;
  email: string;
  role: string;
};

@Injectable()
export class LicensesService {
  constructor(
    @InjectRepository(LicenseEntity)
    private readonly licenseRepository: Repository<LicenseEntity>
  ) {}

  async findForUser(user: RequestUser) {
    const where =
      user.role === 'admin'
        ? {}
        : [
            { userId: user.userId },
            { email: user.email.toLowerCase() }
          ];

    const licenses = await this.licenseRepository.find({
      where,
      relations: { product: true, order: true },
      order: { createdAt: 'DESC' }
    });

    return licenses.map((license) => this.serializeLicense(license));
  }

  async validate(validateLicenseDto: ValidateLicenseDto) {
    const license = await this.licenseRepository.findOne({
      where: { code: validateLicenseDto.code },
      relations: { product: true, order: true }
    });

    const isValid =
      !!license &&
      license.status === 'active' &&
      (!validateLicenseDto.productSlug || license.product.slug === validateLicenseDto.productSlug);

    return {
      valid: isValid,
      license: isValid && license ? this.serializeLicense(license) : undefined
    };
  }

  async findById(licenseId: number) {
    return this.licenseRepository.findOne({
      where: { id: licenseId },
      relations: { product: true, order: true }
    });
  }

  async incrementDownloadCount(license: LicenseEntity) {
    license.downloadCount += 1;
    await this.licenseRepository.save(license);
  }

  private serializeLicense(license: LicenseEntity) {
    return {
      id: license.id,
      code: license.code,
      status: license.status,
      productId: license.productId,
      productName: license.product.name,
      productSlug: license.product.slug,
      orderId: license.orderId,
      downloadUrl: `/api/downloads/${license.id}/${license.product.slug}`,
      createdAt: license.createdAt,
      expiresAt: license.expiresAt
    };
  }
}
