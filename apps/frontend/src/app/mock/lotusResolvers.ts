import { DefaultBodyType, HttpResponse, PathParams, StrictRequest } from 'msw';
import { MockRepository } from './MockRepository';
import { LotusType } from '@/feature/lotus/type';

const lotusList = new MockRepository<Omit<LotusType, 'id'>>();

insertLotus();

// public lotus 목록 조회
export const getPublicLotusList = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const size = Number(url.searchParams.get('size')) || 5;

  const lotuses = await lotusList.findMany({ page, size });

  return HttpResponse.json({
    lotuses,
    page: {
      current: page,
      max: 5
    }
  });
};

// public lotus 상세 조회
export const getLotusDetail = async ({ params }: { params: Record<string, string> }) => {
  const lotusId = params.lotusId;

  const lotus = await lotusList.findOne({ id: lotusId });

  return HttpResponse.json({
    ...lotus,
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
  });
};

type CreateLotusDto = {
  title: string;
  isPublic: false;
  tags: string[];
  gistUuid: string;
};

//lotus 생성
export const postCreateLotus = async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
  const body = (await request.json()) as CreateLotusDto;

  const lotus = await lotusList.create({
    ...body,
    date: new Date(),
    author: { id: '1', nickname: 'js_master', profile: 'https://devblog.com/authors/js_master' },
    logo: "data:image/png;base64,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';",
    link: 'https://devblog.com/articles/1000000001',
    isPublic: false
  });

  return HttpResponse.json(lotus);
};

// lotus 수정
export const patchLotus = async ({
  params,
  request
}: {
  params: PathParams;
  request: StrictRequest<DefaultBodyType>;
}) => {
  const { id } = params;

  const body = (await request.json()) as Partial<LotusType>;

  if (!id || typeof id !== 'string') return HttpResponse.json({ message: 'id is required' });

  const lotus = await lotusList.findOne({ id });

  const updatedLotus = await lotusList.update(lotus, body);

  return HttpResponse.json(updatedLotus);
};

// lotus 삭제

export const deleteLotus = async ({ params }: { params: PathParams }) => {
  const { id } = params;

  if (!id || typeof id !== 'string') return HttpResponse.json({ message: 'id is required' });

  const lotus = await lotusList.findOne({
    id
  });

  await lotusList.delete(lotus);

  return HttpResponse.json(lotus);
};

function insertLotus() {
  const jsImage =
    'data:image/png;base64,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';

  const mockLotusData: LotusType[] = [
    {
      id: '1000000001',
      link: 'https://devblog.com/articles/1000000001',
      title: 'Understanding JavaScript Closures',
      logo: jsImage,
      date: new Date('2024-11-01'),
      tags: ['JavaScript', 'Closures', 'Web Development'],
      author: {
        id: '1',
        nickname: 'js_master',
        profile: 'https://devblog.com/authors/js_master'
      },
      isPublic: true
    },
    {
      id: '1000000002',
      link: 'https://devblog.com/articles/1000000002',
      title: 'A Guide to Responsive Design with CSS',
      logo: jsImage,
      date: new Date('2024-10-28'),
      tags: ['CSS', 'Responsive Design', 'Frontend'],
      author: {
        id: '2',
        nickname: 'css_wizard',
        profile: 'https://devblog.com/authors/css_wizard'
      },
      isPublic: true
    },
    {
      id: '1000000003',
      link: 'https://devblog.com/articles/1000000003',
      title: 'TypeScript vs JavaScript: Key Differences',
      logo: jsImage,
      date: new Date('2024-10-25'),
      tags: ['TypeScript', 'JavaScript', 'Programming'],
      author: {
        id: '3',
        nickname: 'ts_guru',
        profile: 'https://devblog.com/authors/ts_guru'
      },
      isPublic: true
    },
    {
      id: '1000000004',
      link: 'https://devblog.com/articles/1000000004',
      title: 'How to Build RESTful APIs with Node.js',
      logo: jsImage,
      date: new Date('2024-10-20'),
      tags: ['Node.js', 'API', 'Backend'],
      author: {
        id: '4',
        nickname: 'node_dev',
        profile: 'https://devblog.com/authors/node_dev'
      },
      isPublic: false
    },
    {
      id: '1000000005',
      link: 'https://devblog.com/articles/1000000005',
      title: 'Top 10 Python Libraries for Data Science',
      logo: jsImage,
      date: new Date('2024-10-15'),
      tags: ['Python', 'Data Science', 'Libraries'],
      author: {
        id: '5',
        nickname: 'data_scientist',
        profile: 'https://devblog.com/authors/data_scientist'
      },
      isPublic: true
    },
    {
      id: '1000000006',
      link: 'https://devblog.com/articles/1000000006',
      title: 'React State Management: Context vs Redux',
      logo: jsImage,
      date: new Date('2024-10-10'),
      tags: ['React', 'Redux', 'Frontend'],
      author: {
        id: '6',
        nickname: 'react_expert',
        profile: 'https://devblog.com/authors/react_expert'
      },
      isPublic: false
    },
    {
      id: '1000000007',
      link: 'https://devblog.com/articles/1000000007',
      title: 'Mastering Git: Branching and Merging',
      logo: jsImage,
      date: new Date('2024-10-05'),
      tags: ['Git', 'Version Control', 'DevOps'],
      author: {
        id: '7',
        nickname: 'git_master',
        profile: 'https://devblog.com/authors/git_master'
      },
      isPublic: true
    },
    {
      id: '1000000008',
      link: 'https://devblog.com/articles/1000000008',
      title: 'Introduction to Kubernetes for Beginners',
      logo: jsImage,
      date: new Date('2024-10-01'),
      tags: ['Kubernetes', 'DevOps', 'Containers'],
      author: {
        id: '8',
        nickname: 'k8s_pro',
        profile: 'https://devblog.com/authors/k8s_pro'
      },
      isPublic: true
    },
    {
      id: '1000000009',
      link: 'https://devblog.com/articles/1000000009',
      title: 'Building Scalable Microservices with Spring Boot',
      logo: jsImage,
      date: new Date('2024-09-25'),
      tags: ['Spring Boot', 'Microservices', 'Backend'],
      author: {
        id: '9',
        nickname: 'spring_dev',
        profile: 'https://devblog.com/authors/spring_dev'
      },
      isPublic: false
    },
    {
      id: '1000000010',
      link: 'https://devblog.com/articles/1000000010',
      title: 'GraphQL Basics: Query Language for APIs',
      logo: jsImage,
      date: new Date('2024-09-20'),
      tags: ['GraphQL', 'API', 'Web Development'],
      author: {
        id: '10',
        nickname: 'graphql_guru',
        profile: 'https://devblog.com/authors/graphql_guru'
      },
      isPublic: true
    },
    {
      id: '1000000011',
      link: 'https://devblog.com/articles/1000000011',
      title: 'Understanding Docker: A Comprehensive Guide',
      logo: jsImage,
      date: new Date('2024-09-15'),
      tags: ['Docker', 'DevOps', 'Containers'],
      author: {
        id: '11',
        nickname: 'docker_wizard',
        profile: 'https://devblog.com/authors/docker_wizard'
      },
      isPublic: true
    }
  ];
  mockLotusData.forEach((lotus) => {
    lotusList.create(lotus);
  });
}
