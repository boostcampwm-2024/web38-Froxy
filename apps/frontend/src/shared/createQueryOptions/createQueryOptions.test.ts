import { describe, expect, it } from 'vitest';
import { createQueryOptions } from './createQueryOptions';
import { Fn } from './type';

const API = {
  list: () => Promise.resolve([]),
  get: ({ id }: { id: number }) => Promise.resolve({ id }),
  search: ({ keyword }: { keyword: string }) => Promise.resolve({ keyword }),
  hello: (name: string) => Promise.resolve({ name })
};

const getQueryOptions = (scope: string, api: Record<string, Fn>) => {
  const query = createQueryOptions(scope, api);

  return { scope, query };
};

describe('createQueryOptions', () => {
  it('query.all()은 스코프의 쿼리키를 반환한다.', () => {
    // Given
    const { scope, query } = getQueryOptions('post', API);

    // When
    const result = query.all();

    // Then
    expect(result).toEqual({ queryKey: [{ scope }] });
  });

  it('query.type()은 타입의 쿼리키를 반환한다.', () => {
    // Given
    const { scope, query } = getQueryOptions('post', API);
    const type = 'list';

    // When
    const result = query.type(type);

    // Then
    expect(result.queryKey).toEqual([{ scope, type }]);
  });

  it.each([
    ['list', { id: 1 }, [{ scope: 'post', type: 'list', id: 1 }]],
    ['get', { id: 1 }, [{ scope: 'post', type: 'get', id: 1 }]],
    ['search', { keyword: 'hello' }, [{ scope: 'post', type: 'search', keyword: 'hello' }]]
  ])('query.%s()은 %p를 인자로 받아 각각 쿼리키를 반환한다.', (type, data, expectedKey) => {
    // Given
    const { query } = getQueryOptions('post', API);

    // When
    const result = query[type](data);
    const { queryKey } = result;

    // Then
    expect(queryKey).toEqual(expectedKey);
  });

  it("API 파라미터가 object 리터럴이 아닌 경우, 'data' 키로 감싼다.", () => {
    // Given
    const { query } = getQueryOptions('post', API);

    // When
    const result = query.hello('world');

    // Then
    expect(result.queryKey).toEqual([{ scope: 'post', type: 'hello', data: 'world' }]);
  });
});
