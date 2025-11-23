import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
	findAll() {
		return `This action returns all projects`;
	}

	findOne(id: number) {
		return `This action returns a #${id} project`;
	}
}
