import { http } from 'msw';
import { getGistDetail, getUserGistList } from './controller/gistController';
import { getHistory, getHistoryList, postCodeRun } from './controller/historyController';
import {
  deleteLotus,
  getLotusDetail,
  getPublicLotusList,
  getUserLotusList,
  patchLotus,
  postCreateLotus
} from './controller/lotusController';
import { getLogin, getUserInfo, patchUserInfo } from './controller/userController';

const apiUrl = (path: string) => `${import.meta.env.VITE_API_URL}${path}`;

export const handlers = [
  // user
  http.get(apiUrl(`/api/user`), getUserInfo),
  http.patch(apiUrl(`/api/user`), patchUserInfo),
  http.get(apiUrl(`/api/user/login/callback`), getLogin),
  http.get(apiUrl(`/api/user/lotus`), getUserLotusList),
  // gist
  http.get(apiUrl(`/api/user/gist`), getUserGistList),
  http.get(apiUrl(`/api/user/gist/:gistId`), getGistDetail),
  // lotus
  http.get(apiUrl(`/api/lotus`), getPublicLotusList),
  http.get(apiUrl(`/api/lotus/:lotusId`), getLotusDetail),
  http.post(apiUrl(`/api/lotus`), postCreateLotus),
  http.patch(apiUrl(`/api/lotus/:id`), patchLotus),
  http.delete(apiUrl(`/api/lotus/:id`), deleteLotus),
  http.get(apiUrl(`/api/lotus`), getPublicLotusList),
  http.get(apiUrl(`/api/lotus/:lotusId`), getLotusDetail),
  http.post(apiUrl(`/api/lotus`), postCreateLotus),
  http.patch(apiUrl(`/api/lotus/:id`), patchLotus),
  http.delete(apiUrl(`/api/lotus/:id`), deleteLotus),
  // history
  http.get(apiUrl(`/api/lotus/:lotusId/history`), getHistoryList),
  http.post(apiUrl(`/api/lotus/:lotusId/history`), postCodeRun),
  http.get(apiUrl(`/api/lotus/:lotusId/history/:historyId`), getHistory)
];
