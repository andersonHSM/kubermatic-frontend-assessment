// Basic Jest mock for @prisma/client to avoid loading native bindings in unit tests
export class PrismaClient {}

export default { PrismaClient } as unknown as typeof import('@prisma/client');
