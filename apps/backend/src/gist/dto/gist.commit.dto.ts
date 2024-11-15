export class CommitDto {
  committedAt: string;
  commitId: string;
  url: string;

  static of(history: any): CommitDto {
    return {
      committedAt: history.committedAt,
      commitId: history.version,
      url: history.url
    };
  }
}
