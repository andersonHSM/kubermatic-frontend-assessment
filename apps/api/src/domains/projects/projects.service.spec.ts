import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProjectsService', () => {
    let service: ProjectsService;
    let prisma: jest.Mocked<PrismaService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                {
                    provide: PrismaService,
                    useValue: {
                        project: {
                            findMany: jest.fn().mockResolvedValue([]),
                            findFirstOrThrow: jest.fn().mockResolvedValue({ id: 'p1', clusters: [] }),
                        },
                        cluster: {
                            findFirst: jest.fn().mockResolvedValue({ id: 'c-1' }),
                            create: jest.fn().mockResolvedValue({}),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        prisma = module.get(PrismaService) as any;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should call prisma.project.findMany with empty args when no query', async () => {
        await service.findAll();
        expect(prisma.project.findMany).toHaveBeenCalledWith({});
    });

    it('findAll should include OR filters when query provided', async () => {
        await service.findAll('abc');
        expect(prisma.project.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { name: { contains: 'abc', mode: 'insensitive' } },
                    { description: { contains: 'abc', mode: 'insensitive' } },
                ],
            },
        });
    });

    it('findProjectClusters should request project with clusters include and mapping of filters', async () => {
        await service.findProjectClusters('p1', 'desc', 'nameX', 'eu');
        expect(prisma.project.findFirstOrThrow).toHaveBeenCalled();
        const args = (prisma.project.findFirstOrThrow as jest.Mock).mock.calls[0][0];
        expect(args.where).toEqual({ id: 'p1' });
        expect(args.include.clusters.orderBy).toEqual({ name: 'desc' });
        expect(args.include.clusters.where).toEqual({
            name: { contains: 'nameX', mode: 'insensitive' },
            region: {
                OR: [
                    { code: { contains: 'eu', mode: 'insensitive' } },
                    { name: { contains: 'eu', mode: 'insensitive' } },
                ],
            },
        });
    });

    it('createCluster should compute next id and call prisma.cluster.create with expected data', async () => {
        // last id is c-9 => next should be c-10
        (prisma.cluster.findFirst as jest.Mock).mockResolvedValueOnce({ id: 'c-9' });
        const body: any = {
            name: 'my-cluster',
            nodeCount: 3,
            labels: { env: 'prod' },
            regionId: 'r1',
            versionId: 'v1',
        };
        await service.createCluster('p1', body);

        expect(prisma.cluster.create).toHaveBeenCalled();
        const createArgs = (prisma.cluster.create as jest.Mock).mock.calls[0][0];
        expect(createArgs.data).toMatchObject({
            id: 'c-10',
            status: 'pending',
            name: 'my-cluster',
            nodeCount: 3,
            labels: { env: 'prod' },
            version: { connect: { id: 'v1' } },
            region: { connect: { id: 'r1' } },
            project: { connect: { id: 'p1' } },
        });
        // createdAt and updatedAt should be Dates
        expect(createArgs.data.createdAt instanceof Date).toBe(true);
        expect(createArgs.data.updatedAt instanceof Date).toBe(true);
    });
});
