import { Test, TestingModule } from '@nestjs/testing';
import { EmailProviderService } from './email_provider.service';

describe('EmailProviderService', () => {
  let service: EmailProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailProviderService],
    }).compile();

    service = module.get<EmailProviderService>(EmailProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
