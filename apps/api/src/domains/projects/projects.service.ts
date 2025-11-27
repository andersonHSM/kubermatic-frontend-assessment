import { Injectable } from '@nestjs/common';
import { CreateClusterDto } from './dto/create-cluster.dto';
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
		return this.prisma.project.findFirstOrThrow({
			where: { id: projectId },
			include: {
				clusters: {
					include: { region: true, version: true },
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

	public async createCluster(projectId: string, body: CreateClusterDto) {
		const { id } = (await this.prisma.cluster.findFirst({ orderBy: { id: 'desc' } })) ?? {
			id: 'c-0',
		};

		const nextId = parseInt(id.split('-')[1], 10) + 1;

		const { regionId, versionId, labels, ...remaining } = body;
		await this.prisma.cluster.create({
			data: {
				...remaining,
				id: `c-${nextId}`,
				status: 'pending',
				labels,
				version: { connect: { id: versionId } },
				region: { connect: { id: regionId } },
				project: { connect: { id: projectId } },
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
	}
}
