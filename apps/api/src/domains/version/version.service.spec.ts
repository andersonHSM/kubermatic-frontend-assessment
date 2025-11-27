import { Test, TestingModule } from '@nestjs/testing';
import { VersionService } from './version.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('VersionService', () => {
	let service: VersionService;

	beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
            providers: [
                VersionService,
                {
                    provide: PrismaService,
                    useValue: {
                        version: { findMany: jest.fn().mockResolvedValue([]) },
                    },
                },
            ],
        }).compile();

		service = module.get<VersionService>(VersionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
