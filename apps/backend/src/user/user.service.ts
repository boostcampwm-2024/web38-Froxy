import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  findOne(gitId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ gitId });
  }
  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
