import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseEntity } from './license.entity';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseEntity])],
  controllers: [LicensesController],
  providers: [LicensesService],
  exports: [LicensesService, TypeOrmModule]
})
export class LicensesModule {}
