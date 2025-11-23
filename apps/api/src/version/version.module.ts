import { Module } from '@nestjs/common';
import { VersionService } from 'apps/api/src/version/version.service';
import { VersionController } from 'apps/api/src/version/version.controller';

@Module({
	controllers: [VersionController],
	providers: [VersionService],
})
export class VersionModule {}
