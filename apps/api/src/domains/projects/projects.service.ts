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
				where: { OR: [{ name: { contains: query } }, { description: { contains: query } }] },
			};
		}
		return this.prisma.region.findMany(args);
	}

	findOne(id: number) {
		return `This action returns a #${id} project`;
	}
}
