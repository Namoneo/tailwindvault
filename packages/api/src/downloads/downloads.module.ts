import { Module } from '@nestjs/common';
import { LicensesModule } from '../licenses/licenses.module';
import { DownloadsController } from './downloads.controller';
import { DownloadsService } from './downloads.service';

@Module({
  imports: [LicensesModule],
  controllers: [DownloadsController],
  providers: [DownloadsService]
})
export class DownloadsModule {}
