import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  gitBaseUrl: string;
  constructor() {
    this.gitBaseUrl = 'https://api.github.com/';
  }
  async getGistList(gitToken: string, page: number, perPage: number): Promise<ResponseAllGistsDto> {
    let hasNextPage = true;
    const currentGistPage = await this.gistPageData(gitToken, page, perPage);
    const nextGistPage = await this.gistPageData(gitToken, page + 1, perPage);

    if (nextGistPage.length === 0) {
      hasNextPage = false;
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
    const gistsData = await this.gistReq('GET', `${this.gitBaseUrl}gists`, gitToken, queryParam);
    return await gistsData.json();
  }

  async getGistById(id: string, gitToken: string): Promise<GistApiFileListDto> {
    let response = null;
    try {
      response = await this.gistReq('GET', `${this.gitBaseUrl}gists/${id}`, gitToken);
    } catch (e) {
      throw new HttpException('gistId is not exist', HttpStatus.NOT_FOUND);
    }
    const data = await response.json();

    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(data, gitToken);
    return GistApiFileListDto.of(data, fileArr);
  }

  async getMostRecentGistInUser(gitToken: string): Promise<GistApiFileListDto> {
    const params = {
      page: '1',
      per_page: '1'
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await this.gistReq('GET', `${this.gitBaseUrl}gists`, gitToken, queryParam);
    if (!response.length) {
      throw new Error('404');
    }
    const mostRecentData = response[0];

    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(mostRecentData, gitToken);
    return GistApiFileListDto.of(mostRecentData, fileArr);
  }

  async getCommitsForAGist(gist_id: string, pageIdx = 1, gitToken: string): Promise<CommitDto[]> {
    const page = pageIdx;
    const perPage = 5;
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await this.gistReq('GET', `${this.gitBaseUrl}gists/${gist_id}/commits`, gitToken, queryParam);
    const data = await response.json();
    const commits: CommitDto[] = data.map((history) => CommitDto.of(history));
    return commits;
  }

  async getCommit(gist_id: string, commit_id: string, gitToken: string) {
    const response = await this.getFilesFromCommit(this.getCommitUrl(gist_id, commit_id), gitToken);
    return response;
  }

  getCommitUrl(gist_id: string, commit_id: string) {
    return `https://api.github.com/gists/${gist_id}/${commit_id}`;
  }

  async getFilesFromCommit(commit_url: string, gittoken: string) {
    const data = await this.getFileContent(commit_url, gittoken);
    const dataJson = JSON.parse(data);
    const fileArr: GistApiFileDto[] = await this.parseGistApiFiles(dataJson, gittoken);

    return GistApiFileListDto.of(dataJson, fileArr);
  }

  async getUserData(gitToken: string): Promise<UserDto> {
    const response = await this.gistReq('GET', `${this.gitBaseUrl}user`, gitToken);
    const userData = await response.json();
    if (!userData.id || !userData.avatar_url || !userData.login) {
      throw new Error('404');
    }
    const result: UserDto = UserDto.of(userData);
    return result;
  }
  async getFileContent(raw_url: string, gittoken: string) {
    const header = {};
    if (gittoken) {
      header['Authorization'] = `Bearer ${gittoken}`;
    }
    const response = await fetch(raw_url, {
      headers: header
    });
    if (!response.ok) {
      throw new Error('404');
    }
    const data = await response.text();
    return data;
  }

  async getComments(gitToken: string, gist_id: string): Promise<CommentDto[]> {
    const data = await this.gistReq('GET', `${this.gitBaseUrl}gists/${gist_id}/comments`, gitToken);
    const comments: CommentDto[] = data.map((comment) => CommentDto.of(comment));
    return comments;
  }

  async createComments(gitToken: string, gist_id: string, detail: string): Promise<CommentDto> {
    const response = await this.gistReq('POST', `${this.gitBaseUrl}gists/${gist_id}/comments`, gitToken, '', detail);

    const data = await response.json();
    const comment: CommentDto = CommentDto.of(data);
    return comment;
  }

  async updateComment(gitToken: string, gist_id: string, comment_id: string, detail: string): Promise<boolean> {
    const response = await this.gistReq(
      'PATCH',
      `${this.gitBaseUrl}gists/${gist_id}/comments/${comment_id}`,
      gitToken,
      '',
      detail
    );
    const data = await response.json();
    return true;
  }

  async deleteComment(gitToken: string, gist_id: string, comment_id: string): Promise<boolean> {
    const data = await this.gistReq('DELETE', `${this.gitBaseUrl}gists/${gist_id}/comments/${comment_id}`, gitToken);
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
      throw new HttpException('gist api throw error', HttpStatus.NOT_FOUND);
    }
    return response;
  }

  async parseGistApiFiles(gistData: any, gitToken: string): Promise<GistApiFileDto[]> {
    return await Promise.all(
      Object.keys(gistData.files).map(async (filename) => {
        //trunc 옵션
        const content = await this.getFileContent(gistData.files[filename].raw_url, gitToken);
        return GistApiFileDto.of(filename, gistData, content);
      })
    );
  }
}
