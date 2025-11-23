import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VersionService } from 'apps/api/src/version/version.service';

@ApiBearerAuth()
@Controller('version')
export class VersionController {
	constructor(private readonly versionService: VersionService) {}

	@Get()
	findAll() {
		return this.versionService.findAll();
	}
}
