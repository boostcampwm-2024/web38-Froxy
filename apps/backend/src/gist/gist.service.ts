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
      const response = await fetch(`https://api.github.com/gists?${queryParam}`, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.gittoken}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      const data = await response.json();

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
    const response = await fetch(`https://api.github.com/gists/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const data = await response.json();

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

  // async getMostRecentGistInUser(): Promise<any> {
  //   const page = 1;
  //   const perPage = 1;
  //   const octokit = new Octokit({
  //     auth: ''
  //   });
  //   const response = await octokit.request('GET /gists', {
  //     headers: {
  //       'X-GitHub-Api-Version': '2022-11-28'
  //     },
  //     page: page,
  //     per_page: perPage
  //   });
  //   if (response.data.length === 0) {
  //     return null;
  //   }
  //   const mostRecentData = response.data[0];
  //   const fileKeyArr = Object.keys(mostRecentData.files);
  //   const fileArr: GistFile[] = [];
  //   fileKeyArr.forEach((key) => {
  //     fileArr.push({
  //       file_name: key,
  //       raw_url: mostRecentData.files[key].raw_url,
  //       type: mostRecentData.files[key].type,
  //       language: mostRecentData.files[key].language,
  //       size: mostRecentData.files[key].size
  //     });
  //   });
  //   const result = {
  //     id: mostRecentData.id,
  //     description: mostRecentData.description,
  //     files: [...fileArr],
  //     user: {
  //       userName: mostRecentData.owner.login,
  //       id: mostRecentData.owner.id,
  //       avatar_url: mostRecentData.owner.avatar_url
  //     }
  //   };
  //   console.log(result);
  //   return result;
  // }

  async getCommitsForAGist(gist_id: string, pageIdx = 1) {
    const page = pageIdx;
    const perPage = 5;
    const params = {
      page: page.toString(),
      per_page: perPage.toString()
    };
    const queryParam = new URLSearchParams(params).toString();
    const response = await fetch(`https://api.github.com/gists/${gist_id}/commits?${queryParam}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gittoken}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return await response.json();
  }
}
