import { Injectable } from '@nestjs/common';
import { GistApiFileListDto } from './dto/gistApiFileList.dto';
import { GistApiFileDto } from './dto/gistApiFile.dto';

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
      const gistFiles: GistApiFileListDto[] = data
        .filter((gistfiltering: GistApiFileListDto) => {
          return gistfiltering.id && gistfiltering.description && gistfiltering.files && gistfiltering.owner;
        })
        .map((gist: GistApiFileListDto) => {
          const fileArr: GistApiFileDto[] = Object.keys(gist.files).map((key) => ({
            file_name: key,
            raw_url: gist.files[key].raw_url,
            type: gist.files[key].type,
            language: gist.files[key].language,
            size: gist.files[key].size
          }));

          return {
            id: gist.id,
            description: gist.description,
            files: fileArr,
            owner: {
              login: gist.owner.login,
              id: gist.owner.id,
              avatar_url: gist.owner.avatar_url
            }
          };
        });
      gistList.push(...gistFiles);
    }
    return gistList;
  }

  async getGistById(id: string): Promise<GistApiFileListDto> {
    const data = await this.gistReq('GET', `https://api.github.com/gists/${id}`);

    const fileArr: GistApiFileDto[] = Object.keys(data.files).map((key) => ({
      file_name: key,
      raw_url: data.files[key].raw_url,
      type: data.files[key].type,
      language: data.files[key].language,
      size: data.files[key].size
    }));

    const gist: GistApiFileListDto = {
      id: data.id,
      description: data.description,
      files: fileArr,
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

    const fileArr: GistApiFileDto[] = Object.keys(mostRecentData.files).map((key) => ({
      file_name: key,
      raw_url: mostRecentData.files[key].raw_url,
      type: mostRecentData.files[key].type,
      language: mostRecentData.files[key].language,
      size: mostRecentData.files[key].size
    }));

    const gist: GistApiFileListDto = {
      id: mostRecentData.id,
      description: mostRecentData.description,
      files: fileArr,
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
