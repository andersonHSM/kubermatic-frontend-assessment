import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { logger } from 'nx/src/utils/logger';

export default registerAs('jwt', (): JwtModuleOptions => {
	logger.log('JWT_SECRET:', process.env.JWT_SECRET);
	logger.log('JWT_EXPIRATION_TIME:', process.env.JWT_EXPIRATION_TIME);
	return {
		global: true,
		secret: process.env.JWT_SECRET,
		signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '0') },
	};
});
