import { describe, expect, it } from 'vitest';
import { CodeFileModel } from './model';

describe('CodeFileModel', () => {
  it.each([
    {
      description: '올바른 DTO를 받아 CodeFileModel을 생성합니다.',
      dto: {
        filename: 'example.js',
        language: 'JavaScript',
        content: 'console.log("Hello, world!");'
      },
      expected: {
        filename: 'example.js',
        language: 'JavaScript',
        content: 'console.log("Hello, world!");',
        ext: 'js'
      }
    },
    {
      description: '비어있는 값은 빈 값으로 처리합니다.',
      dto: {
        filename: '',
        language: '',
        content: ''
      },
      expected: {
        filename: '',
        language: '',
        content: '',
        ext: ''
      }
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const model = new CodeFileModel(dto);

    //When

    // Then: 필드 검증
    expect(model).toMatchObject(expected);
  });

  it.each([
    {
      description: 'README 파일일 경우 isREADME가 true입니다.',
      dto: {
        filename: 'README.md',
        language: 'Markdown',
        content: '# Hello World'
      },
      expected: true
    },
    {
      description: 'README 파일이 아닐 경우 isREADME가 false입니다.',
      dto: {
        filename: 'example.js',
        language: 'JavaScript',
        content: 'console.log("Hello, world!");'
      },
      expected: false
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const model = new CodeFileModel(dto);

    //When

    // Then: isREADME getter 확인
    expect(model.isREADME).toBe(expected);
  });

  it.each([
    {
      description: '마크다운 파일인 경우 isMarkdown가 true입니다.',
      dto: {
        filename: 'example.md',
        language: 'Markdown',
        content: '# Hello World'
      },
      expected: true
    },
    {
      description: '마크다운 파일이 아닌 경우 isMarkdown가 false입니다.',
      dto: {
        filename: 'example.js',
        language: 'JavaScript',
        content: 'console.log("Hello, world!");'
      },
      expected: false
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const model = new CodeFileModel(dto);

    //When

    // Then: isMarkdown getter 확인
    expect(model.isMarkdown).toBe(expected);
  });

  it.each([
    {
      description: '지원하는 확장자 형식인 경우 canView가 true입니다.',
      dto: {
        filename: 'example.md',
        language: 'Markdown',
        content: '# Hello World'
      },
      expected: true
    },
    {
      description: '지원하지 않는 확장자의 경우 canView가 false입니다.',
      dto: {
        filename: 'example.png',
        language: 'Binary',
        content: ''
      },
      expected: false
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const model = new CodeFileModel(dto);

    //When

    // Then: canView getter 확인
    expect(model.canView).toBe(expected);
  });

  it.each([
    {
      description: 'README 파일이 존재하는 경우 getDefaultFile은 README 파일을 반환합니다.',
      files: [
        new CodeFileModel({ filename: 'README.md', language: 'Markdown', content: '# Hello' }),
        new CodeFileModel({ filename: 'example.js', language: 'JavaScript', content: 'console.log("test");' }),
        new CodeFileModel({ filename: 'example.md', language: 'Markdown', content: 'hola' })
      ],
      expected: 'README.md'
    },
    {
      description: 'README 파일이 없고 마크다운 파일이 존재하는 경우 getDefaultFile은 마크다운 파일을 반환합니다.',
      files: [
        new CodeFileModel({ filename: 'example.md', language: 'Markdown', content: '# Hello' }),
        new CodeFileModel({ filename: 'example.js', language: 'JavaScript', content: 'console.log("test");' })
      ],
      expected: 'example.md'
    },
    {
      description: 'README 파일과 마크다운 파일이 없는 경우 getDefaultFile은 undefined를 반환합니다.',
      files: [
        new CodeFileModel({ filename: 'example.js', language: 'JavaScript', content: 'console.log("test");' }),
        new CodeFileModel({ filename: 'example.py', language: 'Python', content: 'print("Hello")' })
      ],
      expected: undefined
    }
  ])('$description', ({ files, expected }) => {
    //Given

    //When
    const defaultFile = CodeFileModel.getDefaultFile(files);

    //Then
    expect(defaultFile?.filename).toBe(expected);
  });

  it.each([
    {
      description: '지원하는 언어파일인 경우 언어에 맞는 content를 마크다운 문자열로 반환합니다',
      dto: {
        filename: 'example.js',
        language: 'JavaScript',
        content: 'console.log("Hello, world!");'
      },
      expected: '```js\nconsole.log("Hello, world!");\n ```'
    },
    {
      description: '지원하지 않는 언어 파일이나, 언어 파일이 아닌 경우 그냥 content를 반환합니다',
      dto: {
        filename: 'example.txt',
        language: 'Text',
        content: 'Just some text'
      },
      expected: 'Just some text'
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const model = new CodeFileModel(dto);

    // Then: toMarkdown 확인
    expect(model.toMarkdown()).toBe(expected);
  });
});
