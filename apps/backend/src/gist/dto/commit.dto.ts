export class CommitDto {
  committed_at: string;
  url: string;
  commit_id: string;

  static of(committed_at: string, url: string, commit_id: string): CommitDto {
    return {
      committed_at,
      url,
      commit_id
    };
  }
}
