import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../domains/auth/auth.module';
import { ProjectsModule } from '../domains/projects/projects.module';
import { RegionModule } from '../domains/region/region.module';
import { UsersModule } from '../domains/users/users.module';
import { VersionModule } from '../domains/version/version.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		VersionModule,
		RegionModule,
		AuthModule,
		UsersModule,
		ProjectsModule,
		ConfigModule.forRoot({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
