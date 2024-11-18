import { describe, expect, test } from 'vitest';
import { MockRepository } from './MockRepository';

interface User {
  userId: string;
  password: string;
  name: string;
  email: string;
  age: number;
  isAdult: boolean;
}

const getRepository = (...users: User[]) => {
  const repository = new MockRepository<User>();

  for (const user of users) {
    repository.create(user);
  }

  return repository;
};

describe('InMemoryRepository', () => {
  test('create 메서드는 데이터를 생성하고 생성된 데이터를 반환한다.', async () => {
    //Given
    const repository = getRepository();
    const user = users[0];
    const expected = { id: '0', ...user };

    //When
    const result = await repository.create(user);

    //Then
    expect(result).toEqual(expected);
  });

  test('delete 메서드는 데이터를 삭제하고 삭제된 데이터를 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const user = users[1];
    const expected = { id: '1', ...user };

    //When
    const result = await repository.delete({ userId: user.userId });

    //Then
    expect(result).toEqual(expected);
  });

  test('delete 메서드는 데이터가 없으면 에러를 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const notExistId = 'user6';

    // When
    const run = async () => repository.delete({ userId: notExistId });

    // Then
    expect(run).rejects.toThrow('Not found');
  });

  test('update 메서드는 데이터를 수정하고 수정된 데이터를 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);

    const user = users[4];
    const updateData = { name: 'updatedUser' };
    const expected = { id: '4', ...user, ...updateData };

    //When
    const result = await repository.update({ userId: user.userId }, updateData);

    //Then
    expect(result).toEqual(expected);
  });

  test('update 메서드는 데이터가 없으면 에러를 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const notExistId = 'user6';

    //When
    const run = async () => repository.update({ userId: notExistId }, { name: 'updatedUser' });

    //Then
    expect(run).rejects.toThrow('Not found');
  });

  test('findMany 메서드는 조건에 맞는 데이터를 찾아 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);

    const query = { isAdult: true };
    const expected = users.map((user, id) => ({ id: String(id), ...user })).filter((user) => user.isAdult);

    //When
    const result = await repository.findMany({ query });

    //Then
    expect(result).toEqual(expected);
  });

  test('findMany 메서드는 조건에 맞는 데이터가 없으면 빈 배열을 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const query = { age: -1 };

    //When
    const result = await repository.findMany({ query });

    //Then
    expect(result).toEqual([]);
  });

  test('findOne 메서드는 조건에 맞는 데이터를 찾아 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const user = users[2];
    const query = { userId: user.userId };
    const expected = { id: '2', ...user };

    //When
    const result = await repository.findOne(query);

    //Then
    expect(result).toEqual(expected);
  });

  test('findOne 메서드는 조건에 맞는 데이터가 없으면 에러를 반환한다.', async () => {
    //Given
    const repository = getRepository(...users);
    const query = { age: -1 };

    //When
    const run = async () => repository.findOne(query);

    //Then
    expect(run).rejects.toThrow('Not found');
  });
});

const users: User[] = [
  {
    userId: 'user1',
    password: 'password1',
    name: 'Alice',
    email: 'alice@example.com',
    age: 25,
    isAdult: true
  },
  {
    userId: 'user2',
    password: 'password2',
    name: 'Bob',
    email: 'bob@example.com',
    age: 17,
    isAdult: false
  },
  {
    userId: 'user3',
    password: 'password3',
    name: 'Charlie',
    email: 'charlie@example.com',
    age: 30,
    isAdult: true
  },
  {
    userId: 'user4',
    password: 'password4',
    name: 'David',
    email: 'david@example.com',
    age: 22,
    isAdult: true
  },
  {
    userId: 'user5',
    password: 'password5',
    name: 'Eve',
    email: 'eve@example.com',
    age: 16,
    isAdult: false
  }
];
