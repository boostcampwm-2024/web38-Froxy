import { LotusDto } from '@/feature/lotus';
import { UserDto } from '@/feature/user';

// Lotus 더미데이터
export const lotusMockData: (LotusDto & { author: UserDto })[] = [
  {
    id: '1000000001',
    link: 'https://devblog.com/articles/1000000001',
    title: 'Understanding JavaScript Closures',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-11-01').toISOString(),
    tags: ['JavaScript', 'Closures', 'Web Development'],
    author: {
      id: '0',
      nickname: 'js_master',
      profile: 'https://devblog.com/authors/js_master',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000002',
    link: 'https://devblog.com/articles/1000000002',
    title: 'A Guide to Responsive Design with CSS',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-28').toISOString(),
    tags: ['CSS', 'Responsive Design', 'Frontend'],
    author: {
      id: '2',
      nickname: 'css_wizard',
      profile: 'https://devblog.com/authors/css_wizard',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000003',
    link: 'https://devblog.com/articles/1000000003',
    title: 'TypeScript vs JavaScript: Key Differences',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-25').toISOString(),
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    author: {
      id: '3',
      nickname: 'ts_guru',
      profile: 'https://devblog.com/authors/ts_guru',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000004',
    link: 'https://devblog.com/articles/1000000004',
    title: 'How to Build RESTful APIs with Node.js',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-20').toISOString(),
    tags: ['Node.js', 'API', 'Backend'],
    author: {
      id: '4',
      nickname: 'node_dev',
      profile: 'https://devblog.com/authors/node_dev',
      gistUrl: ''
    },
    isPublic: false,
    gistUrl: ''
  },
  {
    id: '1000000005',
    link: 'https://devblog.com/articles/1000000005',
    title: 'Top 10 Python Libraries for Data Science',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-15').toISOString(),
    tags: ['Python', 'Data Science', 'Libraries'],
    author: {
      id: '5',
      nickname: 'data_scientist',
      profile: 'https://devblog.com/authors/data_scientist',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000006',
    link: 'https://devblog.com/articles/1000000006',
    title: 'React State Management: Context vs Redux',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-10').toISOString(),
    tags: ['React', 'Redux', 'Frontend'],
    author: {
      id: '6',
      nickname: 'react_expert',
      profile: 'https://devblog.com/authors/react_expert',
      gistUrl: ''
    },
    isPublic: false,
    gistUrl: ''
  },
  {
    id: '1000000007',
    link: 'https://devblog.com/articles/1000000007',
    title: 'Mastering Git: Branching and Merging',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-05').toISOString(),
    tags: ['Git', 'Version Control', 'DevOps'],
    author: {
      id: '7',
      nickname: 'git_master',
      profile: 'https://devblog.com/authors/git_master',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000008',
    link: 'https://devblog.com/articles/1000000008',
    title: 'Introduction to Kubernetes for Beginners',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-10-01').toISOString(),
    tags: ['Kubernetes', 'DevOps', 'Containers'],
    author: {
      id: '8',
      nickname: 'k8s_pro',
      profile: 'https://devblog.com/authors/k8s_pro',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000009',
    link: 'https://devblog.com/articles/1000000009',
    title: 'Building Scalable Microservices with Spring Boot',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-09-25').toISOString(),
    tags: ['Spring Boot', 'Microservices', 'Backend'],
    author: {
      id: '9',
      nickname: 'spring_dev',
      profile: 'https://devblog.com/authors/spring_dev',
      gistUrl: ''
    },
    isPublic: false,
    gistUrl: ''
  },
  {
    id: '1000000010',
    link: 'https://devblog.com/articles/1000000010',
    title: 'GraphQL Basics: Query Language for APIs',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-09-20').toISOString(),
    tags: ['GraphQL', 'API', 'Web Development'],
    author: {
      id: '10',
      nickname: 'graphql_guru',
      profile: 'https://devblog.com/authors/graphql_guru',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  },
  {
    id: '1000000011',
    link: 'https://devblog.com/articles/1000000011',
    title: 'Understanding Docker: A Comprehensive Guide',
    logo: '/image/exampleImage.jpeg',
    date: new Date('2024-09-15').toISOString(),
    tags: ['Docker', 'DevOps', 'Containers'],
    author: {
      id: '11',
      nickname: 'docker_wizard',
      profile: 'https://devblog.com/authors/docker_wizard',
      gistUrl: ''
    },
    isPublic: true,
    gistUrl: ''
  }
];

// Lotus File 더미데이터
export const lotusMockFileData = {
  language: 'javascript',
  files: [
    {
      filename: 'index.js',
      language: 'javascript',
      content: "console.log('Hello, World!');"
    },
    {
      filename: 'run.js',
      language: 'javascript',
      content: `function run() {\n  console.log('Running...');\n}`
    },
    {
      filename: 'README.md',
      language: 'markdown',
      content:
        '## #️⃣연관된 이슈\n' +
        '\n' +
        '#71\n' +
        '\n' +
        '## 📝작업 내용\n' +
        '\n' +
        '- MockRepository를 사용해 동적인 Mocking 구현\n' +
        '- lotusList api 계층\n' +
        '- lotusList query 계층\n' +
        '- SuspenseLotusCardList 구현\n' +
        '\n' +
        '### 스크린샷 (선택)\n' +
        '\n' +
        '![lotusListPage](https://github.com/user-attachments/assets/01fa0ad7-f556-485f-b442-2b9a51161f0d)\n' +
        '\n' +
        '## 💬리뷰 요구사항(선택)\n' +
        '\n' +
        '> 모킹파일을 건드리고, 구조화 했더니 변경사항이 너무 많네요.. 죄송합니다.\n' +
        '\n' +
        '네이밍이 이상하거나 이해가 가지 않는 부분 모두 코멘트 남겨주세요!\n' +
        '\n' +
        '모킹은 순차적으로 동적으로 변경해볼 예정입니다.\n' +
        '\n' +
        '파일 경로나 query-key 구조화 같은 경우에는 추후에 정리가 필요해보입니다.\n'
    }
  ]
};
