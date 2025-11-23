import { Module } from '@nestjs/common';
import { RegionService } from 'apps/api/src/region/region.service';
import { RegionController } from 'apps/api/src/region/region.controller';

@Module({
	controllers: [RegionController],
	providers: [RegionService],
})
export class RegionModule {}
