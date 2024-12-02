import { describe, expect, it } from 'vitest';
import { LotusDto, LotusModel } from './model';

describe('LotusModel', () => {
  it.each([
    {
      description: '올바른 LotusDto로 LotusModel 생성할 수 있다.',
      lotusDto: {
        id: '1',
        link: 'https://example.com',
        title: 'Example Title',
        logo: 'https://example.com/logo.png',
        date: '2024-01-01T00:00:00.000Z',
        tags: ['tag1', 'tag2'],
        isPublic: true,
        gistUrl: 'https://gist.github.com/example'
      },
      expected: {
        id: '1',
        link: 'https://example.com',
        title: 'Example Title',
        logo: 'https://example.com/logo.png',
        date: new Date('2024-01-01T00:00:00.000Z'),
        tags: ['tag1', 'tag2'],
        isPublic: true,
        gistUrl: 'https://gist.github.com/example',
        isTagsEmpty: false
      }
    },
    {
      description: '태그가 없는 LotusDto로 LotusModel 생성할 수 있다.',
      lotusDto: {
        id: '2',
        link: 'https://example.com/2',
        title: 'Another Title',
        logo: 'https://example.com/logo2.png',
        date: '2024-02-01T00:00:00.000Z',
        tags: [],
        gistUrl: 'https://gist.github.com/example2'
      },
      expected: {
        id: '2',
        link: 'https://example.com/2',
        title: 'Another Title',
        logo: 'https://example.com/logo2.png',
        date: new Date('2024-02-01T00:00:00.000Z'),
        tags: [],
        isPublic: undefined,
        gistUrl: 'https://gist.github.com/example2',
        isTagsEmpty: true
      }
    }
  ])('$description', ({ lotusDto, expected }) => {
    //Given
    const lotusModel = new LotusModel(lotusDto);

    //When

    //Then
    expect(lotusModel).toMatchObject(expected);
    expect(lotusModel.isTagsEmpty).toBe(expected.isTagsEmpty);
  });

  it('clone메서드를 통해 새로운 LotusModel 객체를 만들 수 있다.', () => {
    //Given
    const originalDto: LotusDto = {
      id: '3',
      link: 'https://example.com/3',
      title: 'Original Title',
      logo: 'https://example.com/logo3.png',
      date: '2024-03-01T00:00:00.000Z',
      tags: ['original'],
      isPublic: false,
      gistUrl: 'https://gist.github.com/original'
    };
    const originalModel = new LotusModel(originalDto);
    const cloneDto = {
      title: 'Updated Title',
      tags: ['updated'],
      date: new Date('2024-04-01T00:00:00.000Z')
    };

    // When
    const clonedModel = originalModel.clone(cloneDto);

    // Then
    expect(new LotusModel(originalDto)).toMatchObject(originalModel);

    expect(clonedModel).toMatchObject(
      new LotusModel({ ...originalDto, ...cloneDto, date: cloneDto.date.toISOString() })
    );
  });
});
