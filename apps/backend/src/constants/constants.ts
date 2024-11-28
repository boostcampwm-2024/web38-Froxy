export const GIST_AUTH_HEADER = (gitToken: string = null) => {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${gitToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };
};
export enum HISTORY_STATUS {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum SUPPORTED_LANGUAGES {
  JS = '.js'
}

export const MAX_CONTAINER_CNT = 6;
