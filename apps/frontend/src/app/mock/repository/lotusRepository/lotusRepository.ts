import { lotusMockData } from './lotusMockData';
import { MockRepository } from '@/app/mock/MockRepository';
import { LotusDto } from '@/feature/lotus';
import { UserDto } from '@/feature/user';

class LotusRepository extends MockRepository<Omit<LotusDto & { author: UserDto }, 'id'>> {
  private isPartialMatch(owner: Partial<LotusDto>, target: Partial<LotusDto>): boolean {
    for (const key in target) {
      if (!Object.prototype.hasOwnProperty.call(owner, key)) return false;

      const ownerValue = owner[key as keyof LotusDto];
      const targetValue = target[key as keyof LotusDto];

      if (typeof targetValue === 'boolean' && ownerValue !== targetValue) return false;
      if (typeof targetValue === 'string' && !(ownerValue as string)?.includes(targetValue)) return false;
    }
    return true;
  }

  async search({ query, page = 1, size = 10 }: { query?: Partial<LotusDto>; page?: number; size?: number }) {
    const filtered = query ? this.memory.filter((item) => this.isPartialMatch(item, query)) : this.memory;

    return this.paginate(filtered, page, size);
  }
}

export const lotusRepository = new LotusRepository();

const insertLotus = () => {
  lotusMockData.forEach((lotus) => {
    lotusRepository.create(lotus);
  });
};

insertLotus();
