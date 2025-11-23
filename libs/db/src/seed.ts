import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
	ClusterStatus,
	Prisma,
	PrismaClient,
	Role,
	SupportStatus,
} from '../output/generated/prisma';

const prisma = new PrismaClient();

// Simple sanitizer to handle trailing commas or comments in JSON-like files
function sanitizeJson(input: string): string {
	// Remove /* ... */ comments
	let s = input.replace(/\/\*[\s\S]*?\*\//g, '');
	// Remove // ... comments
	s = s.replace(/(^|\s)\/\/.*$/gm, '');
	// Remove trailing commas before } or ]
	s = s.replace(/,\s*([}\]])/g, '$1');
	return s;
}

function readJson<T = never>(relativePath: string): T {
	const full = resolve(process.cwd(), relativePath);
	const raw = readFileSync(full, 'utf8');
	return JSON.parse(sanitizeJson(raw));
}

async function seedRegions() {
	const regions = readJson<Array<{ id: string; name: string; code: string }>>(
		'.misc/assignment-data/mock/regions.json',
	);
	for (const r of regions) {
		await prisma.region.upsert({
			where: { id: r.id },
			update: { name: r.name, code: r.code },
			create: { id: r.id, name: r.name, code: r.code },
		});
	}
	console.log(`Seeded regions: ${regions.length}`);
}

async function seedVersions() {
	const versions = readJson<
		Array<{ version: string; isDefault: boolean; supportStatus: 'stable' | 'deprecated' }>
	>('.misc/assignment-data/mock/versions.json');
	for (const v of versions) {
		await prisma.version.upsert({
			where: { version: v.version },
			update: { isDefault: v.isDefault, supportStatus: v.supportStatus as SupportStatus },
			create: {
				version: v.version,
				isDefault: v.isDefault,
				supportStatus: v.supportStatus as SupportStatus,
			},
		});
	}
	console.log(`Seeded versions: ${versions.length}`);
}

async function seedUsers() {
	const usersWrap = readJson<{
		users: Array<{
			email: string;
			password: string;
			role: 'admin' | 'viewer' | 'user';
			name: string;
		}>;
	}>('.misc/assignment-data/mock/users.json');
	const users = usersWrap.users ?? [];
	for (const u of users) {
		await prisma.user.upsert({
			where: { email: u.email },
			update: { name: u.name, role: u.role as Role, password: u.password },
			create: { email: u.email, name: u.name, role: u.role as Role, password: u.password },
		});
	}
	console.log(`Seeded users: ${users.length}`);
}

async function seedProjectsAndClusters() {
	const db = readJson<{
		projects: Array<{ id: string; name: string; description?: string }>;
		clusters: Array<{
			id: string;
			name: string;
			projectId: string;
			region: string; // region id/code
			version: string; // version string
			nodeCount: number;
			status: 'running' | 'pending';
			labels?: Record<string, string>;
			createdAt?: string;
			updatedAt?: string;
		}>;
	}>('.misc/assignment-data/mock/db.json');

	// Projects first
	for (const p of db.projects) {
		await prisma.project.upsert({
			where: { id: p.id },
			update: { name: p.name, description: p.description ?? null },
			create: { id: p.id, name: p.name, description: p.description ?? null },
		});
	}
	console.log(`Seeded projects: ${db.projects.length}`);

	// Clusters with relations
	for (const c of db.clusters) {
		// Ensure related entities exist (will throw if missing)
		const region = await prisma.region.findUnique({ where: { id: c.region } });
		if (!region) throw new Error(`Region not found for cluster ${c.id}: ${c.region}`);

		const version = await prisma.version.findUnique({ where: { version: c.version } });
		if (!version) throw new Error(`Version not found for cluster ${c.id}: ${c.version}`);

		const project = await prisma.project.findUnique({ where: { id: c.projectId } });
		if (!project) throw new Error(`Project not found for cluster ${c.id}: ${c.projectId}`);

		await prisma.cluster.upsert({
			where: { id: c.id },
			update: {
				name: c.name,
				nodeCount: c.nodeCount,
				status: c.status as ClusterStatus,
				labels: c.labels ?? Prisma.DbNull,
				createdAt: c.createdAt ? new Date(c.createdAt) : null,
				updatedAt: c.updatedAt ? new Date(c.updatedAt) : null,
				projectId: project.id,
				regionId: region.id,
				versionId: version.id,
			},
			create: {
				id: c.id,
				name: c.name,
				nodeCount: c.nodeCount,
				status: c.status as ClusterStatus,
				labels: c.labels ?? Prisma.DbNull,
				createdAt: c.createdAt ? new Date(c.createdAt) : null,
				updatedAt: c.updatedAt ? new Date(c.updatedAt) : null,
				projectId: project.id,
				regionId: region.id,
				versionId: version.id,
			},
		});
	}
	console.log(`Seeded clusters: ${db.clusters.length}`);
}

async function main() {
	await seedRegions();
	await seedVersions();
	await seedUsers();
	await seedProjectsAndClusters();
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
