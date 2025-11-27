import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { UpdateClusterDto } from './dto/update-cluster.dto';

@Controller('clusters')
export class ClusterController {
	constructor(private readonly clusterService: ClusterService) {}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateClusterDto: UpdateClusterDto) {
		return this.clusterService.update(+id, updateClusterDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.clusterService.remove(+id);
	}
}
