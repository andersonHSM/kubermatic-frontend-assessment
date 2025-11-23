import { PrismaClient } from '@db/output/generated/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {}
