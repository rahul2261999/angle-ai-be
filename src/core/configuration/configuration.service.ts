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

  getMistralConfig() {
    const modelName = this.configService.get<string>('MISTRAL_MODEL_NAME');
    const apiKey = this.configService.get<string>('MISTRAL_API_CONFIG');

    return {
      modelName,
      apiKey,
    };
  }
  getRagServiceConfig() {
    const baseurl = this.configService.get('RAG_SERVICE_BASE_URL');

    return { baseurl };
  }

  getAuthJwtConfig() {
    const secret = this.configService.get('AUTH_JWT_SECRET');

    return { secret, expiresIn: '1h' };
  }

  getOtpJwtConfig() {
    const secret = this.configService.get('OTP_JWT_SECRET');

    return { secret, expiresIn: '1h' };
  }

  getEmailProviderConfig() {
    const apiKey = this.configService.get('EMAIL_PROVIDER_KEY');
    const defaultFrom = this.configService.get('email_provider.default_from');
    const defaultFromName = this.configService.get('email_provider.default_from_name');

    return {
      apiKey,
      defaultFrom,
      defaultFromName,
    };
  }
}
