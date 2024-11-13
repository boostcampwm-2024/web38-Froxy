import { Injectable } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { CommitDto } from './dto/commit.dto';
import { GistApiFileDto } from './dto/gistApiFile.dto';
import { GistApiFileListDto } from './dto/gistApiFileList.dto';
import { UserDto } from './dto/user.dto';

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
            const fileArr: GistApiFileDto[] = [];

            return new GistApiFileListDto(
              gist.id,
              gist.description,
              fileArr,
              new UserDto(gist.owner.login, gist.owner.id, gist.owner.avatar_url),
              gist.public
            );
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
        return new GistApiFileDto(
          key,
          data.files[key].raw_url,
          data.files[key].type,
          data.files[key].language,
          data.files[key].size,
          content
        );
      })
    );

    const gist: GistApiFileListDto = new GistApiFileListDto(
      data.id,
      data.description,
      fileArr,
      new UserDto(data.owner.login, data.owner.id, data.owner.avatar_url),
      data.public
    );
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

        return new GistApiFileDto(
          key,
          mostRecentData.files[key].raw_url,
          mostRecentData.files[key].type,
          mostRecentData.files[key].language,
          mostRecentData.files[key].size,
          content
        );
      })
    );
    const gist: GistApiFileListDto = new GistApiFileListDto(
      mostRecentData.id,
      mostRecentData.description,
      fileArr,
      new UserDto(mostRecentData.owner.login, mostRecentData.owner.id, mostRecentData.owner.avatar_url),
      mostRecentData.public
    );

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
    const commits: CommitDto[] = data.map((commit) => new CommitDto(commit.committed_at, commit.url));
    return commits;
  }

  async getCommit(gist_id: string, commit_id: number) {
    const commits = await this.getCommitsForAGist(gist_id);
    const response = await this.getFilesFromCommit(commits[commit_id].url);
    return response;
  }

  async getFilesFromCommit(commit_url: string) {
    const data = await this.getFileContent(commit_url);
    const dataJson = JSON.parse(data);
    const fileArr: GistApiFileDto[] = await Promise.all(
      Object.keys(dataJson.files).map(async (key) => {
        const content = await this.getFileContent(dataJson.files[key].raw_url);

        return new GistApiFileDto(
          key,
          dataJson.files[key].raw_url,
          dataJson.files[key].type,
          dataJson.files[key].language,
          dataJson.files[key].size,
          content
        );
      })
    );
    const gist: GistApiFileListDto = new GistApiFileListDto(
      dataJson.id,
      dataJson.description,
      fileArr,
      new UserDto(dataJson.owner.login, dataJson.owner.id, dataJson.owner.avatar_url),
      dataJson.public
    );

    return gist;
  }

  async getUserData(): Promise<UserDto> {
    const userData = await this.gistGetReq('https://api.github.com/user');
    if (!userData.id || !userData.avatar_url || !userData.login) {
      throw new Error('404');
    }
    const result: UserDto = new UserDto(userData.login, userData.id, userData.avatar_url);
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
    const comments: CommentDto[] = data.map(
      (comment) =>
        new CommentDto(
          comment.id,
          comment.created_at,
          comment.body,
          new UserDto(comment.user.login, comment.user.id, comment.user.avatar_url)
        )
    );
    return comments;
  }

  async createComments(gist_id: string, detail: string): Promise<CommentDto> {
    const data = await this.gistPostReq(`https://api.github.com/gists/${gist_id}/comments`, '', detail);
    const comment: CommentDto = new CommentDto(
      data.id,
      data.created_at,
      data.body,
      new UserDto(data.user.login, data.user.id, data.user.avatar_url)
    );
    return comment;
  }

  async updateComment(gist_id: string, comment_id: string, detail: string): Promise<boolean> {
    const data = await this.gistPatchReq(`https://api.github.com/gists/${gist_id}/comments/${comment_id}`, '', detail);
    if (!data.ok) {
      throw new Error('404');
    }
    return true;
  }

  async deleteComment(gist_id: string, comment_id: string): Promise<boolean> {
    const data = await this.gistDeleteReq(`https://api.github.com/gists/${gist_id}/comments/${comment_id}`);
    if (!data.ok) {
      throw new Error('404');
    }
    return true;
  }

  async gistGetReq(commend: string, queryParam = ''): Promise<any> {
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

  async gistPostReq(commend: string, queryParam = '', body: string = null): Promise<any> {
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
    console.log(response);
    return await response.json();
  }

  async gistPatchReq(commend: string, queryParam = '', body: string = null): Promise<any> {
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
    return response;
  }

  async gistDeleteReq(commend: string, queryParam = ''): Promise<any> {
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
