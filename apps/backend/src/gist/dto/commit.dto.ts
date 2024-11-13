export class CommitDto {
  committed_at: string;
  url: string;

  constructor(committed_at: string, url: string) {
    this.committed_at = committed_at;
    this.url = url;
  }
}
