import { http } from 'msw';
import { mockGetGistDetail, mockGetUserGistList } from './gistResolvers';
import {
  mockDeleteLotus,
  mockGetHistory,
  mockGetHistoryList,
  mockGetLotusDetail,
  mockGetPublicLotusList,
  mockGetTagList,
  mockGetUserLotusList,
  mockPatchLotus,
  mockPostCodeRun,
  mockPostCreateLotus,
  mockPostTag
} from './lotusResolvers';
import { mockGetUserInfo, mockLogin, mockLogout, mockPatchUserInfo } from './userResolvers';

export const handlers = [
  http.get(`${import.meta.env.VITE_API_BASE_URL}/user`, mockGetUserInfo),
  http.patch(`${import.meta.env.VITE_API_BASE_URL}/user`, mockPatchUserInfo),
  http.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`, mockLogin),
  http.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`, mockLogout),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/user/:id/lotus`, mockGetUserLotusList),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/user/gist`, mockGetUserGistList),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/user/gist/:gistId`, mockGetGistDetail),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/lotus`, mockGetPublicLotusList),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/lotus/:lotusId`, mockGetLotusDetail),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/lotus/:lotusId/history`, mockGetHistoryList),
  http.post(`${import.meta.env.VITE_API_BASE_URL}/lotus/:lotusId/history`, mockPostCodeRun),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/lotus/:lotusId/history/:historyId`, mockGetHistory),
  http.post(`${import.meta.env.VITE_API_BASE_URL}/lotus`, mockPostCreateLotus),
  http.patch(`${import.meta.env.VITE_API_BASE_URL}/lotus/:id`, mockPatchLotus),
  http.delete(`${import.meta.env.VITE_API_BASE_URL}/lotus/:id`, mockDeleteLotus),
  http.get(`${import.meta.env.VITE_API_BASE_URL}/tag`, mockGetTagList),
  http.post(`${import.meta.env.VITE_API_BASE_URL}/tag`, mockPostTag)
];
