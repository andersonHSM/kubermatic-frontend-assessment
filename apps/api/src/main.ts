/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger}                         from '@nestjs/common';
import {NestFactory}                    from '@nestjs/core';
import {JwtService}                     from '@nestjs/jwt';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule}                      from './app/app.module';
import {JwtGuard}                       from './domains/guards/jwt.guard';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { snapshot: true });
	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

	const rawCorsOrigins = process.env.CORS_ORIGINS?.trim();
	let corsOrigin: boolean | string | RegExp | (string | RegExp)[] = false;

	if (rawCorsOrigins) {
		if (rawCorsOrigins === '*' || rawCorsOrigins.toLowerCase() === 'true') {
			corsOrigin = true;
		} else {
			const list = rawCorsOrigins
				.split(',')
				.map(s => s.trim())
				.filter(s => s.length > 0);
			if (list.length > 0) {
				corsOrigin = list;
			}
		}
	}

	app.enableCors({
		origin: corsOrigin,
		credentials: true,
	});

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
