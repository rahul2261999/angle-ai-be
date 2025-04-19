import { Test, TestingModule } from '@nestjs/testing';
import { AlsService } from './als.service';

describe('AlsService', () => {
  let service: AlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlsService],
    }).compile();

    service = module.get<AlsService>(AlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
