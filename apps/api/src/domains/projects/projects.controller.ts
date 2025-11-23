import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
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

	@Get(':project_id/cluster')
	@ApiParam({ name: 'project_id', type: String })
	@ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'] })
	@ApiQuery({ name: 'name', required: false, type: String })
	@ApiQuery({ name: 'region', required: false, type: String })
	findProjectClusters(
		@Param('project_id') projectId: string,
		@Query('sortOrder') sortOrder: string,
		@Query('name') name: string,
		@Query('region') region: string,
	) {
		return this.projectsService.findProjectClusters(projectId, sortOrder, name, region);
	}
}
