import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { queueConfig } from '@/config/queue.config';

@Injectable()
export class RedisRepository {
  private readonly redisClient: Redis;

  constructor(private configService: ConfigService) {
    this.redisClient = new Redis(
      queueConfig(this.configService).redis.port,
      queueConfig(this.configService).redis.host,
      {}
    );
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }
}
