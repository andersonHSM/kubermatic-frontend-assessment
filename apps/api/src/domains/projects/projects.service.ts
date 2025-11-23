import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
	constructor(private readonly prisma: PrismaService) {}
	findAll(query?: string) {
		let args = {};

		if (query) {
			args = {
				...args,
				where: {
					OR: [
						{ name: { contains: query, mode: 'insensitive' } },
						{ description: { contains: query, mode: 'insensitive' } },
					],
				},
			};
		}

		return this.prisma.project.findMany(args);
	}

	findOne(id: number) {
		return `This action returns a #${id} project`;
	}
}
