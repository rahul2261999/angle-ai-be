import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigurationService } from 'src/core/configuration/configuration.service';

@Injectable()
export class RagAxiosService {
  private instance: AxiosInstance;
  constructor(private readonly configurationService: ConfigurationService) {
    const { baseurl } = this.configurationService.getRagServiceConfig();

    this.instance = axios.create({
      baseURL: `${baseurl}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getInstance() {
    return this.instance;
  }
}
