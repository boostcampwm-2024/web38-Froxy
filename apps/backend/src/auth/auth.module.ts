import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '1h'
      }
    }),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
