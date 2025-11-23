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

	public findProjectClusters(projectId: string, sortOrder: string, name?: string, region?: string) {
		return this.prisma.project.findMany({
			where: { id: projectId },
			include: {
				clusters: {
					where: {
						...(name && { name: { contains: name, mode: 'insensitive' } }),
						...(region && {
							region: {
								OR: [
									{ code: { contains: region, mode: 'insensitive' } },
									{ name: { contains: region, mode: 'insensitive' } },
								],
							},
						}),
					},
					orderBy: {
						name: sortOrder === 'desc' ? 'desc' : 'asc',
					},
				},
			},
		});
	}
}
