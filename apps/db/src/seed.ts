import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	/* empty */
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log('Seed completed');
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
