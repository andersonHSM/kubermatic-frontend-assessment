import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RegionService } from './region.service';

@ApiBearerAuth()
@Controller('region')
export class RegionController {
	constructor(private readonly regionService: RegionService) {}

	@Get()
	findAll() {
		return this.regionService.findAll();
	}
}
