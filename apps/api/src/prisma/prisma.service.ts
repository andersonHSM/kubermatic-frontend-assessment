import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrismaClient } from '@db/output/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {}
