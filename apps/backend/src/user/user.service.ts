import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private authService: AuthService) {}
  findOne(gitId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ gitId });
  }

  async loginUser(tokenData) {
    const accessToken = tokenData.access_token;
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const inputUser = await userResponse.json();
    let user = await this.findOne(inputUser.id);
    if (!user) {
      await this.saveUser(new UserCreateDto(inputUser, accessToken));
      user = await this.findOne(inputUser.id);
    }
    return this.authService.createJwt(user.userId);
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
