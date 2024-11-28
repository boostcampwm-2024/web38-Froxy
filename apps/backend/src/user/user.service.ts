import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { isString } from 'class-validator';
import { UserCreateDto } from './dto/user.create.dto';
import { UserPatchDTO } from './dto/user.patch.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { AuthService } from '@/auth/auth.service';
import { SimpleUserResponseDto } from '@/lotus/dto/simple.user.response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  async findOne(gitId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ gitId });
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userId });
  }

  async getSimpleUserInfoByUserId(userId: string): Promise<SimpleUserResponseDto> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new HttpException('user data is not found', HttpStatus.NOT_FOUND);
    }
    return SimpleUserResponseDto.ofUserDto(user);
  }

  async patchUserDataByUserId(userId: string, updateData: UserPatchDTO): Promise<UserPatchDTO> {
    const modifyingData = this.getObjUser(updateData);

    const result = await this.userRepository.update({ userId }, modifyingData);
    if (!result.affected) {
      throw new HttpException('user info not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOneBy({ userId });
    return UserPatchDTO.ofUser(user);
  }

  getObjUser(updateData: UserPatchDTO) {
    const obj: any = {};

    if (updateData.nickname && isString(updateData.nickname)) {
      obj.nickname = updateData.nickname;
    }
    if (updateData.profile) {
      obj.profilePath = updateData.profile;
    }
    if (Object.keys(obj).length === 0) {
      throw new HttpException('wrong user data', HttpStatus.BAD_REQUEST);
    }

    return obj;
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
    const token = this.authService.createJwt(user.userId);
    return token;
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
