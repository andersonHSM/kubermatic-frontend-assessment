import { Test, TestingModule } from '@nestjs/testing';
import { ClusterService } from './cluster.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ClusterService', () => {
  let service: ClusterService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClusterService,
        {
          provide: PrismaService,
          useValue: {
            cluster: {
              update: jest.fn().mockResolvedValue({ id: 'c1', name: 'updated' }),
              delete: jest.fn().mockResolvedValue({ id: 'c1' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClusterService>(ClusterService);
    prisma = module.get(PrismaService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('update should call prisma.cluster.update with id and dto', async () => {
    const dto: any = { name: 'n', nodeCount: 3 };
    const res = await service.update('c1', dto);
    expect(prisma.cluster.update).toHaveBeenCalledWith({ data: { ...dto }, where: { id: 'c1' } });
    expect(res).toEqual({ id: 'c1', name: 'updated' });
  });

  it('remove should call prisma.cluster.delete with id', async () => {
    const res = await service.remove('c1');
    expect(prisma.cluster.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    expect(res).toEqual({ id: 'c1' });
  });
});
