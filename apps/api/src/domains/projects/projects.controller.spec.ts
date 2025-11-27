import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
	let controller: ProjectsController;
	let service: jest.Mocked<ProjectsService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProjectsController],
			providers: [
				{
					provide: ProjectsService,
					useValue: {
						findAll: jest.fn().mockResolvedValue([]),
						findOne: jest.fn(),
						create: jest.fn(),
						update: jest.fn(),
						remove: jest.fn(),
						findProjectClusters: jest.fn(),
						createCluster: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<ProjectsController>(ProjectsController);
		service = module.get(ProjectsService) as any;
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('findAll should pass search to service', async () => {
		await controller.findAll('abc');
		expect(service.findAll).toHaveBeenCalledWith('abc');
	});

	it('findOne should coerce id to number and call service', () => {
		controller.findOne('42');
		expect(service.findOne).toHaveBeenCalledWith(42);
	});

	it('findProjectClusters should forward args', async () => {
		await controller.findProjectClusters('p1', 'asc', 'nm', 'rg');
		expect(service.findProjectClusters).toHaveBeenCalledWith('p1', 'asc', 'nm', 'rg');
	});

	it('createCluster should forward args', async () => {
		await controller.createCluster('p1', { name: 'x' } as any);
		expect(service.createCluster).toHaveBeenCalledWith('p1', { name: 'x' });
	});
});
