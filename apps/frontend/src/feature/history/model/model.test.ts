import { describe, expect, it } from 'vitest';
import { HistoryModel } from './model';
import { HISTORY_STATUS } from '@/feature/history/constant';

describe('HistoryModel', () => {
  it.each([
    {
      description: '올바른 DTO를 받아 HistoryModel을 생성합니다.',
      dto: {
        id: '1',
        status: HISTORY_STATUS.SUCCESS,
        date: '2024-01-01T00:00:00.000Z',
        input: 'some input',
        output: 'some output',
        filename: 'file1.txt'
      },
      expected: {
        id: '1',
        status: HISTORY_STATUS.SUCCESS,
        date: new Date('2024-01-01T00:00:00.000Z'),
        input: 'some input',
        output: 'some output',
        filename: 'file1.txt'
      }
    },
    {
      description: '잘못된 status를 받아 HistoryModel을 생성하면 status는 ERROR로 설정됩니다.',
      dto: {
        id: '2',
        status: 'INVALID_STATUS',
        date: '2024-02-01T00:00:00.000Z',
        input: 'input2',
        output: 'output2',
        filename: 'file2.txt'
      },
      expected: {
        id: '2',
        status: HISTORY_STATUS.ERROR,
        date: new Date('2024-02-01T00:00:00.000Z'),
        input: 'input2',
        output: 'output2',
        filename: 'file2.txt'
      }
    }
  ])('$description', ({ dto, expected }) => {
    // Given
    const historyModel = new HistoryModel(dto);

    // Then: 객체 속성 검증
    expect(historyModel).toMatchObject(expected);
  });

  it('getPendingHistoriesId는 HistoryModel[]을 인자로 받아 PENDING 상태인 HistoryId를 반환합니다.', () => {
    // Given
    const expected = ['1', '3'];
    const histories = [
      new HistoryModel({
        id: '1',
        status: HISTORY_STATUS.PENDING,
        date: '2024-01-01T00:00:00.000Z',
        input: 'input1',
        output: 'output1',
        filename: 'file1.txt'
      }),
      new HistoryModel({
        id: '2',
        status: HISTORY_STATUS.SUCCESS,
        date: '2024-02-01T00:00:00.000Z',
        input: 'input2',
        output: 'output2',
        filename: 'file2.txt'
      }),
      new HistoryModel({
        id: '3',
        status: HISTORY_STATUS.PENDING,
        date: '2024-03-01T00:00:00.000Z',
        input: 'input3',
        output: 'output3',
        filename: 'file3.txt'
      })
    ];

    // When
    const pendingIds = HistoryModel.getPendingHistoriesId(histories);

    // Then
    expect(pendingIds).toEqual(expected);
  });

  it.each([
    {
      history: new HistoryModel({
        id: '1',
        status: HISTORY_STATUS.SUCCESS,
        date: '2024-01-01T00:00:00.000Z',
        input: 'input1',
        output: 'output1',
        filename: 'file1.txt'
      }),
      status: HISTORY_STATUS.SUCCESS,
      expected: true
    },
    {
      history: new HistoryModel({
        id: '2',
        status: HISTORY_STATUS.ERROR,
        date: '2024-02-01T00:00:00.000Z',
        input: 'input2',
        output: 'output2',
        filename: 'file2.txt'
      }),
      status: HISTORY_STATUS.PENDING,
      expected: false
    }
  ])(
    'isStatus를 통해 history의 status를 검증할 수 있습니다. ($history.status 일때 history.isStatus($status)는 $expected 입니다.)',
    ({ history, status, expected }) => {
      //Given
      //When

      //Then
      expect(history.isStatus(status)).toBe(expected);
    }
  );
});
