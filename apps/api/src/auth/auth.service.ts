import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	public async login(userDto: LoginDto) {}
}
