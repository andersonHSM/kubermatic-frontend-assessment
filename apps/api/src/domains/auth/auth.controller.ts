import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	public async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('token')
	public async isAuthenticated(@Headers('Authorization') header: string) {
		return this.authService.isAuthenticated(header);
	}
}
