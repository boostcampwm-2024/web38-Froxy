import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RedisRepository } from '@/redis/redis.repository';
import { UserModule } from '@/user/user.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'HS256'
      }
    }),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, RedisRepository],
  exports: [AuthService]
})
export class AuthModule {}
