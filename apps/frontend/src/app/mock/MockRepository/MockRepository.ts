export type Identifiable<T> = T & { id: string };

export class MockRepository<T> {
  private _autoId = 0;
  protected memory: Identifiable<T>[] = [];

  private isMatch(owner: Partial<T>, target: Partial<T>): boolean {
    for (const key in target) {
      if (
        !Object.prototype.hasOwnProperty.call(owner, key) ||
        target[key as keyof typeof target] !== owner[key as keyof typeof owner]
      ) {
        return false;
      }
    }
    return true;
  }

  private generateId() {
    return String(this._autoId++);
  }

  protected paginate(items: Identifiable<T>[], page: number, size: number) {
    const start = (page - 1) * size;
    const end = start + size;
    const data = items.slice(start, end);
    const maxPage = Math.ceil(items.length / size);
    return { data, maxPage };
  }

  async create(arg: T) {
    const data = { ...arg, id: this.generateId() };

    this.memory.push(data);

    return data;
  }

  async delete(query: Partial<Identifiable<T>>) {
    const index = this.memory.findIndex((t) => this.isMatch(t, query));

    if (index === -1) throw new Error('Not found');

    const deletedData = this.memory[index];

    this.memory = this.memory.filter((t) => t.id !== deletedData.id);

    return deletedData;
  }

  async update(query: Partial<Identifiable<T>>, data: Partial<Identifiable<T>>) {
    const index = this.memory.findIndex((item) => this.isMatch(item, query));

    if (index === -1) throw new Error('Not found');

    this.memory[index] = { ...this.memory[index], ...data };

    return this.memory[index];
  }

  async findMany({ query, page = 1, size = 10 }: { query?: Partial<Identifiable<T>>; page?: number; size?: number }) {
    const filtered = query ? this.memory.filter((item) => this.isMatch(item, query)) : this.memory;
    return this.paginate(filtered, page, size);
  }

  async findOne(query: Partial<Identifiable<T>>) {
    const data = this.memory.find((item) => this.isMatch(item, query));

    if (!data) throw new Error('Not found');

    return data;
  }
}
