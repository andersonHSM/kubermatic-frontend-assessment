import { Test, TestingModule } from '@nestjs/testing';
import { RegionController } from 'apps/api/src/region/region.controller';
import { RegionService } from 'apps/api/src/region/region.service';

describe('RegionController', () => {
	let controller: RegionController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RegionController],
			providers: [RegionService],
		}).compile();

		controller = module.get<RegionController>(RegionController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
