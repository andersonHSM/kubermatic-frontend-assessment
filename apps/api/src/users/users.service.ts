import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	public async findOne(id: string) {
		return this.prisma.user.findUnique({ where: { id } });
	}
}
