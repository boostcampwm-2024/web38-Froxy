module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'no-relative-import-paths', 'eslint-plugin-import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error', // Prettier 규칙을 ESLint에서 에러로 표시
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'], // 내장 모듈과 외부 모듈 그룹
          ['internal', 'parent', 'sibling', 'index'] // 내부 모듈 그룹
        ],
        pathGroups: [
          {
            pattern: '@nestjs/**',
            group: 'builtin',
            position: 'before' // nestjs를 최상위에 오도록 설정
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true } // 알파벳 순 정렬
      }
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true, // `import` 자체의 정렬은 무시
        ignoreMemberSort: false // 세부 항목 정렬은 적용
      }
    ],
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: true, rootDir: 'src', prefix: '@' }
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE']
      }, // 변수명은 camelCase, PascalCase, UPPER_CASE 형식 중 하나여야 함
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase']
      }, // 함수명은 camelCase, PascalCase 형식 중 하나여야 함
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }, // 타입명은 PascalCase 형식이어야 함
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false
        }
      }, // 인터페이스명은 PascalCase이고 I로 시작하면 안됨
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: false
        }
      }, // 타입 별칭명은 PascalCase이고 T로 시작하면 안됨
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: false
        }
      }, // 타입 매개변수명은 PascalCase이고 T로 시작하면 안됨
      {
        selector: 'method',
        format: ['camelCase']
      } // 메서드명은 camelCase 형식이어야 함
    ]
  }
};
