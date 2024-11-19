import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  findOne(gitId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ gitId });
  }
  findOneByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userId });
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
    } else {
      await this.userRepository.update({ gitId: inputUser.id }, { gitToken: accessToken });
    }
    return this.authService.createJwt(user.userId);
  }

  async makeTestUser(user: User) {
    return this.authService.createJwt(user.userId);
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async findUserGistToken(userId: string): Promise<string> {
    const foundUser = await this.userRepository.findOneBy({ userId });
    if (!foundUser) throw new HttpException('user data not found', HttpStatus.NOT_FOUND);
    return foundUser.gitToken;
  }
}
