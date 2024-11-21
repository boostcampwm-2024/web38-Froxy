import { http } from 'msw';
import { mockGetGistDetail, mockGetUserGistList } from './gistResolvers';
import {
  mockGetHistory,
  mockGetHistoryList,
  mockGetTagList,
  mockGetUserLotusList,
  mockPostCodeRun,
  mockPostTag
} from './historyResolvers';
import { deleteLotus, getLotusDetail, getPublicLotusList, patchLotus, postCreateLotus } from './lotusResolvers';
import { mockGetLogin, mockGetUserInfo, mockLogin, mockLogout, mockPatchUserInfo } from './userResolvers';

export const handlers = [
  // user
  http.get(`/api/user`, mockGetUserInfo),
  http.patch(`/api/user`, mockPatchUserInfo),
  http.post(`/api/user/login`, mockLogin),
  http.get(`/api/user/login`, mockGetLogin),
  http.post(`/api/user/logout`, mockLogout),
  http.get(`/api/user/lotus`, mockGetUserLotusList),
  http.get(`/api/user/gist`, mockGetUserGistList),
  http.get(`/api/user/gist/:gistId`, mockGetGistDetail),
  // lotus
  http.get(`/api/lotus`, getPublicLotusList),
  http.get(`/api/lotus/:lotusId`, getLotusDetail),
  http.post(`/api/lotus`, postCreateLotus),
  http.patch(`/api/lotus/:id`, patchLotus),
  http.delete(`/api/lotus/:id`, deleteLotus),
  // history
  http.get(`/api/lotus/:lotusId/history`, mockGetHistoryList),
  http.post(`/api/lotus/:lotusId/history`, mockPostCodeRun),
  http.get(`/api/lotus/:lotusId/history/:historyId`, mockGetHistory),

  // tag
  http.get(`/api/tag`, mockGetTagList),
  http.post(`/api/tag`, mockPostTag)
];
