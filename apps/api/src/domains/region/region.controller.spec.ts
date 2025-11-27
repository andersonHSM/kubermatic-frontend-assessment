import { Test, TestingModule } from '@nestjs/testing';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

describe('RegionController', () => {
  let controller: RegionController;
  let service: jest.Mocked<RegionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionController],
      providers: [
        {
          provide: RegionService,
          useValue: { findAll: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    controller = module.get<RegionController>(RegionController);
    service = module.get(RegionService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should call service', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
