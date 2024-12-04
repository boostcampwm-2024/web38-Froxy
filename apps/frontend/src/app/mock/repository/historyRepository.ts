import { MockRepository } from '@/app/mock/MockRepository';
import { HistoryDto } from '@/feature/history';

export const historyRepository = new MockRepository<Omit<HistoryDto, 'id'>>();

const insertHistory = () => {
  const historyMock: HistoryDto[] = [
    {
      id: '2000001',
      status: 'SUCCESS',
      date: '2024-11-15T14:30:00Z',
      filename: 'main.js',
      input: '11',
      output: '3'
    },
    {
      id: '2000002',
      status: 'SUCCESS',
      date: '2024-11-16T12:00:00Z',
      filename: 'index.js',
      input: '12',
      output: 'console.log(7)'
    },
    {
      id: '2000003',
      status: 'ERROR',
      date: '2024-11-14T16:45:00Z',
      filename: 'main.js',
      input: '13',
      output: 'Error: Cannot find module'
    }
  ];

  for (const item of historyMock) {
    historyRepository.create(item);
  }
};

insertHistory();
