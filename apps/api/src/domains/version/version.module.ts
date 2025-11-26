import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

@Module({
	imports: [PrismaModule],
	controllers: [VersionController],
	providers: [VersionService],
})
export class VersionModule {}
