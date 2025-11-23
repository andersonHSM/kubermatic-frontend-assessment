import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	public async login({ email, password }: LoginDto) {
		const currentUser = await this.usersService.findOne(email);

		if (!currentUser || password !== currentUser.password) {
			return new UnauthorizedException("User or password doesn't match");
		}

		return this.jwtService.signAsync({ email: currentUser.email });
	}
}
