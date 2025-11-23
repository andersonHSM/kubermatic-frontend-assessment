import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get()
	@ApiQuery({
		name: 'search',
		required: false,
		description: 'Search by name or description',
		type: String,
	})
	findAll(@Query('search') search = '') {
		return this.projectsService.findAll(search);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.projectsService.findOne(+id);
	}
}
