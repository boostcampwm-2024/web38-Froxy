import { Injectable } from '@nestjs/common';
import { GistApiFileListDto } from './dto/gistApiFileList.dto';
import { GistApiFileDto } from './dto/gistApiFile.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';

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
      const data = await this.gistReq('GET', `https://api.github.com/gists`, queryParam);
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
    const data = await this.gistReq('GET', `https://api.github.com/gists/${id}`);

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
    const response = await this.gistReq('GET', 'https://api.github.com/gists', queryParam);

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

  async getCommitsForAGist(gist_id: string, pageIdx = 1): Promise<any> {
    const page = pageIdx;
    const perPage = 5;
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await this.gistReq('GET', `https://api.github.com/gists/${gist_id}/commits`, queryParam);
    return await response;
  }

  async getUserData(): Promise<UserDto> {
    const userData = await this.gistReq('GET', 'https://api.github.com/user');
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
    const data = await this.gistReq('GET', `https://api.github.com/gists/${gist_id}/comments`);
    const comments: CommentDto[] = data.map((comment) => ({
      id: comment.id,
      updated_at: comment.updated_at,
      body: comment.body,
      owner: {
        id: comment.user.id,
        login: comment.user.login,
        avatar_url: comment.user.avatar_url
      }
    }));
    return comments;
  }

  async gistReq(method: string, commend: string, queryParam: string = ''): Promise<any> {
    const commendURL = queryParam ? commend + '?' + queryParam : commend;
    const response = await fetch(commendURL, {
      method: method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return await response.json();
  }
}
