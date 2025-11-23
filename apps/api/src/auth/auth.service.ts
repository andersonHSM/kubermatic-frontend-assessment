import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	public async login({ email, password }: LoginDto) {
		const currentUser = await this.usersService.findOne(email);

		if (password !== currentUser?.password) {
			return new UnauthorizedException("User or password doesn't match");
		}
	}
}
