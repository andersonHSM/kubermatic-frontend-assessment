import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	public async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
		const token = await this.authService.login(loginDto);
		response.cookie('token', token, { httpOnly: false, path: '/', sameSite: 'strict' });
		return token;
	}

	@ApiBearerAuth()
	@Post('token')
	public async isAuthenticated(@Req() req: Request, @Res() res: Response) {
		try {
			await this.authService.isAuthenticated(req.headers.authorization?.split(' ').at(1));
			return res.status(200).json({ authenticated: true });
		} catch (e) {
			console.log(e);
			return res.status(401).json({ authenticated: false });
		}
	}
}
