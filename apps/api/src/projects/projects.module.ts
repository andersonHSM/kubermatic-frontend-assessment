import { Module } from '@nestjs/common';
import { ProjectsService } from 'apps/api/src/projects/projects.service';
import { ProjectsController } from 'apps/api/src/projects/projects.controller';

@Module({
	controllers: [ProjectsController],
	providers: [ProjectsService],
})
export class ProjectsModule {}
