import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Get()
	findAll() {
		return this.projectsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.projectsService.findOne(+id);
	}
}
