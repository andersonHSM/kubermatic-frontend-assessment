import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateClusterDto } from './dto/update-cluster.dto';

@Injectable()
export class ClusterService {
	constructor(private readonly prismaService: PrismaService) {}
	update(id: string, updateClusterDto: UpdateClusterDto) {
		return this.prismaService.cluster.update({ data: { ...updateClusterDto }, where: { id } });
	}

	remove(id: string) {
		return this.prismaService.cluster.delete({ where: { id } });
	}
}
