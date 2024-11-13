import { Injectable } from '@nestjs/common';
import { GistApiFileListDto } from './dto/gistApiFileList.dto';
import { GistApiFileDto } from './dto/gistApiFile.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';
import { CommitDto } from './dto/commit.dto';

@Injectable()
export class GistService {
  gittoken: string;
  constructor() {
    this.gittoken = '';
  }
  async getAllGists(): Promise<GistApiFileListDto[]> {
    let page = 1;
    const perPage = 100;
    const gistList: GistApiFileListDto[] = [];
    while (true) {
      const params = {
        page: page.toString(),
        per_page: perPage.toString()
      };
      const queryParam = new URLSearchParams(params).toString();
      const data = await this.gistGetReq(`https://api.github.com/gists`, queryParam);
      if (data.length === 0) {
        break;
      }
      page++;
      const gistFiles: GistApiFileListDto[] = await Promise.all(
        data
          .filter((gistfiltering: GistApiFileListDto) => {
            return gistfiltering.id && gistfiltering.description && gistfiltering.files && gistfiltering.owner;
          })
          .map(async (gist: GistApiFileListDto) => {
            const fileArr: GistApiFileDto[] = await Promise.all(
              Object.keys(gist.files).map(async (key) => {
                const content = await this.getFileContent(gist.files[key].raw_url);

                return {
                  file_name: key,
                  raw_url: gist.files[key].raw_url,
                  type: gist.files[key].type,
                  language: gist.files[key].language,
                  size: gist.files[key].size,
                  content: content
                };
              })
            );

            return {
              id: gist.id,
              description: gist.description,
              files: fileArr,
              public: gist.public,
              owner: {
                login: gist.owner.login,
                id: gist.owner.id,
                avatar_url: gist.owner.avatar_url
              }
            };
          })
      );
      gistList.push(...gistFiles);
    }
    return gistList;
  }

  async getGistById(id: string): Promise<GistApiFileListDto> {
    const data = await this.gistGetReq(`https://api.github.com/gists/${id}`);

    const fileArr: GistApiFileDto[] = await Promise.all(
      Object.keys(data.files).map(async (key) => {
        const content = await this.getFileContent(data.files[key].raw_url);

        return {
          file_name: key,
          raw_url: data.files[key].raw_url,
          type: data.files[key].type,
          language: data.files[key].language,
          size: data.files[key].size,
          content: content
        };
      })
    );

    const gist: GistApiFileListDto = {
      id: data.id,
      description: data.description,
      files: fileArr,
      public: data.public,
      owner: {
        login: data.owner.login,
        id: data.owner.id,
        avatar_url: data.owner.avatar_url
      }
    };
    return gist;
  }

  async getMostRecentGistInUser(): Promise<GistApiFileListDto> {
    const params = {
      page: '1',
      per_page: '1'
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await this.gistGetReq('https://api.github.com/gists', queryParam);

    if (!response.length) {
      throw new Error('404');
    }
    const mostRecentData = response[0];

    const fileArr: GistApiFileDto[] = await Promise.all(
      Object.keys(mostRecentData.files).map(async (key) => {
        const content = await this.getFileContent(mostRecentData.files[key].raw_url);

        return {
          file_name: key,
          raw_url: mostRecentData.files[key].raw_url,
          type: mostRecentData.files[key].type,
          language: mostRecentData.files[key].language,
          size: mostRecentData.files[key].size,
          content: content
        };
      })
    );
    const gist: GistApiFileListDto = {
      id: mostRecentData.id,
      description: mostRecentData.description,
      files: fileArr,
      public: mostRecentData.public,
      owner: {
        login: mostRecentData.owner.login,
        id: mostRecentData.owner.id,
        avatar_url: mostRecentData.owner.avatar_url
      }
    };

    return gist;
  }

  async getCommitsForAGist(gist_id: string, pageIdx = 1): Promise<CommitDto[]> {
    const page = pageIdx;
    const perPage = 5;
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const data = await this.gistGetReq(`https://api.github.com/gists/${gist_id}/commits`, queryParam);
    const commits: CommitDto[] = data.map((commit) => ({
      committed_at: commit.committed_at,
      url: commit.url
    }));
    return commits;
  }

  async getCommit(gist_id: string, commit_id: number) {
    const commits = await this.getCommitsForAGist(gist_id);
    const response = await this.getFilesFromCommit(commits[commit_id].url);
    return response;
  }

  async getFilesFromCommit(commit_url: string) {
    const data = await this.getFileContent(commit_url);
    const data2 = JSON.parse(data);
    const fileArr: GistApiFileDto[] = await Promise.all(
      Object.keys(data2.files).map(async (key) => {
        const content = await this.getFileContent(data2.files[key].raw_url);

        return {
          file_name: key,
          raw_url: data2.files[key].raw_url,
          type: data2.files[key].type,
          language: data2.files[key].language,
          size: data2.files[key].size,
          content: content
        };
      })
    );
    const gist: GistApiFileListDto = {
      id: data2.id,
      description: data2.description,
      files: fileArr,
      public: data2.public,
      owner: {
        login: data2.owner.login,
        id: data2.owner.id,
        avatar_url: data2.owner.avatar_url
      }
    };
    return gist;
  }

  async getUserData(): Promise<UserDto> {
    const userData = await this.gistGetReq('https://api.github.com/user');
    if (!userData.id || !userData.avatar_url || !userData.login) {
      throw new Error('404');
    }
    const result: UserDto = {
      id: userData.id,
      avatar_url: userData.avatar_url,
      login: userData.login
    };
    return result;
  }

  async getFileContent(raw_url: string) {
    const response = await fetch(raw_url, {
      headers: {
        Authorization: `Bearer ${this.gittoken}`
      }
    });
    if (!response.ok) {
      throw new Error('404');
    }
    const data = await response.text();
    return data;
  }

  async getComments(gist_id: string): Promise<CommentDto[]> {
    const data = await this.gistGetReq(`https://api.github.com/gists/${gist_id}/comments`);
    const comments: CommentDto[] = data.map((comment) => ({
      id: comment.id,
      created_at: comment.created_at,
      body: comment.body,
      owner: {
        id: comment.user.id,
        login: comment.user.login,
        avatar_url: comment.user.avatar_url
      }
    }));
    return comments;
  }

  async createComments(gist_id: string, detail: string): Promise<CommentDto> {
    const data = await this.gistPostReq(`https://api.github.com/gists/${gist_id}/comments`, '', detail);
    const comment: CommentDto = {
      id: data.id,
      created_at: data.created_at,
      body: data.body,
      owner: {
        id: data.user.id,
        login: data.user.login,
        avatar_url: data.user.avatar_url
      }
    };
    return comment;
  }

  async updateComment(gist_id: string, comment_id: string, detail: string): Promise<boolean> {
    const data = await this.gistPatchReq(`https://api.github.com/gists/${gist_id}/comments/${comment_id}`, '', detail);
    return true;
  }

  async deleteComment(gist_id: string, comment_id: string): Promise<boolean> {
    const data = await this.gistDeleteReq(`https://api.github.com/gists/${gist_id}/comments/${comment_id}`);
    return true;
  }

  async gistGetReq(commend: string, queryParam: string = ''): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const response = await fetch(commendURL, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return await response.json();
  }

  async gistPostReq(commend: string, queryParam: string = '', body: string = null): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const response = await fetch(commendURL, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: body })
    });
    return await response.json();
  }

  async gistPatchReq(commend: string, queryParam: string = '', body: string = null): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const response = await fetch(commendURL, {
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body: body })
    });
    return await response.json();
  }

  async gistDeleteReq(commend: string, queryParam: string = ''): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const response = await fetch(commendURL, {
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return response;
  }
}
