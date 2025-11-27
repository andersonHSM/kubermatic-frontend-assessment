import { Injectable } from '@nestjs/common';
import { UpdateClusterDto } from './dto/update-cluster.dto';

@Injectable()
export class ClusterService {
	update(id: number, updateClusterDto: UpdateClusterDto) {
		return `This action updates a #${id} cluster`;
	}

	remove(id: number) {
		return `This action removes a #${id} cluster`;
	}
}
