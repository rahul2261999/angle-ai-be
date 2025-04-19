import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getMongoUri() {
    const uri = this.configService.get<string>('MONGODB_ATLAS_URI');
    if (!uri) {
      throw new InternalServerErrorException(
        'MongoDB URI not found in environment variables',
      );
    }

    return uri;
  }
}
