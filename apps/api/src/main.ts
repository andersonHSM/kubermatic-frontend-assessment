/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtGuard } from './guards/jwt.guard';
import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { snapshot: true });
	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

	// Swagger/OpenAPI setup at /api/docs
	const config = new DocumentBuilder()
		.setTitle('Kubermatic Assessment API')
		.setDescription('API documentation')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			'bearer',
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
	const port = process.env.PORT || 3000;
	const jwtService = app.get(JwtService);
	app.useGlobalGuards(new JwtGuard(jwtService));
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
	Logger.log(`📘 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
