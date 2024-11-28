import { ConfigService } from '@nestjs/config';

export const queueConfig = (configService: ConfigService) => ({
  redis: {
    host: configService.get<string>('REDIS_HOST', { infer: true }),
    port: configService.get<number>('REDIS_PORT', { infer: true })
  }
});
