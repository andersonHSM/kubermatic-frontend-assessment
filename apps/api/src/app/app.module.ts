import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ClusterModule } from '../domains/cluster/cluster.module';
import { AuthModule } from '../domains/auth/auth.module';
import { ProjectsModule } from '../domains/projects/projects.module';
import { RegionModule } from '../domains/region/region.module';
import { UsersModule } from '../domains/users/users.module';
import { VersionModule } from '../domains/version/version.module';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		VersionModule,
		RegionModule,
		AuthModule,
		UsersModule,
		ProjectsModule,
		ClusterModule,
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
