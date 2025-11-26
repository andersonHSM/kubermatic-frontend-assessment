import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
	controllers: [RegionController],
	providers: [RegionService],
	imports: [PrismaModule],
})
export class RegionModule {}
