import { Injectable } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { CommitDto } from './dto/gist.commit.dto';
import { GistApiFileDto } from './dto/gistApiFile.dto';
import { GistApiFileListDto } from './dto/gistApiFileList.dto';
import { ResponseAllGistsDto } from './dto/response.allGists.dto';
import { ResponseGistDto } from './dto/response.gist.dto';
import { UserDto } from './dto/user.dto';
import { GIST_AUTH_HEADER } from '@/constants/constants';

@Injectable()
export class GistService {
  gittoken: string;
  constructor() {
    this.gittoken = '';
  }
  async getGistList(gitToken: string, page: number, per_page: number): Promise<ResponseAllGistsDto> {
    let hasNextPage = true;
    const currentGistPage = await this.gistPageData(gitToken, page, per_page);
    const nextGistPage = await this.gistPageData(gitToken, page + 1, per_page);

    if (nextGistPage.length === 0) {
      hasNextPage = false;
    }

    if (currentGistPage.length === 0) {
      throw new Error('data없음');
    }
    const gists = currentGistPage.map((gist) => {
      return ResponseGistDto.of(gist);
    });
    return ResponseAllGistsDto.of(gists, page, hasNextPage);
  }

  async gistPageData(gitToken: string, page: number, per_page: number): Promise<any[]> {
    const params = {
      page: page.toString(),
      per_page: per_page.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const gistsData = await this.gistReq('GET', `https://api.github.com/gists`, gitToken, queryParam);
    return gistsData;
  }

  async getGistById(id: string): Promise<GistApiFileListDto> {
    console.log(`https://api.github.com/gists/${id}`);
    const data = await this.gistReq('GET', `https://api.github.com/gists/${id}`, this.gittoken);
    console.log(data);

    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(data);

    return GistApiFileListDto.of(data, fileArr);
  }

  async getMostRecentGistInUser(): Promise<GistApiFileListDto> {
    const params = {
      page: '1',
      per_page: '1'
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await this.gistReq('GET', 'https://api.github.com/gists', this.gittoken, queryParam);
    if (!response.length) {
      throw new Error('404');
    }
    const mostRecentData = response[0];
    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(mostRecentData);
    console.log(mostRecentData);
    return GistApiFileListDto.of(mostRecentData, fileArr);
  }

  async getCommitsForAGist(gist_id: string, pageIdx = 1): Promise<CommitDto[]> {
    const page = pageIdx;
    const perPage = 5;
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const data = await this.gistReq(
      'GET',
      `https://api.github.com/gists/${gist_id}/commits`,
      this.gittoken,
      queryParam
    );
    const commits: CommitDto[] = data.map((history) => CommitDto.of(history));
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
    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(dataJson);

    return GistApiFileListDto.of(dataJson, fileArr);
  }

  async getUserData(): Promise<UserDto> {
    const userData = await this.gistReq('GET', 'https://api.github.com/user', this.gittoken);
    if (!userData.id || !userData.avatar_url || !userData.login) {
      throw new Error('404');
    }
    const result: UserDto = UserDto.of(userData);
    return result;
  }
  //truncated 옵션
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
    const data = await this.gistReq('GET', `https://api.github.com/gists/${gist_id}/comments`, this.gittoken);
    const comments: CommentDto[] = data.map((comment) => CommentDto.of(comment));
    return comments;
  }

  async createComments(gist_id: string, detail: string): Promise<CommentDto> {
    const data = await this.gistReq(
      'POST',
      `https://api.github.com/gists/${gist_id}/comments`,
      this.gittoken,
      '',
      detail
    );
    const comment: CommentDto = CommentDto.of(data);
    return comment;
  }

  async updateComment(gist_id: string, comment_id: string, detail: string): Promise<boolean> {
    const data = await this.gistReq(
      'PATCH',
      `https://api.github.com/gists/${gist_id}/comments/${comment_id}`,
      this.gittoken,
      '',
      detail
    );
    return true;
  }

  async deleteComment(gist_id: string, comment_id: string): Promise<boolean> {
    const data = await this.gistReq(
      'DELETE',
      `https://api.github.com/gists/${gist_id}/comments/${comment_id}`,
      this.gittoken
    );
    return true;
  }

  async gistReq(
    method: string,
    commend: string,
    gitToken: string = null,
    queryParam = '',
    body: any = null
  ): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const requestInit: RequestInit = {
      method: method,
      headers: GIST_AUTH_HEADER(gitToken)
    };

    if (body) {
      requestInit.body = JSON.stringify({ body });
    }
    const response = await fetch(commendURL, requestInit);
    if (!response.ok) {
      throw new Error('404');
    }
    return await response.json();
  }

  async parseGistApiFiles(gistData: any): Promise<GistApiFileDto[]> {
    return await Promise.all(
      Object.keys(gistData.files).map(async (filename) => {
        //trunc 옵션
        const content = await this.getFileContent(gistData.files[filename].raw_url);
        return GistApiFileDto.of(filename, gistData, content);
      })
    );
  }
}
