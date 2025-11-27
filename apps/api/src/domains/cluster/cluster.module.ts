import { Module } from '@nestjs/common';
import { PrismaModule } from 'apps/api/src/prisma/prisma.module';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';

@Module({
	controllers: [ClusterController],
	providers: [ClusterService],
	imports: [PrismaModule],
})
export class ClusterModule {}
