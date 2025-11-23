import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@db/output/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({ log: ['query'] });
	}
}
