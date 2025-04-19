import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import Joi from 'joi';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        () => {
          let yamlConfig: any = {};

          const configPath = path.join(
            __dirname,
            'env-config',
            `${process.env.NODE_ENV}.yaml`,
          );

          try {
            const fileContents = fs.readFileSync(configPath, 'utf8');

            yamlConfig = yaml.load(fileContents) as Record<string, any>;
          } catch (error) {
            Logger.error('Error loading YAML configuration:', error);

            yamlConfig = {};
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return {
            ...yamlConfig,
            ...process.env,
          };
        },
      ],
      validationSchema: Joi.object({
        // ========== .env config ==============
        NODE_ENV: Joi.string().valid('local', 'staging', 'uat').required(),

        MONGODB_ATLAS_URI: Joi.string().required(),

        // =============== yaml config =============== //
      }),
      envFilePath: '.env',
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
