export class PageDto {
  current: number;
  max: number;

  static ofNumbers(current: number, max: number) {
    return { current, max };
  }
}
