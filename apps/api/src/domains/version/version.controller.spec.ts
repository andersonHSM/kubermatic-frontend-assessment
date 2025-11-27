import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

describe('VersionController', () => {
  let controller: VersionController;
  let service: jest.Mocked<VersionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [
        {
          provide: VersionService,
          useValue: { findAll: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    controller = module.get<VersionController>(VersionController);
    service = module.get(VersionService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should call service', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
